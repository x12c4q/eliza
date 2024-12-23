import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router-dom";
import WalletContextProvider from "@/components/WalletContextProvider";
import { WalletButton } from "./components/WalletButton"; // Add this import


export default function Layout() {
    return (
        <WalletContextProvider>
            <SidebarProvider>
                <AppSidebar />
                <WalletButton /> {/* Add this line */}
                <Outlet />
            </SidebarProvider>
        </WalletContextProvider>
    );
}
