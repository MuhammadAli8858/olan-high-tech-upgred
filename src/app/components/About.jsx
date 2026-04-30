import { motion } from 'motion/react';
import { Award, Headphones, ShieldCheck, Wrench } from 'lucide-react';
import { ABOUT_FEATURES, localize } from '../data/siteData.js';
import { useSite } from '../context/SiteContext.jsx';

const iconMap = {
  ShieldCheck,
  Award,
  Headphones,
  Wrench,
};

export function About({ onOpenFeature }) {
  const { language, text } = useSite();

  return (
    <section id="about" className="relative overflow-hidden bg-gradient-to-b from-slate-100 via-white to-slate-50 py-24 transition-colors dark:from-black dark:via-slate-950 dark:to-black">
      <div className="absolute inset-0 opacity-60 dark:opacity-100">
        <div className="absolute left-1/4 top-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <span className="inline-flex rounded-full border border-cyan-500/20 bg-white px-4 py-2 text-sm font-medium text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300">
            {text.about.tag}
          </span>
          <h2 className="mt-6 text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">{text.about.title}</h2>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">{text.about.description}</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {ABOUT_FEATURES.map((feature, index) => {
            const Icon = iconMap[feature.icon];
            return (
              <motion.button
                key={feature.id}
                type="button"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                onClick={() => onOpenFeature(feature)}
                className="group relative rounded-3xl border border-cyan-500/15 bg-white/85 p-8 text-left shadow-lg shadow-cyan-500/5 transition hover:-translate-y-1 hover:border-cyan-500/40 dark:bg-slate-950/65"
              >
                <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{localize(feature.title, language)}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{localize(feature.short, language)}</p>
                <span className="mt-5 inline-flex text-sm font-semibold text-cyan-600 dark:text-cyan-400">{text.actions.details}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4">
          {text.about.stats.map((stat) => (
            <div key={stat.label} className="rounded-3xl border border-cyan-500/15 bg-white/75 p-6 text-center shadow-lg shadow-cyan-500/5 dark:bg-slate-950/60">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-4xl font-bold text-transparent">{stat.value}</div>
              <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
