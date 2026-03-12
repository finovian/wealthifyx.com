"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const navLinks = [
  { label: "Calculators", href: "#tools" },
  { label: "Learn", href: "#learn" },
  { label: "Compare Brokers", href: "#compare" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`animate-fade-up delay-0 fixed top-[0] left-[0] right-[0] z-[100] flex items-center justify-between transition-[background,border-color] duration-[0.25s] ease-[ease] h-[56px] px-[20px] lg:h-[60px] lg:px-[48px] ${
          scrolled
            ? "bg-[color-mix(in_srgb,var(--bg-base)_92%,transparent)] border-b-[1px] border-b-[var(--border)] backdrop-blur-[12px]"
            : "bg-[var(--bg-base)] border-b-[1px] border-b-transparent"
        }`}
      >
        {/* Logo */}
        <a
          href="/"
          className="flex items-center no-underline shrink-0"
        >
          <span
            className="font-sans font-[400] text-[var(--text-primary)] tracking-[-0.5px] text-[18px] lg:text-[20px]"
          >
            WealthifyX
          </span>
          <span
            className="w-[6px] h-[6px] rounded-[50%] bg-accent ml-[2px] mb-[-4px] inline-block shrink-0"
          />
        </a>

        {/* Center nav links — desktop only (≥1024px) */}
        {/* <div
          className="hidden lg:flex items-center gap-[32px]"
        >
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="font-ubuntu text-[14px] font-[500] text-[var(--text-muted)] no-underline transition-colors duration-[0.15s] ease-[ease] py-[4px] px-[0] hover:text-[var(--text-primary)]">
              {link.label}
            </a>
          ))}
        </div> */}

        {/* Right actions */}
        <div className="flex items-center gap-[2px]">
          {/* Theme toggle — visible on all screens */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="bg-transparent border-none cursor-pointer text-[var(--text-muted)] flex items-center justify-center transition-colors duration-[0.15s] ease-[ease] rounded-[8px] min-w-[44px] min-h-[44px] hover:text-[var(--text-primary)]"
          >
            <div className="relative w-[18px] h-[18px] flex items-center justify-center">
              <AnimatePresence mode="wait" initial={false}>
                {theme === "light" && (
                  <motion.div
                    key="sun"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun size={18} />
                  </motion.div>
                )}
                {theme === "dark" && (
                  <motion.div
                    key="moon"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </button>

          {/* Separator — desktop only */}
          {/* <div
            className="hidden lg:block w-[1px] h-[16px] bg-[var(--border)] shrink-0"
          /> */}

          {/* Free. Always. — desktop only */}
          {/* <span
            className="hidden lg:inline font-mono text-[11px] text-[var(--text-faint)] whitespace-nowrap"
          >
            Free. Always.
          </span> */}

          {/* Hamburger — mobile only (<1024px) */}
          <button
            className="flex bg-transparent border-none cursor-pointer text-[var(--text-primary)] items-center justify-center min-w-[44px] min-h-[44px]"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-[0] z-[199] bg-[rgba(0,0,0,0.4)]"
            />

            {/* Drawer — slides in from right */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed top-[0] right-[0] bottom-[0] w-[min(320px,100vw)] z-[200] bg-[var(--bg-base)] border-l-[1px] border-l-[var(--border)] overflow-y-auto flex flex-col"
            >
              {/* Drawer header — logo + close */}
              <div
                className="flex items-center justify-between h-[60px] px-[20px] border-b-[1px] border-b-[var(--border)] shrink-0"
              >
                <a
                  href="/"
                  className="flex items-center no-underline"
                  onClick={() => setMobileOpen(false)}
                >
                  <span
                    className="font-serif text-[18px] font-[400] text-[var(--text-primary)] tracking-[-0.5px]"
                  >
                    WealthifyX
                  </span>
                  <span
                    className="w-[5px] h-[5px] rounded-[50%] bg-[var(--accent)] ml-[2px] mb-[-3px] inline-block"
                  />
                </a>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="bg-transparent border-none cursor-pointer text-[var(--text-primary)] min-w-[44px] min-h-[44px] flex items-center justify-center rounded-[8px]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer nav links */}
              <div className="flex-1 py-[8px] px-[20px]">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-ubuntu text-[16px] font-[500] text-[var(--text-primary)] no-underline flex items-center h-[52px] border-b-[1px] border-b-[var(--border)] transition-colors duration-[0.15s] ease-[ease] hover:bg-[var(--bg-subtle)]"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              {/* Drawer bottom — CTA + theme + label */}
              <div
                className="px-[20px] pt-[16px] pb-[28px] border-t-[1px] border-t-[var(--border)] flex flex-col gap-[10px] shrink-0"
              >
                {/* Primary CTA */}
                <a
                  href="#tools"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-full h-[50px] bg-[var(--accent)] text-[#ffffff] rounded-[8px] font-ubuntu text-[15px] font-[700] no-underline cursor-pointer transition-colors duration-[0.15s] ease-[ease] hover:bg-[var(--accent-hover)]"
                >
                  Explore All Tools →
                </a>

                {/* Theme toggle button */}
                <button
                  onClick={toggleTheme}
                  className="bg-[var(--bg-subtle)] border-[1px] border-[var(--border)] rounded-[8px] py-[10px] px-[16px] text-[var(--text-primary)] font-ubuntu text-[14px] font-[400] cursor-pointer flex items-center justify-center gap-[8px] min-h-[44px] w-full transition-colors duration-[0.15s] ease-[ease]"
                >
                  {theme === "light" ? <Moon size={16} /> : theme === "dark" ? <Sun size={16} /> : <div className="w-4 h-4" />}
                  {theme === "light"
                    ? "Switch to Dark Mode"
                    : theme === "dark" 
                    ? "Switch to Light Mode"
                    : "Toggle Theme"}
                </button>

                {/* Free. Always. */}
                <span
                  className="font-mono text-[11px] text-[var(--text-faint)] text-center mt-[4px]"
                >
                  Free. Always.
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}