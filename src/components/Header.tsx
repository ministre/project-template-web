"use client";

import {useState, useEffect} from "react";
import {Link, useRouter} from '@/i18n/navigation';
import {SelectLanguage} from "@/components/SelectLanguage";
import {ThemeToggle} from "@/components/ThemeToggle";
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {Home, User, LogOut, Bug} from "lucide-react";
import {useTranslations} from "next-intl";
import {useAuth} from "@/hooks/useAuth";

export const Header = () => {
    const t = useTranslations("Navigation");
    const { logout } = useAuth();
    const router = useRouter();
    const [hasToken, setHasToken] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const checkToken = () => {
            const token = localStorage.getItem("accessToken");
            setHasToken(!!token);
        };
        
        checkToken();
        
        // Listen for storage changes (e.g., logout in another tab)
        window.addEventListener("storage", checkToken);
        
        // Check periodically for token changes
        const intervalId = setInterval(checkToken, 500);
        
        return () => {
            window.removeEventListener("storage", checkToken);
            clearInterval(intervalId);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setHasToken(false);
        router.push("/");
    };
    
    return (
        <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-primary text-primary-foreground dark:bg-card dark:text-card-foreground'>
            <div className='flex h-12 w-full items-center justify-between px-4'>
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link href='/' className={navigationMenuTriggerStyle()}>
                                    <Home className="mr-2 h-4 w-4" />
                                    {t("home")}
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link href='/debug' className={navigationMenuTriggerStyle()}>
                                    <Bug className="mr-2 h-4 w-4" />
                                    {t("debug")}
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                <div className='flex items-center gap-2'>
                    <SelectLanguage/>
                    <ThemeToggle/>
                    {mounted && (
                        hasToken ? (
                            <>
                                <Link 
                                    href='/profile' 
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-transparent text-sm font-medium transition-colors hover:bg-primary-foreground/20 focus:bg-primary-foreground/20 focus:outline-none dark:hover:bg-secondary dark:focus:bg-secondary"
                                    aria-label={t("profile")}
                                >
                                    <User className="h-4 w-4" />
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-transparent text-sm font-medium transition-colors hover:bg-primary-foreground/20 focus:bg-primary-foreground/20 focus:outline-none dark:hover:bg-secondary dark:focus:bg-secondary"
                                    aria-label={t("logout")}
                                >
                                    <LogOut className="h-4 w-4" />
                                </button>
                            </>
                        ) : (
                            <Link 
                                href='/login' 
                                className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-transparent text-sm font-medium transition-colors hover:bg-primary-foreground/20 focus:bg-primary-foreground/20 focus:outline-none dark:hover:bg-secondary dark:focus:bg-secondary"
                                aria-label={t("login")}
                            >
                                <User className="h-4 w-4" />
                            </Link>
                        )
                    )}
                </div>
            </div>
        </header>
    );
};
