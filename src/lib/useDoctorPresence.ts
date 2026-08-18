import { useState, useEffect, useCallback, useRef } from "react";
import { doctors } from "./site-data";
import { supabase } from "./supabase";
import { useStaffAuth } from "./staff-auth";

export interface DoctorAccount {
  id: number | string;
  displayName: string;
  username: string;
  role: string;
  isOnline: boolean;
  isActive: boolean;
  lastSeen: string | null;
}

/**
 * Hook for tracking doctor presence in real-time
 * Fetches doctor data from database and provides online/offline status
 * Uses Supabase Realtime for real-time updates (no polling)
 */
export function useDoctorsPresence() {
  const [doctorsList, setDoctorsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial fetch of doctors from database
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);

        // Fetch doctors directly from database
        const { data, error } = await supabase
          .from("staff_accounts")
          .select("id, display_name, username, role, is_active, is_online, last_seen")
          .eq("role", "doctor");

        if (error) {
          console.error("Database error fetching doctors:", error);
          throw new Error(`Database error: ${error.message}`);
        }

        console.log("Fetched doctors from database:", data);

        if (data && data.length > 0) {
          // Map database doctors to the expected format
          const doctorsFromDB = data.map((doc: any) => ({
            id: doc.id.toString(),
            name: doc.display_name || doc.username,
            specialty: "General Practitioner", // Default specialty
            experience: 10, // Default experience
            isOnline: Boolean(doc.is_online),
            photo: "/doctor1.jpg", // Use existing photo from public directory
          }));

          console.log("Mapped doctors with online status:", doctorsFromDB);
          setDoctorsList(doctorsFromDB);
        } else {
          console.log("No doctors in database, falling back to static data");
          // Fall back to static data if no doctors in database
          setDoctorsList(doctors);
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
        // Fall back to static data on error
        setDoctorsList(doctors);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();

    // Subscribe to Supabase Realtime for staff_accounts UPDATE events
    const channel = supabase
      .channel('doctors-presence')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'staff_accounts',
          filter: 'role=eq.doctor',
        },
        (payload) => {
          console.log('Doctor presence UPDATE detected:', payload);
          const updatedDoc = payload.new as any;

          // Update local state dynamically from the payload
          setDoctorsList(prev => {
            return prev.map(doc => {
              if (doc.id === updatedDoc.id.toString()) {
                return {
                  ...doc,
                  isOnline: Boolean(updatedDoc.is_online),
                };
              }
              return doc;
            });
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const onlineDoctors = doctorsList.filter((doc) => doc.isOnline);
  const offlineDoctors = doctorsList.filter((doc) => !doc.isOnline);

  return {
    doctors: doctorsList,
    onlineDoctors,
    offlineDoctors,
    loading,
    refresh: () => {
      // Manual refresh function if needed
      setLoading(true);
      supabase
        .from("staff_accounts")
        .select("id, display_name, username, role, is_active, is_online, last_seen")
        .eq("role", "doctor")
        .then(({ data, error }) => {
          if (error) {
            console.error("Database error fetching doctors:", error);
            return;
          }
          if (data && data.length > 0) {
            const doctorsFromDB = data.map((doc: any) => ({
              id: doc.id.toString(),
              name: doc.display_name || doc.username,
              specialty: "General Practitioner",
              experience: 10,
              isOnline: Boolean(doc.is_online),
              photo: "/doctor1.jpg",
            }));
            setDoctorsList(doctorsFromDB);
          }
          setLoading(false);
        });
    },
  };
}

/**
 * Hook for tracking individual doctor presence with heartbeat
 * Updates doctor status in Supabase Realtime with periodic heartbeat
 *
 * @param doctorUsername - The username of the doctor to track (string like "doctor" or "doctor2")
 * @param isAvailable - Whether the doctor is available for calls
 */
export function useDoctorPresence(doctorUsername: string | undefined, isAvailable: boolean = true) {
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!doctorUsername) return;

    // 1. Immediately set online state on mount
    const setOnline = async () => {
      try {
        await supabase
          .from('staff_accounts')
          .update({ is_online: true, last_seen: new Date().toISOString() })
          .eq('username', doctorUsername);
        console.log(`[Doctor Presence] Doctor ${doctorUsername} set to online`);
      } catch (error) {
        console.error("Error setting doctor online:", error);
      }
    };

    setOnline();

    // 2. Heartbeat loop to keep last_seen updated (every 30 seconds)
    const startHeartbeat = () => {
      heartbeatIntervalRef.current = setInterval(async () => {
        if (isAvailable) {
          try {
            await supabase
              .from('staff_accounts')
              .update({ last_seen: new Date().toISOString() })
              .eq('username', doctorUsername);
          } catch (error) {
            console.error("Heartbeat error:", error);
          }
        }
      }, 30000); // 30 seconds
    };

    startHeartbeat();

    // 3. Mark offline on unmount / navigate away
    const setOffline = async () => {
      try {
        await supabase
          .from('staff_accounts')
          .update({ is_online: false, last_seen: new Date().toISOString() })
          .eq('username', doctorUsername);
        console.log(`[Doctor Presence] Doctor ${doctorUsername} set to offline`);
      } catch (error) {
        console.error("Error setting doctor offline:", error);
      }
    };

    // Handle window close
    const handleUnload = () => {
      setOffline();
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      setOffline();
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [doctorUsername, isAvailable]);
}

/**
 * Mock version for development without real socket connection
 * In production, replace with actual WebSocket/Supabase integration
 */
export function useMockDoctorPresence(doctorId: string | undefined) {
  useEffect(() => {
    if (!doctorId) return;

    console.log(`[Mock Presence] Doctor ${doctorId} is now online`);

    const handleUnload = () => {
      console.log(`[Mock Presence] Doctor ${doctorId} is now offline`);
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      console.log(`[Mock Presence] Doctor ${doctorId} is now offline`);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [doctorId]);
}
