'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function Login({ params }) {
  const { lang } = params;
  const isArmenian = lang === 'hy';
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || `/${lang}`;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Dictionary for translations
  const dictionary = {
    login: {
      title: isArmenian ? 'Մուտք' : 'Login',
      email: isArmenian ? 'Էլ. հասցե' : 'Email',
      password: isArmenian ? 'Գաղտնաբառ' : 'Password',
      submit: isArmenian ? 'Մուտք' : 'Sign In',
      noAccount: isArmenian ? 'Դեռ չունե՞ք հաշիվ։' : "Don't have an account?",
      register: isArmenian ? 'Գրանցվել' : 'Register',
      invalidCredentials: isArmenian ? 'Անվավեր էլ. հասցե կամ գաղտնաբառ։' : 'Invalid email or password.',
      somethingWentWrong: isArmenian ? 'Ինչ-որ բան սխալ ընթացավ։ Խնդրում ենք փորձել կրկին։' : 'Something went wrong. Please try again.',
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError(dictionary.login.invalidCredentials);
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      
      if (result?.error) {
        setError(dictionary.login.invalidCredentials);
        return;
      }
      
      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      console.error('Login error:', error);
      setError(dictionary.login.somethingWentWrong);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {dictionary.login.title}
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                {dictionary.login.email}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={dictionary.login.email}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                {dictionary.login.password}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={dictionary.login.password}
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isArmenian ? 'Մուտք...' : 'Signing in...'}
                </span>
              ) : (
                dictionary.login.submit
              )}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {dictionary.login.noAccount}{' '}
              <Link href={`/${lang}/register?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-medium text-blue-600 hover:text-blue-500">
                {dictionary.login.register}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}