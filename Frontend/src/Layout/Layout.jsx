import { Outlet } from "react-router";
import { AppSidebar } from "../components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import Header from "./Header/Header";
export function Layout() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* <Header /> */}
          <div className="flex flex-1 flex-col gap-4 p-4">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
