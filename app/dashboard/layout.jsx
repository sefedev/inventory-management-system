import React from "react";
import DashboardWrapper from "./DashboardWrapper";
import { SessionProvider } from "next-auth/react";

const Layout = ({ children }) => {
  return (
    <>
      <SessionProvider>
        <DashboardWrapper>{children}</DashboardWrapper>
      </SessionProvider>
    </>
  );
};

export default Layout;
