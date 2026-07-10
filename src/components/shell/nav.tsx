import type { ReactNode } from "react";
import { GitFork, LayoutDashboard, ListOrdered, SlidersHorizontal, Trophy } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Overview", icon: <LayoutDashboard /> },
  { href: "/standings", label: "Standings", icon: <ListOrdered /> },
  { href: "/bracket", label: "Bracket", icon: <GitFork /> },
  { href: "/console", label: "Console", icon: <SlidersHorizontal /> },
  { href: "/tournaments", label: "Tournaments", icon: <Trophy /> },
];
