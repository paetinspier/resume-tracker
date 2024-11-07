import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  LayoutGrid,
  LayoutList,
  FileUser,
  FileText,
  Building,
  UserPen,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ModeToggle } from "./mode-toggle";

const items = [
  {
    title: "Applications",
    url: "/portal",
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
  {
    title: "Jobs",
    url: "/portal/jobs",
    icon: Building,
  },
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
  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-4 flex flex-row justify-start items-center gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>Paetin Nelson</div>
          <ModeToggle />
        </div>
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
