// app/[lang]/admin/appointments/[appointmentId]/cancel/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function CancelAppointment() {
  const router = useRouter();
  const params = useParams();
  const { lang, appointmentId } = params;
  const isArmenian = lang === 'hy';
  
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Dictionary for translations
  const dictionary = {
    title: isArmenian ? 'Չեղարկել Ժամադրությունը' : 'Cancel Appointment',
    back: isArmenian ? 'Վերադառնալ' : 'Back',
    confirmation: isArmenian 
      ? 'Դուք վստա՞հ եք, որ ցանկանում եք չեղարկել այս ժամադրությունը։' 
      : 'Are you sure you want to cancel this appointment?',
    warning: isArmenian 
      ? 'Այս գործողությունը կազատի ընտրված ժամային միջակայքը։' 
      : 'This action will free up the selected time slot.',
    details: {
      patient: isArmenian ? 'Հիվանդ' : 'Patient',
      doctor: isArmenian ? 'Բժիշկ' : 'Doctor',
      date: isArmenian ? 'Ամսաթիվ' : 'Date',
      time: isArmenian ? 'Ժամ' : 'Time',
    },
    cancel: isArmenian ? 'Չեղարկել Ժամադրությունը' : 'Cancel Appointment',
    goBack: isArmenian ? 'Վերադառնալ' : 'Go Back',
    successMessage: isArmenian ? 'Ժամադրությունը հաջողությամբ չեղարկվել է։' : 'Appointment successfully cancelled.',
    errorMessage: isArmenian ? 'Սխալ է տեղի ունեցել։ Խնդրում ենք փորձել կրկին։' : 'An error occurred. Please try again.',
    loading: isArmenian ? 'Բեռնում...' : 'Loading...',
    cancelling: isArmenian ? 'Չեղարկվում է...' : 'Cancelling...',
  };
  
  // Fetch appointment data
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await fetch(`/api/admin/appointments/${appointmentId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch appointment');
        }
        
        const data = await response.json();
        setAppointment(data);
      } catch (err) {
        console.error('Error fetching appointment:', err);
        setError(err.message || dictionary.errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    if (appointmentId) {
      fetchAppointment();
    }
  }, [appointmentId, dictionary.errorMessage]);
  
  // Handle cancel appointment
  const handleCancel = async () => {
    setCancelLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/admin/appointments/${appointmentId}/cancel`, {
        method: 'PUT',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel appointment');
      }
      
      setSuccess(true);
      
      // Redirect after successful cancellation
      setTimeout(() => {
        router.push(`/${lang}/admin/appointments`);
        router.refresh();
      }, 2000);
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      setError(err.message || dictionary.errorMessage);
    } finally {
      setCancelLoading(false);
    }
  };
  
  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isArmenian ? 'hy-AM' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{dictionary.title}</h1>
        <Link
          href={`/${lang}/admin/appointments`}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          {dictionary.back}
        </Link>
      </div>
      
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
          <p>{dictionary.successMessage}</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-center">
          <svg className="animate-spin h-8 w-8 mr-3 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-xl">{dictionary.loading}</span>
        </div>
      ) : appointment && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <p className="text-lg font-medium mb-2 text-red-600">{dictionary.confirmation}</p>
            <p className="text-gray-600 mb-6">{dictionary.warning}</p>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">{dictionary.details.patient}</p>
                  <p className="font-medium">{appointment.patient.firstName} {appointment.patient.lastName}</p>
                  <p className="text-sm">{appointment.patient.email}</p>
                </div>
                
                <div>
                  <p className="text-gray-500 text-sm">{dictionary.details.doctor}</p>
                  <p className="font-medium">{isArmenian && appointment.doctor.nameHy ? appointment.doctor.nameHy : appointment.doctor.name}</p>
                  <p className="text-sm">{isArmenian && appointment.doctor.specialtyHy ? appointment.doctor.specialtyHy : appointment.doctor.specialty}</p>
                </div>
                
                <div>
                  <p className="text-gray-500 text-sm">{dictionary.details.date}</p>
                  <p className="font-medium">{formatDate(appointment.date)}</p>
                </div>
                
                <div>
                  <p className="text-gray-500 text-sm">{dictionary.details.time}</p>
                  <p className="font-medium">{appointment.time}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 flex justify-end">
            <Link
              href={`/${lang}/admin/appointments`}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
            >
              {dictionary.goBack}
            </Link>
            <button
              onClick={handleCancel}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              disabled={cancelLoading || success}
            >
              {cancelLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {dictionary.cancelling}
                </span>
              ) : (
                dictionary.cancel
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}