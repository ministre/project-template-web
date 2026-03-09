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
                                <Link href='/profile' className={navigationMenuTriggerStyle()}>
                                    <User className="mr-2 h-4 w-4" />
                                    {t("profile")}
                                </Link>
                            </NavigationMenuLink>
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
