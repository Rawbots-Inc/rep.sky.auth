"use client";

import { BrowserOAuthClient } from "@atproto/oauth-client-browser";
import { useEffect } from "react";

const ENV = process.env.NODE_ENV;

const HANDLE_RESOLVER_URL = "https://bsky.social";

const client = new BrowserOAuthClient({
  clientMetadata: {
    client_id: "https://rep-sky-auth.vercel.app/client-metadata.json",
    application_type: "web",
    client_name: "Repsky Auth",
    client_uri: "https://rep-sky-auth.vercel.app",
    dpop_bound_access_tokens: true,
    grant_types: ["authorization_code", "refresh_token"],
    redirect_uris: ["https://rep-sky-auth.vercel.app/oauth/callback"],
    response_types: ["code"],
    scope: "atproto transition:generic",
    token_endpoint_auth_method: "none",
  },
  handleResolver: HANDLE_RESOLVER_URL,
  allowHttp: ENV === "development" || ENV === "test",
});

export default function AtProtoAuth() {
  useEffect(() => {
    // Get the parent frame's origin from the offscreen iframe
    const PARENT_FRAME = document.location.ancestorOrigins[0];

    // Helper to send result back to the parent frame
    function sendResponse(result: unknown) {
      globalThis.parent.postMessage(JSON.stringify(result), PARENT_FRAME);
    }

    // Listen for messages sent to this iframe
    globalThis.addEventListener("message", (event) => {
      const { action, data } = event.data;

      if (action === "social-login") {
        client.signInPopup(data);
      }
    });

    // Setup BroadcastChannel for same-origin communication
    const channel = new BroadcastChannel("same-origin-comm");

    channel.onmessage = (event) => {
      const { type, fullPath } = event.data;

      if (type === "callbackPath") {
        console.log("✅ Received fullPath from child window:", fullPath);

        // Send the fullPath back to the parent frame
        sendResponse(fullPath);
      }
    };

    // Optional: clean up
    return () => {
      globalThis.removeEventListener("message", () => {});
      channel.close();
    };
  }, [client]);

  return (
    <button
      onClick={() => {
        client.signInPopup("lebaothinh.bsky.social");
      }}
    >
      SignIn
    </button>
  );
}
