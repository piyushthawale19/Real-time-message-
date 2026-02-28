import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";

export const metadata = {
  title: "Pulse — Messenger",
  description: "Real-time messaging, beautifully crafted",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-surface-900 text-white antialiased font-sans">
        <AuthProvider>
          <SocketProvider>{children}</SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
