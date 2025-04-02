// components/Navbar.js
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = ({ lang, dictionary }) => {
  const pathname = usePathname();
  const { navigation } = dictionary;

  const getNavClass = (path) => {
    const currentPath = pathname.split('/').slice(2).join('/');
    const routePath = path.split('/').slice(1).join('/');
    return `nav-link ${currentPath === routePath ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-100'}`;
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center p-4">
        <div className="flex items-center mb-4 md:mb-0">
          <Link href={`/${lang}`} className="text-2xl font-bold text-blue-600">
            MediCare
          </Link>
        </div>
        <nav className="flex flex-wrap justify-center gap-2">
          <Link href={`/${lang}`} className={`px-4 py-2 rounded-md transition-colors ${getNavClass(`/${lang}`)}`}>
            {navigation.home}
          </Link>
          <Link href={`/${lang}/about`} className={`px-4 py-2 rounded-md transition-colors ${getNavClass(`/${lang}/about`)}`}>
            {navigation.about}
          </Link>
          <Link href={`/${lang}/doctors`} className={`px-4 py-2 rounded-md transition-colors ${getNavClass(`/${lang}/doctors`)}`}>
            {navigation.doctors}
          </Link>
          <Link href={`/${lang}/appointments`} className={`px-4 py-2 rounded-md transition-colors ${getNavClass(`/${lang}/appointments`)}`}>
            {navigation.appointments}
          </Link>
          <Link href={`/${lang}/payments`} className={`px-4 py-2 rounded-md transition-colors ${getNavClass(`/${lang}/payments`)}`}>
            {navigation.payments}
          </Link>
        </nav>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Link href="/en" className={`px-3 py-1 border rounded-md ${lang === 'en' ? 'bg-blue-100 border-blue-300' : 'border-gray-300'}`}>
            🇺🇸 English
          </Link>
          <Link href="/hy" className={`px-3 py-1 border rounded-md ${lang === 'hy' ? 'bg-blue-100 border-blue-300' : 'border-gray-300'}`}>
            🇦🇲 Հայերեն
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;