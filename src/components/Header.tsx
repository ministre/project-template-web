import {Link} from '@/i18n/navigation';
import {SelectLanguage} from "@/components/SelectLanguage";
import {ThemeToggle} from "@/components/ThemeToggle";

export const Header = () => {
    return (
        <header className='container mx-auto mb-7 flex items-center justify-between py-4'>
            <div className='flex items-center gap-5'>
                <Link
                    href='/'
                    className='text-xl font-medium hover:underline hover:font-bold'
                >
                    Home
                </Link>
                <Link
                    href='/profile'
                    className='text-xl font-medium hover:underline hover:font-bold'
                >
                    Profile
                </Link>
            </div>

            <div className='flex items-center gap-3'>
                <SelectLanguage/>
                <ThemeToggle/>
            </div>
        </header>
    );
};
