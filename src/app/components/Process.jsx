import { motion } from 'motion/react';
import { MessageSquare, Search, ShoppingBag, Truck } from 'lucide-react';
import { PROCESS_STEPS, localize } from '../data/siteData.js';
import { useSite } from '../context/SiteContext.jsx';

const iconMap = { Search, MessageSquare, ShoppingBag, Truck };

export function Process({ openAuthModal }) {
  const { language, text } = useSite();

  return (
    <section id="process" className="relative overflow-hidden bg-slate-50 py-24 transition-colors dark:bg-black">
      <div className="absolute inset-0 opacity-50 dark:opacity-100">
        <div className="absolute left-1/4 top-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      </div>
      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <span className="inline-flex rounded-full border border-cyan-500/20 bg-white px-4 py-2 text-sm font-medium text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300">
            {text.process.tag}
          </span>
          <h2 className="mt-6 text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">{text.process.title}</h2>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">{text.process.description}</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {PROCESS_STEPS.map((step, index) => {
            const Icon = iconMap[step.icon];
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                className="relative rounded-3xl border border-cyan-500/15 bg-white/80 p-8 shadow-lg shadow-cyan-500/5 dark:bg-slate-950/65"
              >
                <div className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-lg font-bold text-white">
                  {step.number}
                </div>
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-cyan-600 dark:bg-slate-900 dark:text-cyan-400">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{localize(step.title, language)}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{localize(step.description, language)}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <button
            type="button"
            onClick={openAuthModal}
            className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-cyan-500/20"
          >
            {text.actions.chooseEquipment}
          </button>
        </div>
      </div>
    </section>
  );
}
