"use client";

import { ThemeProvider } from "./theme-provider";
import { AuthContextProvider } from "@/context/AuthContext";
import React from "react";

export default function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthContextProvider>
        {children}
      </AuthContextProvider>
    </ThemeProvider>
  );
}
