'use client';

import {useLocale} from 'next-intl';
import {usePathname, useRouter} from 'next/navigation';

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
        <select
            onChange={e => changeLanguage(e.target.value)}
            value={currentLocale}
            className='rounded-md border border-gray-300 bg-white px-3 py-2 text-black dark:border-gray-600 dark:bg-black dark:text-white'
        >
            <option value='ru'>Russian</option>
            <option value='en'>English</option>
        </select>
    );
};
