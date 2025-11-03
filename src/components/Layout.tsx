import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Menu } from "lucide-react";
import NavbarUser from "./NavbarUser";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/my-books", label: "My Books" },
] as const;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const getNavLinkClassName = (pathname: string) => {
    const baseClasses =
      "p-2 transition hover:duration-300 cursor-pointer border-b-2";
    const activeClasses = " border-white";
    const inactiveClasses = "hover:bg-primary-dark border-transparent";

    return router.pathname === pathname
      ? `${baseClasses} ${activeClasses}`
      : `${baseClasses} ${inactiveClasses}`;
  };

  return (
    <div
      data-theme="dark"
      className="min-h-screen bg-background text-foreground"
    >
      <header className=" bg-chart-5 text-primary-foreground px-8 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto my-0">
          {isMobile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="text-2xl p-2 hover:bg-primary-dark rounded transition focus:outline-none"
                  aria-label="Toggle menu"
                >
                  <Menu size={24} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/" className="cursor-pointer">
                    <span className="italic text-lg font-semibold">
                      StarBook
                    </span>
                  </Link>
                </DropdownMenuItem>
                {NAV_LINKS.map((link) => (
                  <DropdownMenuItem
                    key={link.href}
                    asChild
                    className={router.pathname === link.href ? "bg-accent" : ""}
                  >
                    <Link href={link.href} className="cursor-pointer">
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/" className="italic text-2xl my-auto">
                StarBook
              </Link>

              <nav className="flex gap-4">
                {NAV_LINKS.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <div className={getNavLinkClassName(link.href)}>
                      {link.label}
                    </div>
                  </Link>
                ))}
              </nav>
            </>
          )}

          <NavbarUser />
        </div>
      </header>

      <main className="max-w-7xl mx-auto my-0 px-4">{children}</main>
    </div>
  );
};

export default Layout;
