"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Calendar,
  LayoutList,
  FileUser,
  FileText,
  UserPen,
  ChartPie,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ModeToggle } from "./mode-toggle";
import { useAuth } from "@/lib/AuthContext";

const items = [
  {
    title: "Dashboard",
    url: "/portal/dashboard",
    icon: ChartPie,
  },
  {
    title: "Applications",
    url: "/portal/applications",
    icon: LayoutList,
  },
  {
    title: "Resumes",
    url: "/portal/resumes",
    icon: FileUser,
  },
  {
    title: "Cover Letters",
    url: "/portal/coverletters",
    icon: FileText,
  },
  // {
  //   title: "Jobs",
  //   url: "/portal/jobs",
  //   icon: Building,
  // },
  {
    title: "Calendar",
    url: "/portal/calendar",
    icon: Calendar,
  },
];

const accountItems = [
  {
    title: "Profile",
    url: "/portal/profile",
    icon: UserPen,
  },
];

export function AppSidebar() {
  const { user } = useAuth();
  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-4 flex flex-row justify-between items-center gap-4 overflow-hidden">
          <Avatar>
            <AvatarImage
              src={user?.photoURL || "https://github.com/shadcn.png"}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <ModeToggle />
        </div>

        <div className="px-4">{user?.displayName || user?.email}</div>
        <SidebarGroup>
          <SidebarGroupLabel>Job Applications</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
