'use client';

import Link from "next/link";

interface HeroProps {
  title: string;
  subtitle: string;
  highlights: string[];
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
}

export default function Hero({ title, subtitle, highlights, ctaPrimary, ctaSecondary }: HeroProps) {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          {title}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
          {subtitle}
        </p>

        <ul className="text-left text-gray-700 dark:text-gray-300 mb-10 max-w-xl mx-auto space-y-2">
          {highlights.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">✔</span>
              {item}
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href={ctaPrimary.href}
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            {ctaPrimary.label}
          </Link>
          <Link
            href={ctaSecondary.href}
            className="w-full sm:w-auto border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 px-8 py-4 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200 font-semibold text-lg"
          >
            {ctaSecondary.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
