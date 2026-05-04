import { useState } from 'react';
import { Menu, X, Sun, Moon, LogOut, User2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LANGUAGE_OPTIONS } from '../data/siteData.js';
import { useSite } from '../context/SiteContext.jsx';

function scrollToId(id) {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function Header({ openAuthModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { text, language, setLanguage, theme, toggleTheme, user, logout } = useSite();

  const navItems = [
    { name: text.nav.about, href: 'about' },
    { name: text.nav.catalog, href: 'catalog' },
    { name: text.nav.benefits, href: 'benefits' },
    { name: text.nav.process, href: 'process' },
    { name: text.nav.testimonials, href: 'testimonials' },
    { name: text.nav.faq, href: 'faq' },
    { name: text.nav.contact, href: 'contact' },
  ];

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-cyan-500/15 bg-white/80 backdrop-blur-xl transition-colors dark:bg-black/75">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <motion.button
            type="button"
            onClick={() => scrollToId('hero')}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <img src="/olan_logo.svg" alt={text.brand} className="h-11 w-11 rounded-xl object-cover shadow-lg shadow-cyan-500/20" />
            <div className="hidden text-left sm:block">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-lg font-bold text-transparent">
                {text.brand}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Smart traffic enforcement</div>
            </div>
          </motion.button>

          <motion.div
            className="hidden items-center gap-6 lg:flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {navItems.map((item) => (
              
              <button
                key={item.href}
                type="button"
                onClick={() => scrollToId(item.href)}

                // className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300"
                className="text-gray-300 hover:text-cyan-400 transition-colors text-sm relative group"
                // className="text-sm text-slate-600 transition hover:text-cyan-600 dark:text-slate-300 dark:hover:text-cyan-400"
              >
                {item.name}
              </button>
            ))}
          </motion.div>

          <div className="hidden items-center gap-3 lg:flex">
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="rounded-full border border-cyan-500/20 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-cyan-500 dark:bg-slate-900 dark:text-slate-200"
              aria-label={text.actions.language}
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-500/20 bg-white text-slate-700 transition hover:border-cyan-500/50 hover:text-cyan-600 dark:bg-slate-900 dark:text-slate-200"
              aria-label={theme === 'dark' ? text.actions.themeLight : text.actions.themeDark}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            {user ? (
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-white px-4 py-2 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <User2 className="h-4 w-4 text-cyan-500" />
                  {user.name}
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-500/20 bg-white text-slate-700 transition hover:border-cyan-500/50 hover:text-cyan-600 dark:bg-slate-900 dark:text-slate-200"
                  aria-label={text.actions.logout}
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-cyan-500/20 transition hover:translate-y-[-1px]"
              >
                {text.actions.login}
              </button>
            )}
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-500/20 bg-white text-slate-700 lg:hidden dark:bg-slate-900 dark:text-slate-200"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden lg:hidden"
            >
              <div className="mt-4 space-y-3 rounded-3xl border border-cyan-500/20 bg-white/90 p-4 dark:bg-slate-950/90">
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={language}
                    onChange={(event) => setLanguage(event.target.value)}
                    className="rounded-2xl border border-cyan-500/20 bg-transparent px-3 py-2 text-sm text-slate-700 outline-none dark:text-slate-200"
                  >
                    {LANGUAGE_OPTIONS.map((option) => (
                      <option key={option.code} value={option.code}>{option.label}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="rounded-2xl border border-cyan-500/20 px-3 py-2 text-sm text-slate-700 dark:text-slate-200"
                  >
                    {theme === 'dark' ? text.actions.themeLight : text.actions.themeDark}
                  </button>
                </div>
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => {
                      scrollToId(item.href);
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full rounded-2xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-cyan-500/10 hover:text-cyan-600 dark:text-slate-200"
                  >
                    {item.name}
                  </button>
                ))}
                {user ? (
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full rounded-full border border-cyan-500/20 px-4 py-2 text-sm text-slate-700 dark:text-slate-200"
                  >
                    {text.actions.logout}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      openAuthModal();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-medium text-white"
                  >
                    {text.actions.login}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
