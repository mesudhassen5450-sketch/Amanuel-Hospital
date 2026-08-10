import { createFileRoute } from "@tanstack/react-router";
import { RtcTokenBuilder, RtcRole } from "agora-token";

export const Route = createFileRoute("/api/agora-token")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const { searchParams } = new URL(request.url);
        const channelName = searchParams.get("channelName");
        const uidStr = searchParams.get("uid") || "0";
        const uid = Number(uidStr) || 0;

        if (!channelName) {
          return new Response(
            JSON.stringify({ error: "channelName parameter is required" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        const appId =
          process.env.AGORA_APP_ID ||
          process.env.NEXT_PUBLIC_AGORA_APP_ID ||
          process.env.VITE_AGORA_APP_ID ||
          "db0b41794c224e549c92102892b75081";
        const appCertificate =
          process.env.AGORA_APP_CERTIFICATE || "0b2eb4cfdaec4881a3d07b3ae90bfb23";

        const role = RtcRole.PUBLISHER;
        const expirationTimeInSeconds = 3600; // 1 hour validity
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

        try {
          const token = (RtcTokenBuilder as any).buildTokenWithUid(
            appId,
            appCertificate,
            channelName,
            uid,
            role,
            privilegeExpiredTs,
            privilegeExpiredTs
          );

          return new Response(
            JSON.stringify({ token, appId, channelName }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (error: any) {
          return new Response(
            JSON.stringify({ error: error?.message || "Failed to build Agora token" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      },
    },
  },
});
