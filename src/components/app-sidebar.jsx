"use client"

import * as React from "react"
import {
  IconDashboard,
  IconFolder,
  IconInnerShadowTop,
  IconListDetails,
} from "@tabler/icons-react"
import { UsersRound } from 'lucide-react';
import { MapPinned , Building  , BookMarked   } from 'lucide-react';
import { NotepadTextDashed } from 'lucide-react';
import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "arkahome",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconDashboard,
      devMode: false
    },
    {
      title: "Properties",
      url: "/dashboard/properties",
      icon: Building,
      devMode: false
    },
     {
      title: "Booking Requests",
      url: "/dashboard/bookings",
      icon: BookMarked ,
      devMode: false
    },
    {
      title: "Team",
      url: "/dashboard/team",
      icon: IconListDetails,
      devMode: false
    },
    {
      title: "Offices",
      url: "/dashboard/offices",
      icon: IconFolder,
      devMode: false
    },
    {
      title: "Zones",
      url: "/dashboard/zones",
      icon: MapPinned,
      devMode: false
    },
     {
      title: "Blog",
      url: "/dashboard/blog",
      icon: NotepadTextDashed ,
      devMode: true
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: UsersRound ,
      devMode: false
    },
    
  ],

}

export function AppSidebar({
  ...props
}) {
  return (
    (<Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
       
      </SidebarContent>
      <SidebarFooter>

      </SidebarFooter>
    </Sidebar>)
  );
}
