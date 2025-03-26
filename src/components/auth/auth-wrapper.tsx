import React from "react";
import { AuthProvider } from "./auth-provider";

export const ENV = process.env.NODE_ENV;

export const PLC_DIRECTORY_URL: string | undefined = undefined;

export const HANDLE_RESOLVER_URL = 'https://bsky.social';

export const SIGN_UP_URL = 'https://bsky.social';

const clientId = `http://localhost?${new URLSearchParams({
    scope: 'atproto transition:generic',
    redirect_uri: Object.assign(new URL('http://127.0.0.1:8080'), {
      pathname: '/info',
      hostname: '127.0.0.1',
      search: new URLSearchParams({
        env: ENV,
        handle_resolver: HANDLE_RESOLVER_URL,
        sign_up_url: SIGN_UP_URL
        // ...(PLC_DIRECTORY_URL && { plc_directory_url: PLC_DIRECTORY_URL })
      }).toString()
    }).href
  })}`;
  
export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider
      clientId={clientId}
      plcDirectoryUrl={PLC_DIRECTORY_URL}
      signUpUrl={SIGN_UP_URL}
      handleResolver={HANDLE_RESOLVER_URL}
      allowHttp={ENV === "development" || ENV === "test"}
    >
      {children}
    </AuthProvider>
  );
};
