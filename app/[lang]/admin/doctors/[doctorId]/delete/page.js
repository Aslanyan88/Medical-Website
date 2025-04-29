// app/[lang]/admin/doctors/[doctorId]/delete/page.js (complete version)
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DeleteDoctor({ params }) {
  const { lang, doctorId } = params;
  const isArmenian = lang === 'hy';
  const router = useRouter();
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Dictionary for translations
  const dictionary = {
    title: isArmenian ? 'Ջնջել Բժիշկին' : 'Delete Doctor',
    confirmText: isArmenian 
      ? 'Վստա՞հ եք, որ ցանկանում եք ջնջել այս բժիշկին: Այս գործողությունը հնարավոր չէ հետարկել:' 
      : 'Are you sure you want to delete this doctor? This action cannot be undone.',
    warning: isArmenian 
      ? 'Բժիշկի ջնջումը կջնջի նաև նրա բոլոր ժամային միջակայքերը և ժամադրությունները:' 
      : 'Deleting the doctor will also delete all their time slots and appointments.',
    name: isArmenian ? 'Անուն' : 'Name',
    specialty: isArmenian ? 'Մասնագիտություն' : 'Specialty',
    delete: isArmenian ? 'Ջնջել' : 'Delete',
    deleting: isArmenian ? 'Ջնջվում է...' : 'Deleting...',
    cancel: isArmenian ? 'Չեղարկել' : 'Cancel',
    errorMessage: isArmenian ? 'Սխալ է տեղի ունեցել։ Խնդրում ենք փորձել կրկին։' : 'An error occurred. Please try again.'
  };
  
  // Fetch doctor data
  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await fetch(`/api/admin/doctors/${doctorId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch doctor data');
        }
        
        const doctorData = await response.json();
        setDoctor(doctorData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching doctor:', err);
        setError('Failed to load doctor data');
        setIsLoading(false);
      }
    };
    
    fetchDoctorData();
  }, [doctorId]);
  
  // Handle delete
  const handleDelete = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/admin/doctors/${doctorId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete doctor');
      }
      
      router.push(`/${lang}/admin/doctors`);
      router.refresh();
    } catch (err) {
      console.error('Error deleting doctor:', err);
      setError(err.message || dictionary.errorMessage);
      setLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!doctor) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Doctor not found or error loading data
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-red-600 mb-4">{dictionary.title}</h1>
        
        <div className="mb-6">
          <p className="text-gray-700 mb-4">{dictionary.confirmText}</p>
          <p className="text-red-600 font-semibold mb-6">{dictionary.warning}</p>
          
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <div className="mb-2">
              <span className="font-semibold">{dictionary.name}:</span> {isArmenian && doctor.nameHy ? doctor.nameHy : doctor.name}
            </div>
            <div>
              <span className="font-semibold">{dictionary.specialty}:</span> {isArmenian && doctor.specialtyHy ? doctor.specialtyHy : doctor.specialty}
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-4">
          <Link
            href={`/${lang}/admin/doctors`}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            {dictionary.cancel}
          </Link>
          
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {dictionary.deleting}
              </span>
            ) : (
              dictionary.delete
            )}
          </button>
        </div>
      </div>
    </div>
  );
}