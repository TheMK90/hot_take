import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginView } from "@/components/LoginView";

export const metadata: Metadata = {
  title: "Log in or sign up — Hot Take",
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginView />
    </Suspense>
  );
}
