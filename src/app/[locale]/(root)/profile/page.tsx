import { setRequestLocale } from "next-intl/server";
import { ProfileContent } from "@/components/ProfileContent";

export default async function Profile({params,}: { params: Promise<{ locale: string }>; }) {
    const {locale} = await params;

    setRequestLocale(locale);

    return <ProfileContent />;
}
