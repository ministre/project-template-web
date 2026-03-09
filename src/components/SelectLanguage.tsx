'use client';

import {useLocale} from 'next-intl';
import {usePathname, useRouter} from 'next/navigation';

const languages = [
    { code: 'ru', flag: '🇷🇺' },
    { code: 'en', flag: '🇬🇧' },
];

export const SelectLanguage = () => {
    const router = useRouter();
    const pathName = usePathname();
    const currentLocale = useLocale();

    const changeLanguage = (newLocale: string) => {
        const newPathname = pathName.replace(
            `/${currentLocale}`,
            `/${newLocale}`
        );
        router.push(newPathname);
    };

    return (
        <div className="flex gap-1">
            {languages.map(({ code, flag }) => (
                <button
                    key={code}
                    onClick={() => changeLanguage(code)}
                    className={`rounded-md px-2 py-1 text-xl transition-opacity hover:opacity-80 ${
                        currentLocale === code
                            ? 'bg-primary/20 ring-1 ring-primary'
                            : 'opacity-60 hover:opacity-100'
                    }`}
                    title={code.toUpperCase()}
                >
                    {flag}
                </button>
            ))}
        </div>
    );
};
