// app/[lang]/appointments/[id]/cancel/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function CancelAppointment({ params }) {
  const { lang, id } = params;
  const isArmenian = lang === 'hy';
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Check authentication
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${lang}/login?callbackUrl=/${lang}/appointments/${id}/cancel`);
    }
  }, [status, router, lang, id]);
  
  // Fetch appointment details
  useEffect(() => {
    const fetchAppointment = async () => {
      if (status !== 'authenticated') return;
      
      try {
        const response = await fetch(`/api/appointments/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch appointment');
        }
        
        const data = await response.json();
        setAppointment(data);
      } catch (error) {
        console.error('Error fetching appointment:', error);
        setError('Failed to load appointment data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointment();
  }, [id, status]);
  
  // Dictionary for translations
  const dictionary = {
    cancelAppointment: {
      title: isArmenian ? 'Չեղարկել Ժամադրությունը' : 'Cancel Appointment',
      confirmation: isArmenian 
        ? 'Դուք վստա՞հ եք, որ ցանկանում եք չեղարկել այս ժամադրությունը։' 
        : 'Are you sure you want to cancel this appointment?',
      warning: isArmenian 
        ? 'Այս գործողությունը չի կարող հետարկվել։' 
        : 'This action cannot be undone.',
      appointmentWith: isArmenian ? 'Ժամադրություն հետ' : 'Appointment with',
      appointmentDate: isArmenian ? 'Ժամադրության ամսաթիվ' : 'Appointment date',
      appointmentTime: isArmenian ? 'Ժամադրության ժամ' : 'Appointment time',
      back: isArmenian ? 'Վերադառնալ' : 'Go Back',
      cancel: isArmenian ? 'Չեղարկել' : 'Cancel Appointment',
      successMessage: isArmenian 
        ? 'Ձեր ժամադրությունը հաջողությամբ չեղարկվել է։' 
        : 'Your appointment has been successfully cancelled.',
      errorMessage: isArmenian 
        ? 'Սխալ է տեղի ունեցել։ Խնդրում ենք փորձել կրկին։' 
        : 'An error occurred. Please try again.',
    }
  };
  
  const handleCancel = async () => {
    setActionLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/appointments/${id}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel appointment');
      }
      
      setSuccess(true);
      
      // Redirect after successful cancellation
      setTimeout(() => {
        router.push(`/${lang}/appointments`);
        router.refresh();
      }, 2000);
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      setError(err.message || dictionary.cancelAppointment.errorMessage);
    } finally {
      setActionLoading(false);
    }
  };
  
  // Show loading state
  if (loading && !appointment) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 text-center">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <p className="mt-4 text-gray-600">Loading appointment data...</p>
      </div>
    );
  }
  
  // Show error state
  if (error && !appointment) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 text-center">
         <p className="text-red-600">{error}</p>
        <Link href={`/${lang}/appointments`} className="text-blue-600 hover:underline mt-4 inline-block">
          Return to appointments
        </Link>
      </div>
    );
  }
  
  // Main component render
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link 
          href={`/${lang}/appointments/${id}`} 
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          {dictionary.cancelAppointment.back}
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{dictionary.cancelAppointment.title}</h1>
        
        {success ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {dictionary.cancelAppointment.successMessage}
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : appointment ? (
          <div>
            <div className="bg-red-50 border border-red-100 rounded-lg p-6 mb-8">
              <div className="flex items-center mb-4">
                <svg className="h-8 w-8 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h2 className="text-xl font-semibold text-red-700">{dictionary.cancelAppointment.confirmation}</h2>
              </div>
              <p className="text-red-600 mb-2">{dictionary.cancelAppointment.warning}</p>
            </div>
            
            <div className="border rounded-lg p-6 mb-8">
              <h3 className="text-lg font-medium mb-4">{dictionary.cancelAppointment.appointmentWith}</h3>
              <p className="mb-4 text-lg">
                {isArmenian && appointment.doctor.nameHy ? 
                  appointment.doctor.nameHy : 
                  appointment.doctor.name}
                {' - '}
                <span className="text-gray-600">
                  {isArmenian && appointment.doctor.specialtyHy ? 
                    appointment.doctor.specialtyHy : 
                    appointment.doctor.specialty}
                </span>
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm text-gray-600">{dictionary.cancelAppointment.appointmentDate}</h4>
                  <p className="font-medium">
                    {new Date(appointment.date).toLocaleDateString(isArmenian ? 'hy-AM' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-600">{dictionary.cancelAppointment.appointmentTime}</h4>
                  <p className="font-medium">{appointment.time}</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-end space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                href={`/${lang}/appointments/${id}`}
                className="bg-gray-200 text-gray-800 py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors text-center"
              >
                {dictionary.cancelAppointment.back}
              </Link>
              <button
                onClick={handleCancel}
                disabled={actionLoading}
                className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-300 text-center"
              >
                {actionLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isArmenian ? 'Չեղարկվում է...' : 'Cancelling...'}
                  </div>
                ) : (
                  dictionary.cancelAppointment.cancel
                )}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}