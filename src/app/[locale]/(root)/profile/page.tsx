import {getTranslations, setRequestLocale} from "next-intl/server";

export default async function Profile({params,}: { params: Promise<{ locale: string }>; }) {
    const {locale} = await params;

    setRequestLocale(locale);

    const t = await getTranslations('UserProfilePage');

    return (<div>{t('title')}</div>);
}