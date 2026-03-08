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
        >
            <option value='ru'>Russian</option>
            <option value='en'>English</option>
        </select>
    );
};
