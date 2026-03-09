"use client";

import {useState, useEffect} from "react";
import {Link, useRouter} from '@/i18n/navigation';
import {signOut} from "next-auth/react";
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
import {useTranslations, useLocale} from "next-intl";

export const Header = () => {
    const t = useTranslations("Navigation");
    const locale = useLocale();
    const router = useRouter();
    // Default to false - only show profile when token exists
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        // Check token on mount
        const token = localStorage.getItem("accessToken");
        setHasToken(!!token);
        
        // Subscribe to changes
        const handleTokenChange = () => {
            const currentToken = localStorage.getItem("accessToken");
            setHasToken(!!currentToken);
        };
        
        window.addEventListener("storage", handleTokenChange);
        window.addEventListener("tokenChanged", handleTokenChange);
        
        return () => {
            window.removeEventListener("storage", handleTokenChange);
            window.removeEventListener("tokenChanged", handleTokenChange);
        };
    }, []);

    const handleLogout = async () => {
        // Clear localStorage first
        localStorage.removeItem("accessToken");
        localStorage.removeItem("accessTokenExpiration");
        localStorage.removeItem("user");
        
        // Update state immediately
        setHasToken(false);
        
        // Dispatch custom event for other components
        window.dispatchEvent(new Event("tokenChanged"));
        
        // Sign out from NextAuth (clears HTTP-only cookies)
        await signOut({ redirect: false });
        
        // Redirect to login
        router.push("/login");
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
                        {hasToken && (
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href='/debug' className={navigationMenuTriggerStyle()}>
                                        <Bug className="mr-2 h-4 w-4" />
                                        {t("debug")}
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        )}
                    </NavigationMenuList>
                </NavigationMenu>

                <div className='flex items-center gap-2'>
                    <SelectLanguage/>
                    <ThemeToggle/>
                    {hasToken && (
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
                    )}
                </div>
            </div>
        </header>
    );
};
