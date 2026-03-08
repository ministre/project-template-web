import {Link} from '@/i18n/navigation';
import {SelectLanguage} from "@/components/SelectLanguage";

export const Header = () => {
    return (
        <header className='container mx-auto mb-7 flex justify-between'>
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

            <SelectLanguage/>
        </header>
    );
};