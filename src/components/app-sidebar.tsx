"use client"

import { useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"
import { 
  FileText,
  Home,
  Plus,
  Church,
  BookOpen,
  ChevronRight,
  ChevronDown,
  UserCheck,
  ClipboardList,
  Calendar,
  Settings,
  Library,
  Printer,
  Sparkles
} from "lucide-react"
import Link from "next/link"
import { UserProfile } from "@/components/user-profile"
import * as Collapsible from "@radix-ui/react-collapsible"

const mainItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
]

const petitionItems = [
  {
    title: "Create Petition",
    url: "/petitions/create",
    icon: Plus,
  },
  {
    title: "My Petitions",
    url: "/petitions",
    icon: FileText,
  },
]

const liturgyItems = [
  {
    title: "Liturgy Planning",
    url: "/liturgy-planning",
    icon: ClipboardList,
  },
  {
    title: "Liturgical Calendar",
    url: "/calendar",
    icon: Calendar,
  },
]

const ministryItems = [
  {
    title: "Ministers Directory",
    url: "/ministers",
    icon: UserCheck,
  },
]

const liturgicalReadingsItems = [
  {
    title: "My Readings",
    url: "/liturgical-readings",
    icon: BookOpen,
  },
  {
    title: "Create Readings",
    url: "/liturgical-readings/create",
    icon: Plus,
  },
  {
    title: "Readings Library",
    url: "/liturgical-readings/library",
    icon: Library,
  },
  {
    title: "Readings Wizard",
    url: "/liturgical-readings/wizard",
    icon: Sparkles,
  },
]

const readingsItems = [
  {
    title: "Reading Collections",
    url: "/readings",
    icon: Library,
  },
  {
    title: "Individual Readings",
    url: "/readings/library",
    icon: BookOpen,
  },
  {
    title: "Readings Printout",
    url: "/readings/printout",
    icon: Printer,
  },
]

const settingsItems = [
  {
    title: "Petition Definitions",
    url: "/definitions",
    icon: BookOpen,
  },
  {
    title: "Petition Settings",
    url: "/settings/petitions",
    icon: FileText,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const { isMobile, setOpenMobile } = useSidebar()
  const [isPetitionsOpen, setIsPetitionsOpen] = useState(true)
  const [isLiturgyOpen, setIsLiturgyOpen] = useState(true)
  const [isMinistryOpen, setIsMinistryOpen] = useState(true)
  const [isLiturgicalReadingsOpen, setIsLiturgicalReadingsOpen] = useState(true)
  const [isReadingsOpen, setIsReadingsOpen] = useState(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" onClick={handleLinkClick}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Church className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Liturgy.Faith</span>
                  <span className="truncate text-xs">Liturgical Tools</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Main navigation items */}
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} onClick={handleLinkClick}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {/* Petitions collapsible section */}
              <SidebarMenuItem>
                <Collapsible.Root open={isPetitionsOpen} onOpenChange={setIsPetitionsOpen}>
                  <Collapsible.Trigger asChild>
                    <SidebarMenuButton>
                      <FileText />
                      <span>Petitions</span>
                      {isPetitionsOpen ? (
                        <ChevronDown className="ml-auto transition-transform" />
                      ) : (
                        <ChevronRight className="ml-auto transition-transform" />
                      )}
                    </SidebarMenuButton>
                  </Collapsible.Trigger>
                  <Collapsible.Content>
                    <SidebarMenuSub>
                      {petitionItems.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={item.url} onClick={handleLinkClick}>
                              <item.icon />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </Collapsible.Content>
                </Collapsible.Root>
              </SidebarMenuItem>

              {/* Liturgy collapsible section */}
              <SidebarMenuItem>
                <Collapsible.Root open={isLiturgyOpen} onOpenChange={setIsLiturgyOpen}>
                  <Collapsible.Trigger asChild>
                    <SidebarMenuButton>
                      <ClipboardList />
                      <span>Liturgy</span>
                      {isLiturgyOpen ? (
                        <ChevronDown className="ml-auto transition-transform" />
                      ) : (
                        <ChevronRight className="ml-auto transition-transform" />
                      )}
                    </SidebarMenuButton>
                  </Collapsible.Trigger>
                  <Collapsible.Content>
                    <SidebarMenuSub>
                      {liturgyItems.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={item.url} onClick={handleLinkClick}>
                              <item.icon />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </Collapsible.Content>
                </Collapsible.Root>
              </SidebarMenuItem>

              {/* Ministry collapsible section */}
              <SidebarMenuItem>
                <Collapsible.Root open={isMinistryOpen} onOpenChange={setIsMinistryOpen}>
                  <Collapsible.Trigger asChild>
                    <SidebarMenuButton>
                      <UserCheck />
                      <span>Ministry</span>
                      {isMinistryOpen ? (
                        <ChevronDown className="ml-auto transition-transform" />
                      ) : (
                        <ChevronRight className="ml-auto transition-transform" />
                      )}
                    </SidebarMenuButton>
                  </Collapsible.Trigger>
                  <Collapsible.Content>
                    <SidebarMenuSub>
                      {ministryItems.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={item.url} onClick={handleLinkClick}>
                              <item.icon />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </Collapsible.Content>
                </Collapsible.Root>
              </SidebarMenuItem>

              {/* Liturgical Readings collapsible section */}
              <SidebarMenuItem>
                <Collapsible.Root open={isLiturgicalReadingsOpen} onOpenChange={setIsLiturgicalReadingsOpen}>
                  <Collapsible.Trigger asChild>
                    <SidebarMenuButton>
                      <BookOpen />
                      <span>Liturgical Readings</span>
                      {isLiturgicalReadingsOpen ? (
                        <ChevronDown className="ml-auto transition-transform" />
                      ) : (
                        <ChevronRight className="ml-auto transition-transform" />
                      )}
                    </SidebarMenuButton>
                  </Collapsible.Trigger>
                  <Collapsible.Content>
                    <SidebarMenuSub>
                      {liturgicalReadingsItems.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={item.url} onClick={handleLinkClick}>
                              <item.icon />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </Collapsible.Content>
                </Collapsible.Root>
              </SidebarMenuItem>

              {/* Readings collapsible section */}
              <SidebarMenuItem>
                <Collapsible.Root open={isReadingsOpen} onOpenChange={setIsReadingsOpen}>
                  <Collapsible.Trigger asChild>
                    <SidebarMenuButton>
                      <Library />
                      <span>Readings</span>
                      {isReadingsOpen ? (
                        <ChevronDown className="ml-auto transition-transform" />
                      ) : (
                        <ChevronRight className="ml-auto transition-transform" />
                      )}
                    </SidebarMenuButton>
                  </Collapsible.Trigger>
                  <Collapsible.Content>
                    <SidebarMenuSub>
                      {readingsItems.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={item.url} onClick={handleLinkClick}>
                              <item.icon />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </Collapsible.Content>
                </Collapsible.Root>
              </SidebarMenuItem>

              {/* Settings collapsible section */}
              <SidebarMenuItem>
                <Collapsible.Root open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                  <Collapsible.Trigger asChild>
                    <SidebarMenuButton>
                      <Settings />
                      <span>Settings</span>
                      {isSettingsOpen ? (
                        <ChevronDown className="ml-auto transition-transform" />
                      ) : (
                        <ChevronRight className="ml-auto transition-transform" />
                      )}
                    </SidebarMenuButton>
                  </Collapsible.Trigger>
                  <Collapsible.Content>
                    <SidebarMenuSub>
                      {settingsItems.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={item.url} onClick={handleLinkClick}>
                              <item.icon />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </Collapsible.Content>
                </Collapsible.Root>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  )
}