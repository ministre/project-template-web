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
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-secondary text-sm font-medium transition-colors hover:bg-accent"
        >
            {currentLocale.toUpperCase()}
        </button>
    );
};
