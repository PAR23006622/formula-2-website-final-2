"use client";

import { HomeIcon, TrophyIcon, UsersIcon, FlagIcon, CalendarIcon, InfoIcon, MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Driver Standings", href: "/driver-standings", icon: TrophyIcon },
  { name: "Team Standings", href: "/team-standings", icon: TrophyIcon },
  { name: "Teams & Drivers", href: "/teams-drivers", icon: UsersIcon },
  { name: "Race Calendar", href: "/calendar", icon: CalendarIcon },
  { name: "About", href: "/about", icon: InfoIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderIcon = (Icon: any) => {
    return <Icon className="h-5 w-5" aria-hidden="true" />;
  };

  if (isMobile) {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="mx-4 my-4">
            <div className="bg-[#0090d0] text-white rounded-2xl shadow-lg flex items-center h-14">
              <button
                onClick={toggleMenu}
                className="w-[48px] h-[48px] flex items-center justify-center hover:bg-white/10 transition-colors rounded-xl"
                aria-label="Toggle menu"
              >
                {renderIcon(MenuIcon)}
              </button>
              <div className="flex-1 text-center font-semibold">F2 Analytics</div>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={toggleMenu}
            aria-hidden="true"
          />
        )}

        <div
          className={cn(
            "fixed top-4 left-4 bottom-4 w-auto min-w-[200px] bg-[#0090d0] z-50 rounded-2xl shadow-lg transform transition-transform duration-300 ease-in-out",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-[calc(100%+16px)]"
          )}
        >
          <div className="flex h-14 items-center justify-between px-4">
            <span className="font-semibold text-white whitespace-nowrap">Menu</span>
            <button
              onClick={toggleMenu}
              className="p-3 rounded-xl hover:bg-white/10 transition-colors text-white ml-4"
              aria-label="Close menu"
            >
              {renderIcon(XIcon)}
            </button>
          </div>

          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-colors whitespace-nowrap",
                  pathname === item.href
                    ? "bg-white text-[#0090d0]"
                    : "text-white hover:bg-white/10"
                )}
              >
                <span className="mr-3">{renderIcon(item.icon)}</span>
                {item.name}
              </Link>
            ))}
            <div className="px-3 py-2">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </>
    );
  }

  return (
    <div className="hidden md:block fixed top-4 left-4 bottom-4 w-auto bg-[#0090d0]/90 backdrop-blur-md rounded-2xl shadow-lg">
      <div className="flex flex-col h-full">
        <div className="flex h-14 items-center px-6">
          <h1 className="text-lg font-bold text-white whitespace-nowrap">F2 Analytics</h1>
        </div>
        <nav className="flex-1 p-3 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 mb-1 whitespace-nowrap",
                  isActive
                    ? "bg-white text-[#0090d0]"
                    : "text-white hover:bg-white/10"
                )}
              >
                <span className="mr-3">{renderIcon(item.icon)}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
          <div className="px-4 py-2">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </div>
  );
}