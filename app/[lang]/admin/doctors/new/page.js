// app/[lang]/admin/doctors/[doctorId]/edit/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditDoctor({ params }) {
  const { lang, doctorId } = params;
  const isArmenian = lang === 'hy';
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    nameHy: '',
    email: '',
    specialty: '',
    specialtyHy: '',
    department: '',
    departmentHy: '',
    bio: '',
    bioHy: '',
    image: '',
    experience: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Dictionary for translations
  const dictionary = {
    title: isArmenian ? 'Խմբագրել Բժիշկին' : 'Edit Doctor',
    basicInfo: isArmenian ? 'Հիմնական Տեղեկություններ' : 'Basic Information',
    professionalInfo: isArmenian ? 'Մասնագիտական Տեղեկություններ' : 'Professional Information',
    bioInfo: isArmenian ? 'Կենսագրական Տեղեկություններ' : 'Biographical Information',
    fields: {
      name: isArmenian ? 'Անուն (Անգլերեն)' : 'Name (English)',
      nameHy: isArmenian ? 'Անուն (Հայերեն)' : 'Name (Armenian)',
      email: isArmenian ? 'Էլ. հասցե' : 'Email',
      experience: isArmenian ? 'Փորձի տարիներ' : 'Years of experience',
      image: isArmenian ? 'Նկարի URL' : 'Image URL',
      specialty: isArmenian ? 'Մասնագիտություն (Անգլերեն)' : 'Specialty (English)',
      specialtyHy: isArmenian ? 'Մասնագիտություն (Հայերեն)' : 'Specialty (Armenian)',
      department: isArmenian ? 'Բաժին (Անգլերեն)' : 'Department (English)',
      departmentHy: isArmenian ? 'Բաժին (Հայերեն)' : 'Department (Armenian)',
      bio: isArmenian ? 'Կենսագրություն (Անգլերեն)' : 'Biography (English)',
      bioHy: isArmenian ? 'Կենսագրություն (Հայերեն)' : 'Biography (Armenian)',
    },
    save: isArmenian ? 'Պահպանել' : 'Save',
    saving: isArmenian ? 'Պահպանվում է...' : 'Saving...',
    cancel: isArmenian ? 'Չեղարկել' : 'Cancel',
    successMessage: isArmenian ? 'Բժիշկը հաջողությամբ թարմացվել է։' : 'Doctor has been successfully updated.',
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
        
        setFormData({
          name: doctorData.name || '',
          nameHy: doctorData.nameHy || '',
          email: doctorData.email || '',
          specialty: doctorData.specialty || '',
          specialtyHy: doctorData.specialtyHy || '',
          department: doctorData.department || '',
          departmentHy: doctorData.departmentHy || '',
          bio: doctorData.bio || '',
          bioHy: doctorData.bioHy || '',
          image: doctorData.image || '',
          experience: doctorData.experience ? doctorData.experience.toString() : ''
        });
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching doctor:', err);
        setError('Failed to load doctor data');
        setIsLoading(false);
      }
    };
    
    fetchDoctorData();
  }, [doctorId]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/admin/doctors/${doctorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update doctor');
      }
      
      setSuccess(true);
      
      // Redirect after successful submission
      setTimeout(() => {
        router.push(`/${lang}/admin/doctors`);
        router.refresh();
      }, 2000);
    } catch (err) {
      console.error('Error updating doctor:', err);
      setError(err.message || dictionary.errorMessage);
    } finally {
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
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{dictionary.title}</h1>
        <Link 
          href={`/${lang}/admin/doctors`}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-gray-800"
        >
          {dictionary.cancel}
        </Link>
      </div>
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {dictionary.successMessage}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">{dictionary.basicInfo}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-1">
                {dictionary.fields.name} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="nameHy" className="block text-gray-700 mb-1">
                {dictionary.fields.nameHy}
              </label>
              <input
                type="text"
                id="nameHy"
                name="nameHy"
                value={formData.nameHy}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-1">
                {dictionary.fields.email} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="experience" className="block text-gray-700 mb-1">
                {dictionary.fields.experience}
              </label>
              <input
                type="number"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                min="0"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="image" className="block text-gray-700 mb-1">
                {dictionary.fields.image}
              </label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="https://example.com/image.jpg"
              />
              {formData.image && (
                <div className="mt-2">
                  <img 
                    src={formData.image} 
                    alt="Doctor preview" 
                    className="h-32 w-32 object-cover rounded-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-doctor.jpg';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">{dictionary.professionalInfo}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="specialty" className="block text-gray-700 mb-1">
                {dictionary.fields.specialty} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="specialty"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="specialtyHy" className="block text-gray-700 mb-1">
                {dictionary.fields.specialtyHy}
              </label>
              <input
                type="text"
                id="specialtyHy"
                name="specialtyHy"
                value={formData.specialtyHy}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label htmlFor="department" className="block text-gray-700 mb-1">
                {dictionary.fields.department} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="departmentHy" className="block text-gray-700 mb-1">
                {dictionary.fields.departmentHy}
              </label>
              <input
                type="text"
                id="departmentHy"
                name="departmentHy"
                value={formData.departmentHy}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">{dictionary.bioInfo}</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="bio" className="block text-gray-700 mb-1">
                {dictionary.fields.bio}
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label htmlFor="bioHy" className="block text-gray-700 mb-1">
                {dictionary.fields.bioHy}
              </label>
              <textarea
                id="bioHy"
                name="bioHy"
                value={formData.bioHy}
                onChange={handleChange}
                rows="4"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {dictionary.saving}
              </span>
            ) : (
              dictionary.save
            )}
          </button>
        </div>
      </form>
    </div>
  );
}