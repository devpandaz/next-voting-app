"use client";

import { ThemeProvider } from "./theme-provider";
import { AuthContextProvider } from "@/context/AuthContext";
import React from "react";
import { NovuProvider } from "@novu/notification-center";

export default function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthContextProvider>
        {
          /*
        <NovuProvider
          subscriberId={process.env.NOVU_SUBSCRIBER_ID}
          applicationIdentifier={"gxWba-unrgxi"}
        >
        */
        }
        {children}
        {
          /*
        </NovuProvider>
        */
        }
      </AuthContextProvider>
    </ThemeProvider>
  );
}
