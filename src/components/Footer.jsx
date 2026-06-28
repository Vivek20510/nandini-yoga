import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Mail, Youtube } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Classes", path: "/classes" },
  { name: "Gallery", path: "/gallery" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

const socials = [
  { label: "Instagram", href: "https://instagram.com/", icon: Instagram },
  { label: "YouTube", href: "https://youtube.com/", icon: Youtube },
  { label: "Email", href: "mailto:yoga.nandinisingh@gmail.com", icon: Mail },
];

const Footer = () => {
  return (
    <footer className="bg-yoga-ink px-5 py-10 font-body text-yoga-paper md:px-10 md:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Link to="/" className="font-display text-xl">
              Yoga <em className="text-yoga-sageLight">by</em> Nandini
            </Link>
            <p className="mt-2 max-w-sm text-sm leading-7 text-white/35">
              Certified yoga teacher · India. Hatha yoga, pranayama, and small group classes.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/35 transition hover:border-yoga-sageLight hover:text-yoga-sageLight"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <nav>
            <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.16em] text-white/25">
              Navigation
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} className="text-sm text-white/35 hover:text-yoga-paper">
                  {link.name}
                </Link>
              ))}
              <Link to="/admin" className="text-sm text-white/35 hover:text-yoga-paper">
                Admin
              </Link>
            </div>
          </nav>

          <div>
            <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.16em] text-white/25">
              Get in touch
            </h2>
            <a
              href="mailto:yoga.nandinisingh@gmail.com"
              className="text-sm text-white/35 hover:text-yoga-paper"
            >
              yoga.nandinisingh@gmail.com
            </a>
            <p className="mt-4 text-sm leading-7 text-white/25">
              Based in India
              <br />
              Online and in-person batches
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-5 text-xs text-white/20">
          © {new Date().getFullYear()} Yoga by Nandini
        </div>
      </div>
    </footer>
  );
};

export default Footer;
