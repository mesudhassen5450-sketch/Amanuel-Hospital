/**
 * Web Audio API utility for notification pings and ringtones
 * Uses browser-native synthesized tones to avoid static file 404 errors
 */

export class AudioNotification {
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  private ringInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Initialize AudioContext on user interaction to comply with browser policies
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  /**
   * Play a light notification ping for availability requests
   */
  async playNotificationPing(): Promise<void> {
    if (!this.audioContext || this.isPlaying) return;

    try {
      // Resume audio context if suspended (browser policy)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.isPlaying = true;
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime); // A5
      oscillator.frequency.exponentialRampToValueAtTime(440, this.audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.3);

      setTimeout(() => {
        this.isPlaying = false;
      }, 300);
    } catch (error) {
      console.error('Error playing notification ping:', error);
      this.isPlaying = false;
    }
  }

  /**
   * Start continuous ringtone for incoming calls
   */
  startRingtone(): void {
    if (!this.audioContext || this.isPlaying) return;

    try {
      // Resume audio context if suspended
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      this.isPlaying = true;
      this.playRingtoneCycle();

      // Repeat ringtone every 2 seconds
      this.ringInterval = setInterval(() => {
        this.playRingtoneCycle();
      }, 2000);
    } catch (error) {
      console.error('Error starting ringtone:', error);
      this.isPlaying = false;
    }
  }

  /**
   * Play a single ringtone cycle
   */
  private playRingtoneCycle(): void {
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      // Classic telephone ring pattern: two tones
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime); // A4
      oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime + 0.2); // C5
      oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime + 0.3);

      gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8);

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.8);
    } catch (error) {
      console.error('Error playing ringtone cycle:', error);
    }
  }

  /**
   * Stop any playing audio (ringtone or notification)
   */
  stop(): void {
    if (this.ringInterval) {
      clearInterval(this.ringInterval);
      this.ringInterval = null;
    }

    if (this.oscillator) {
      try {
        this.oscillator.stop();
      } catch (error) {
        // Ignore errors when stopping already stopped oscillator
      }
      this.oscillator = null;
    }

    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
      } catch (error) {
        // Ignore errors when disconnecting
      }
      this.gainNode = null;
    }

    this.isPlaying = false;
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Singleton instance for app-wide use
let audioNotificationInstance: AudioNotification | null = null;

export function getAudioNotification(): AudioNotification {
  if (!audioNotificationInstance) {
    audioNotificationInstance = new AudioNotification();
  }
  return audioNotificationInstance;
}

export function destroyAudioNotification(): void {
  if (audioNotificationInstance) {
    audioNotificationInstance.destroy();
    audioNotificationInstance = null;
  }
}
