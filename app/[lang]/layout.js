// app/[lang]/layout.js
import '../globals.css';
import { use } from 'react';

export const dynamicParams = false;

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'hy' }];
}
export const metadata = {
  title: {
    template: '%s | Medical Clinic',
    default: 'MediCare', 
  },
  description: 'Your medical care, simplified',
};
export default function RootLayout({ children, params }) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang || 'en';
  
  const navigation = {
    en: {
      home: 'Home',
      about: 'About Us',
      doctors: 'Our Doctors',
      appointments: 'Appointments',
      payments: 'Payments & Insurance',
    },
    hy: {
      home: 'Գլխավոր',
      about: 'Մեր Մասին',
      doctors: 'Մեր Բժիշկները',
      appointments: 'Նշանակումներ',
      payments: 'Վճարումներ և Ապահովագրություն',
    }
  };

  return (
    <html suppressHydrationWarning>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body suppressHydrationWarning>
        <div className="max-w-7xl mx-auto px-4">
          <header className="py-4 px-6 mb-6 flex flex-col md:flex-row justify-between items-center border-b">
            <div className="text-2xl font-bold text-blue-600 mb-4 md:mb-0">MediCare</div>
            <nav className="flex flex-wrap gap-2 justify-center mb-4 md:mb-0">
              <a href={`/${lang}`} className="px-3 py-2 rounded hover:bg-blue-100">{navigation[lang].home}</a>
              <a href={`/${lang}/about`} className="px-3 py-2 rounded hover:bg-blue-100">{navigation[lang].about}</a>
              <a href={`/${lang}/doctors`} className="px-3 py-2 rounded hover:bg-blue-100">{navigation[lang].doctors}</a>
              <a href={`/${lang}/appointments`} className="px-3 py-2 rounded hover:bg-blue-100">{navigation[lang].appointments}</a>
            </nav>
            <div className="flex gap-2">
              <a href="/en" className={`px-2 py-1 rounded border ${lang === 'en' ? 'bg-blue-100' : ''}`}>🇺🇸 EN</a>
              <a href="/hy" className={`px-2 py-1 rounded border ${lang === 'hy' ? 'bg-blue-100' : ''}`}>🇦🇲 HY</a>
            </div>
          </header>
          <main>{children}</main>
          <footer className="mt-12 py-6 border-t text-center text-gray-600">
            <p>© 2025 MediCare Clinic. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}