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
            className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-transparent text-sm font-medium transition-colors hover:bg-primary-foreground/20 focus:bg-primary-foreground/20 focus:outline-none dark:hover:bg-secondary dark:focus:bg-secondary"
        >
            {currentLocale.toUpperCase()}
        </button>
    );
};
