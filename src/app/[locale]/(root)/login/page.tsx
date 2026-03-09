import { setRequestLocale } from "next-intl/server";
import { LoginForm } from "@/components/LoginForm";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <LoginForm />
    </main>
  );
}
