"use client";

import { useOAuth } from "@/components/auth/oauth/use-oauth";
import { useEffect } from "react";

const ENV = process.env.NODE_ENV;

const PLC_DIRECTORY_URL: string | undefined = undefined;

const HANDLE_RESOLVER_URL = "https://bsky.social";

const SIGN_UP_URL = "https://bsky.social";

const clientId = `http://localhost?${new URLSearchParams({
  scope: "atproto transition:generic",
  redirect_uri: Object.assign(new URL(window.location.origin), {
    pathname: "/oauth/callback",
    search: new URLSearchParams({
      env: ENV,
      handle_resolver: HANDLE_RESOLVER_URL,
      sign_up_url: SIGN_UP_URL,
      // ...(PLC_DIRECTORY_URL && { plc_directory_url: PLC_DIRECTORY_URL })
    }).toString(),
  }).href,
})}`;

export default function AtProtoAuth() {
  const { signIn } = useOAuth({
    clientId,
    plcDirectoryUrl: PLC_DIRECTORY_URL,
    handleResolver: HANDLE_RESOLVER_URL,
    allowHttp: ENV === "development" || ENV === "test",
  });

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
        signIn(data);
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
  }, [signIn]);

  return (
    <button
      onClick={() => {
        signIn("lebaothinh.bsky.social");
      }}
    >
      SignIn
    </button>
  );
}
