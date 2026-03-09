'use client';

import {useLocale} from 'next-intl';
import {usePathname, useRouter} from 'next/navigation';

const languages = ['ru', 'en'] as const;

export const SelectLanguage = () => {
    const router = useRouter();
    const pathName = usePathname();
    const currentLocale = useLocale();

    const toggleLanguage = () => {
        const nextLocale = currentLocale === 'ru' ? 'en' : 'ru';
        const newPathname = pathName.replace(
            `/${currentLocale}`,
            `/${nextLocale}`
        );
        router.push(newPathname);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-card-foreground transition-colors hover:bg-accent"
        >
            {currentLocale.toUpperCase()}
        </button>
    );
};
