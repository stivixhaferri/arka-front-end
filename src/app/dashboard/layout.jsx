import { AppSidebar } from "@/components/app-sidebar"
import { domain } from "@/lib/consts";
import { currentUser } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"



export default async function layout({children}) {

  const user = await currentUser()

  if (!user) return <div>Not signed in</div>;


  const myEmail = user.emailAddresses[0].emailAddress
  // const res = await fetch(`${domain}clerkuser/${myEmail}`);
  // const data = await res.json();


  // if(res.status == 404){
  //   redirect('/')
  // }


  
  return (
    (<SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)"
        }
      }>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>)
  );
}
