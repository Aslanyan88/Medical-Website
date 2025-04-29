// components/DoctorForm.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DoctorForm({ 
  lang, 
  doctor = null, 
  dictionary 
}) {
  const router = useRouter();
  const isEdit = !!doctor;
  const isArmenian = lang === 'hy';
  
  // Form state
  const [formData, setFormData] = useState({
    name: doctor?.name || '',
    nameHy: doctor?.nameHy || '',
    email: doctor?.email || '',
    specialty: doctor?.specialty || '',
    specialtyHy: doctor?.specialtyHy || '',
    department: doctor?.department || '',
    departmentHy: doctor?.departmentHy || '',
    bio: doctor?.bio || '',
    bioHy: doctor?.bioHy || '',
    image: doctor?.image || '',
    experience: doctor?.experience || ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
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
      const url = isEdit 
        ? `/api/admin/doctors/${doctor.id}` 
        : '/api/admin/doctors';
      
      const method = isEdit ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save doctor');
      }
      
      setSuccess(true);
      
      // Redirect after successful submission
      setTimeout(() => {
        router.push(`/${lang}/admin/doctors`);
        router.refresh();
      }, 2000);
    } catch (err) {
      console.error('Error saving doctor:', err);
      setError(err.message || dictionary.errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">{dictionary.basicInfo}</h2>
            
            <div className="space-y-4">
              {/* Name (English) */}
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
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              {/* Name (Armenian) */}
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
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Email */}
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
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              {/* Experience */}
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
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Image URL */}
              <div>
                <label htmlFor="image" className="block text-gray-700 mb-1">
                  {dictionary.fields.image}
                </label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          {/* Professional Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">{dictionary.professionalInfo}</h2>
            
            <div className="space-y-4">
              {/* Specialty (English) */}
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
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              {/* Specialty (Armenian) */}
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
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Department (English) */}
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
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              {/* Department (Armenian) */}
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
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Bio Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">{dictionary.bioInfo}</h2>
          
          <div className="space-y-4">
            {/* Bio (English) */}
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
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Bio (Armenian) */}
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
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Link
            href={`/${lang}/admin/doctors`}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            {dictionary.cancel}
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
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