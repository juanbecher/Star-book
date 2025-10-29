import { ThemeProvider, createTheme } from "@mui/material/styles";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import NavbarUser from "./NavbarUser";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#F0B27A",
    },
    secondary: {
      main: "#E8DAEF",
    },
  },
});

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/my-books", label: "My Books" },
] as const;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();

  const getNavLinkClassName = (pathname: string) => {
    const baseClasses = "p-2 transition hover:duration-300 cursor-pointer";
    const activeClasses = "bg-amber-700 border-b-2 border-white";
    const inactiveClasses = "hover:bg-amber-700";

    return router.pathname === pathname
      ? `${baseClasses} ${activeClasses}`
      : `${baseClasses} ${inactiveClasses}`;
  };

  return (
    <>
      <Head>
        <title>StarBook</title>
        <meta
          name="description"
          content="Track and discover your favorite books"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={darkTheme}>
        <main>
          <header className=" bg-amber-800 text-white px-8 py-4">
            <div className="flex justify-between items-center max-w-screen-xl mx-auto my-0">
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

              <NavbarUser />
            </div>
          </header>

          <div className="max-w-screen-xl mx-auto my-0 px-4">{children}</div>
        </main>
      </ThemeProvider>
    </>
  );
};

export default Layout;
