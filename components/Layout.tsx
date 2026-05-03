import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import { useState } from "react";

import { defaultDescription, defaultTitle, getBaseUrl } from "../common/utils";
import { DragonIcon, DragonWordmark } from "./DragonLogo";

const jotlRoutes = [
  { id: "characters", name: "Personajes" },
  { id: "items", name: "Objetos" },
  { id: "monsters", name: "Monstruos" },
];

const TopBar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const path = router.asPath.split("/");
  let cardType = path.length >= 2 ? path[1] : null;
  if (cardType) {
    cardType = cardType.split("?")[0];
  }
  const activeRoute = cardType || "characters";

  return (
    <nav className="topbar">
      <div className="topbar-inner">
        <Link href="/" className="topbar-logo">
          <DragonIcon className="topbar-logo-icon" />
          <DragonWordmark className="topbar-logo-wordmark" />
        </Link>
        <div className="nav-desktop">
          {jotlRoutes.map((route) => (
            <Link
              key={route.id}
              href={`/${route.id}`}
              className={`nav-link ${activeRoute === route.id ? "nav-link-active" : ""}`}
            >
              {route.name}
            </Link>
          ))}
        </div>
        <div className="nav-mobile">
          <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
          {menuOpen && (
            <div className="nav-mobile-menu">
              {jotlRoutes.map((route) => (
                <Link
                  key={route.id}
                  href={`/${route.id}`}
                  className={`nav-mobile-link ${activeRoute === route.id ? "nav-link-active" : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {route.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="site-footer">
    <div className="site-footer-inner">
      <div className="site-footer-logo">
        <DragonIcon className="footer-logo-icon" />
        <DragonWordmark className="footer-logo-wordmark" />
      </div>
      <p className="site-footer-attribution">
        Esta web es un fork de{" "}
        <a href="https://github.com/cmlenius/gloomhaven-card-browser" target="_blank" rel="noopener noreferrer">
          cmlenius/gloomhaven-card-browser
        </a>
        . Gracias a todos sus contribuidores.
      </p>
      <p className="site-footer-copy">© El Dragón de Madera</p>
    </div>
  </footer>
);

type LayoutProps = {
  children?: React.ReactNode;
  description?: string;
  title?: string;
};

const Layout = ({ children, description, title }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title || defaultTitle}</title>
        <meta name="description" content={description || defaultDescription} />
        <meta name="google-site-verification" content="dyv7-lOXQn9xEOYXMD6s0oQYUYuQzTGN-KkjuPlILxg" />
        <link rel="icon" href={getBaseUrl() + "logo.png"} />
      </Head>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-FFL6ZJNJ4T" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag("js", new Date());
          gtag("config", "G-FFL6ZJNJ4T");
        `}
      </Script>
      <TopBar />
      <main className="main">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
