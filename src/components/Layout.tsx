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
  { href: "/mybook", label: "My Books" },
] as const;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();

  const getNavLinkClassName = (pathname: string) => {
    const baseClasses = "p-5 transition hover:duration-300";
    const activeClasses = "bg-amber-700";
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
          <header className="flex justify-evenly bg-amber-800 text-white">
            <Link href="/" className="italic text-2xl my-auto">
              StarBook
            </Link>

            <nav className="flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={getNavLinkClassName(link.href)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <NavbarUser />
          </header>

          <div className="max-w-screen-xl mx-auto my-0 px-4">{children}</div>
        </main>
      </ThemeProvider>
    </>
  );
};

export default Layout;
