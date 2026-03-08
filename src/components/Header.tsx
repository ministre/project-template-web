"use client";

import {Link} from '@/i18n/navigation';
import {SelectLanguage} from "@/components/SelectLanguage";
import {ThemeToggle} from "@/components/ThemeToggle";
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {Home, User} from "lucide-react";
import {useTranslations} from "next-intl";

export const Header = () => {
    const t = useTranslations("Navigation");
    
    return (
        <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <div className='container mx-auto flex h-14 items-center justify-between px-4'>
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <Link href='/' legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    <Home className="mr-2 h-4 w-4" />
                                    {t("home")}
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href='/profile' legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    <User className="mr-2 h-4 w-4" />
                                    {t("profile")}
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                <div className='flex items-center gap-2'>
                    <SelectLanguage/>
                    <ThemeToggle/>
                </div>
            </div>
        </header>
    );
};
