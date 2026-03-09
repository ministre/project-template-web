import {Button} from "@/components/ui/button";
import {getTranslations, setRequestLocale} from "next-intl/server";

export default async function Home({params,}: { params: Promise<{ locale: string }>; }) {
    const {locale} = await params;

    setRequestLocale(locale);

    const t = await getTranslations('HomePage');

    return (
        <div>
            <div>{t('title')}</div>
            <div><Button variant="outline">{t('test')}</Button></div>
        </div>
    );
}