'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function Register({ params }) {
  const { lang } = params;
  const isArmenian = lang === 'hy';
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || `/${lang}`;
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Dictionary for translations
  const dictionary = {
    register: {
      title: isArmenian ? 'Գրանցում' : 'Register',
      email: isArmenian ? 'Էլ. հասցե' : 'Email',
      password: isArmenian ? 'Գաղտնաբառ' : 'Password',
      confirmPassword: isArmenian ? 'Հաստատել գաղտնաբառը' : 'Confirm Password',
      firstName: isArmenian ? 'Անուն' : 'First Name',
      lastName: isArmenian ? 'Ազգանուն' : 'Last Name',
      submit: isArmenian ? 'Գրանցվել' : 'Register',
      haveAccount: isArmenian ? 'Արդեն ունե՞ք հաշիվ։' : 'Already have an account?',
      login: isArmenian ? 'Մուտք' : 'Login',
      passwordsDoNotMatch: isArmenian ? 'Գաղտնաբառերը չեն համընկնում։' : 'Passwords do not match.',
      registrationFailed: isArmenian ? 'Գրանցումը ձախողվեց։ Խնդրում ենք փորձել կրկին։' : 'Registration failed. Please try again.',
      userExists: isArmenian ? 'Օգտատեր այս էլ. հասցեով արդեն գոյություն ունի։' : 'User with this email already exists.',
      registrationSuccess: isArmenian ? 'Գրանցումը հաջողվեց։ Մուտք գործելով...' : 'Registration successful. Signing in...',
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError(dictionary.register.passwordsDoNotMatch);
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Register user
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 400 && data.error.includes('already exists')) {
          setError(dictionary.register.userExists);
        } else {
          setError(data.error || dictionary.register.registrationFailed);
        }
        return;
      }
      
      // Auto-login after successful registration
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      
      if (result?.error) {
        setError(result.error);
        return;
      }
      
      // Redirect to callback URL or homepage
      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      console.error('Registration error:', error);
      setError(dictionary.register.registrationFailed);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {dictionary.register.title}
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
                {dictionary.register.email}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={dictionary.register.email}
              />
            </div>
            <div>
              <label htmlFor="firstName" className="sr-only">
                {dictionary.register.firstName}
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={dictionary.register.firstName}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="sr-only">
                {dictionary.register.lastName}
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={dictionary.register.lastName}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                {dictionary.register.password}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={dictionary.register.password}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                {dictionary.register.confirmPassword}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={dictionary.register.confirmPassword}
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
                  {isArmenian ? 'Գրանցում...' : 'Registering...'}
                </span>
              ) : (
                dictionary.register.submit
              )}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {dictionary.register.haveAccount}{' '}
              <Link href={`/${lang}/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-medium text-blue-600 hover:text-blue-500">
                {dictionary.register.login}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}