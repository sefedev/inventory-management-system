import StoreProvider from "@/redux";
import { SessionProvider } from "next-auth/react";
import React from "react";

const SessionWrapper = ({ children }) => {
  return (
    <SessionProvider>
      <StoreProvider>{children}</StoreProvider>
    </SessionProvider>
  );
};

export default SessionWrapper;
