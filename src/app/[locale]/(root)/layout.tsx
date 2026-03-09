import {Header} from "@/components/Header";

export default async function RootLayout({
                                             children,
                                             // params,
                                         }: {
    children: React.ReactNode;
    // params: Promise<{ locale: string }>;
}) {
    // const {locale} = await params;

    return (
        <div className='min-h-screen'>
            <Header/>
            <main className='w-full px-4'>{children}</main>
        </div>
    );
}
