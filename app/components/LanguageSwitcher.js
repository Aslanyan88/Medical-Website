// components/LanguageSwitcher.js
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LANGUAGES } from '../lib/dictionary';

const LanguageSwitcher = ({ lang, dictionary }) => {
  const pathname = usePathname();
  const currentLang = lang;
  
  // Get the path without the language prefix for switching
  const pathnameWithoutLang = pathname.split('/').slice(2).join('/');
  
  return (
    <div className="lang-switcher">
      <span>{dictionary.common.languageSwitcher}:</span>
      <div className="flex gap-2">
        {Object.keys(LANGUAGES).map((code) => (
          <Link
            key={code}
            href={`/${code}${pathnameWithoutLang ? `/${pathnameWithoutLang}` : ''}`}
            className={`px-2 py-1 ${
              currentLang === code
                ? 'font-bold text-primary-color'
                : 'text-gray-600'
            }`}
          >
            {LANGUAGES[code].flag} {LANGUAGES[code].name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;