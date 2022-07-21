import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import { ThemeProvider, createTheme} from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter()
  return (
    <>
    <Head>
        <title>StarBook</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={darkTheme}>
      {/* <CssBaseline /> */}
    <main>
      <div className="flex justify-evenly bg-amber-800 text-white">
        {/* Logo */}
        <Link href='/'>
            <a className="italic text-2xl my-auto">
            StarBook
            </a>
        </Link>
        

        {/* NavBar */}
        <nav className="flex">
          <Link href="/" >
            <a className={router.pathname=='/' ? "p-5 transition hover:duration-300 bg-amber-700" : "p-5 transition hover:duration-300 hover:bg-amber-700"}>Home</a>
          </Link>
          <Link href="/mybook">
            <a className={router.pathname=='/mybook' ? "p-5 transition hover:duration-300 bg-amber-700" : "p-5 transition hover:duration-300 hover:bg-amber-700"}>My Books</a>
          </Link>
        </nav>
      </div>

      {/* Content */}
      <div className="max-w-screen-xl mx-auto my-0">{children}</div>

    </main>
    </ThemeProvider>
    </>
  );
};

export default Layout;