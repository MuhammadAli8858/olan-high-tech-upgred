import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import { TESTIMONIALS, localize } from '../data/siteData.js';
import { useSite } from '../context/SiteContext.jsx';

export function Testimonials() {
  const { language, text } = useSite();

  return (
    <section id="testimonials" className="relative overflow-hidden bg-gradient-to-b from-slate-100 via-white to-slate-50 py-24 transition-colors dark:from-black dark:via-slate-950 dark:to-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <span className="inline-flex rounded-full border border-cyan-500/20 bg-white px-4 py-2 text-sm font-medium text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300">
            {text.testimonials.tag}
          </span>
          <h2 className="mt-6 text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">{text.testimonials.title}</h2>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">{text.testimonials.description}</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {TESTIMONIALS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-cyan-500/15 bg-white/85 p-8 shadow-lg shadow-cyan-500/5 dark:bg-slate-950/65"
            >
              <div className="mb-4 flex gap-1 text-amber-400">
                {Array.from({ length: item.rating }).map((_, idx) => (
                  <Star key={idx} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-lg leading-8 text-slate-700 dark:text-slate-200">“{localize(item.text, language)}”</p>
              <div className="mt-8 flex items-center gap-4">
                <img src={item.image} alt={item.name} className="h-14 w-14 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">{item.name}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{localize(item.position, language)}</div>
                  <div className="text-xs uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-400">{item.company}</div>
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-4">
                <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{item.metrics.value}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{localize(item.metrics.label, language)}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
