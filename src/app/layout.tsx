import UserEditModal from "@/components/edit-user-modal";
import LoginModal from "@/components/login-modal";
import RegisterModal from "@/components/register-modal";
import ContextProviders from "@/context";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Twitter Clone",
  description: "Twitter Clone Next JS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ContextProviders>
        <body className={`antialiased`}>
          <LoginModal>
            <RegisterModal>
              <UserEditModal>{children}</UserEditModal>
            </RegisterModal>
          </LoginModal>
          <Toaster />
        </body>
      </ContextProviders>
    </html>
  );
}
