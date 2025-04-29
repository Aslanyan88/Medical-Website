import Navigation from '../components/Navigation';

export default function LangLayout({ children, params }) {
  const { lang } = params;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation lang={lang} />
      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>
      <footer className="bg-white shadow-inner py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            {lang === 'hy' 
              ? '© 2025 Բժշկական Կենտրոն։ Բոլոր իրավունքները պաշտպանված են։' 
              : '© 2025 MedicaCare. All rights reserved.'}
          </p>
        </div>
      </footer>
    </div>
  );
}