"use client";

import { useEffect } from "react";

export default function Callback() {
  useEffect(() => {
    const channel = new BroadcastChannel("same-origin-comm");

    const fullPath =
      window.location.pathname + window.location.search + window.location.hash;

    channel.postMessage({ type: "callbackPath", fullPath });
    window.close()
  }, []);

  return null;
}
