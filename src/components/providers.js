import { ThemeProvider } from "./theme-provider";
import { AuthContextProvider } from "@/context/AuthContext";

export default function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthContextProvider>
        {children}
      </AuthContextProvider>
    </ThemeProvider>
  );
}
