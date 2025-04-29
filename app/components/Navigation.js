'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function Navigation({ lang }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isArmenian = lang === 'hy';
  const isLoading = status === 'loading';
  
  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);
  
  // Dictionary for translations
  const dictionary = {
    navigation: {
      home: isArmenian ? 'Գլխավոր' : 'Home',
      about: isArmenian ? 'Մեր մասին' : 'About',
      doctors: isArmenian ? 'Բժիշկներ' : 'Doctors',
      appointments: isArmenian ? 'Ժամադրություններ' : 'Appointments',
      login: isArmenian ? 'Մուտք' : 'Login',
      register: isArmenian ? 'Գրանցվել' : 'Register',
      logout: isArmenian ? 'Ելք' : 'Logout',
      language: isArmenian ? 'English' : 'Հայերեն',
      admin: isArmenian ? 'Ադմինիստրատոր' : 'Admin',
    }
  };
  
  // Function to get alternative language route
  const getAlternateRoute = () => {
    const segments = pathname.split('/');
    segments[1] = lang === 'hy' ? 'en' : 'hy';
    return segments.join('/');
  };
  
  // Handle logout
  const handleLogout = async () => {
    await signOut({ redirect: false });
    window.location.href = `/${lang}`;
  };
  
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href={`/${lang}`} className="text-blue-600 font-bold text-xl">
                {isArmenian ? 'Բժշկական Կենտրոն' : 'MedicalCare'}
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href={`/${lang}`}
                className={`${
                  pathname === `/${lang}` ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                {dictionary.navigation.home}
              </Link>
              
              <Link 
                href={`/${lang}/about`}
                className={`${
                  pathname.startsWith(`/${lang}/about`) ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                {dictionary.navigation.about}
              </Link>
              
              <Link 
                href={`/${lang}/doctors`}
                className={`${
                  pathname.startsWith(`/${lang}/doctors`) ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                {dictionary.navigation.doctors}
              </Link>
              
              {session && (
                <Link 
                  href={`/${lang}/appointments`}
                  className={`${
                    pathname.startsWith(`/${lang}/appointments`) ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  {dictionary.navigation.appointments}
                </Link>
              )}
              
              {session?.user?.isAdmin && (
                <Link 
                  href={`/${lang}/admin`}
                  className={`${
                    pathname.startsWith(`/${lang}/admin`) ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  {dictionary.navigation.admin}
                </Link>
              )}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <Link 
              href={getAlternateRoute()}
              className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              {dictionary.navigation.language}
            </Link>
            
            {isLoading ? (
              <div className="h-8 w-8 rounded-full animate-pulse bg-gray-200"></div>
            ) : session ? (
              <>
                <div className="flex items-center">
                  {session.user.isAdmin && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mr-2">
                      {isArmenian ? 'Ադմին' : 'Admin'}
                    </span>
                  )}
                  <span className="text-gray-700 text-sm">
                    {session.user.name || session.user.email}
                  </span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {dictionary.navigation.logout}
                </button>
              </>
            ) : (
              <>
                <Link 
                  href={`/${lang}/login`}
                  className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {dictionary.navigation.login}
                </Link>
                
                <Link 
                  href={`/${lang}/register`}
                  className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {dictionary.navigation.register}
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link 
            href={`/${lang}`}
            className={`${
              pathname === `/${lang}` ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setIsMenuOpen(false)}
          >
            {dictionary.navigation.home}
          </Link>
          
          <Link 
            href={`/${lang}/about`}
            className={`${
              pathname.startsWith(`/${lang}/about`) ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setIsMenuOpen(false)}
          >
            {dictionary.navigation.about}
          </Link>
          
          <Link 
            href={`/${lang}/doctors`}
            className={`${
              pathname.startsWith(`/${lang}/doctors`) ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={() => setIsMenuOpen(false)}
          >
            {dictionary.navigation.doctors}
          </Link>
          
          {session && (
            <Link 
              href={`/${lang}/appointments`}
              className={`${
                pathname.startsWith(`/${lang}/appointments`) ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              onClick={() => setIsMenuOpen(false)}
            >
              {dictionary.navigation.appointments}
            </Link>
          )}
          
          {session?.user?.isAdmin && (
            <Link 
              href={`/${lang}/admin`}
              className={`${
                pathname.startsWith(`/${lang}/admin`) ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              onClick={() => setIsMenuOpen(false)}
            >
              {dictionary.navigation.admin}
            </Link>
          )}
          
          <Link 
            href={getAlternateRoute()}
            className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            {dictionary.navigation.language}
          </Link>
        </div>
        
        <div className="pt-4 pb-3 border-t border-gray-200">
          {isLoading ? (
            <div className="flex items-center px-4">
              <div className="h-10 w-10 rounded-full animate-pulse bg-gray-200"></div>
              <div className="ml-3 w-32 h-5 animate-pulse bg-gray-200 rounded"></div>
            </div>
          ) : session ? (
            <>
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 font-bold">
                    {(session.user.name || session.user.email).charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="flex items-center">
                    {session.user.isAdmin && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mr-2">
                        {isArmenian ? 'Ադմին' : 'Admin'}
                      </span>
                    )}
                    <div className="text-base font-medium text-gray-800">{session.user.name || session.user.email}</div>
                  </div>
                  <div className="text-sm font-medium text-gray-500">{session.user.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  {dictionary.navigation.logout}
                </button>
              </div>
            </>
          ) : (
            <div className="mt-3 space-y-1">
              <Link 
                href={`/${lang}/login`}
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                {dictionary.navigation.login}
              </Link>
              <Link 
                href={`/${lang}/register`}
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                {dictionary.navigation.register}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}