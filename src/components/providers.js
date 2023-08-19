import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
