import {Metadata} from "next"
import {Separator} from "@/components/ui/separator";
import {SidebarNav} from "./components/sidebar-nav";
import {LoggedLayout} from "@/components/layout/logged-layout";
import React from "react";

export const metadata: Metadata = {
    title: "Settings",
    description: "instamint settings page",
}

const sidebarNavItems = [
    {
        title: "TEA BAGs list",
        href: "/tea-bags",
        buttonVariant: "secondary",
    },
    {
        title: "Reset password",
        href: "/forgot-password",
        buttonVariant: "secondary",
    },
    {
        title: "Reset email",
        href: "/reset-email",
        buttonVariant: "secondary",
    },
    {
        title: "Log out",
        href: "/logout",
        buttonVariant: "secondary",
    },
    {
        title: "Delete account",
        href: "/delete-account",
        buttonVariant: "destructive",
    },
]

interface SettingsLayoutProps {
    children: React.ReactNode
}

export default function SettingsLayout({children}: SettingsLayoutProps) {
    return (
        <LoggedLayout headerText={""} selectedNavigation={"settings"}>

            <div className="p-5 md:p-10 md:pb-16">
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                    <p className="text-muted-foreground">
                        Manage your account settings.
                    </p>
                </div>
                <Separator className="my-6"/>
                <div className="flex flex-col space-y-8 md:flex-row md:space-x-12 md:space-y-0">
                    <aside className="md:w-1/5">
                        <SidebarNav items={sidebarNavItems}/>
                    </aside>
                    {/* <div className="flex-1 md:max-w-2xl">{children}</div> */}
                </div>
            </div>

{/*
            {props.children}
*/}

        </LoggedLayout>


    )
}
