// components/admin/EditAppointmentForm.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditAppointmentForm({ 
  lang, 
  appointment, 
  doctors, 
  timeSlots, 
  dictionary 
}) {
  const router = useRouter();
  const isArmenian = lang === 'hy';
  
  // Form state
  const [formData, setFormData] = useState({
    doctorId: appointment.doctorId,
    date: new Date(appointment.date).toISOString().split('T')[0],
    timeSlotId: appointment.timeSlotId || '',
    status: appointment.status,
    reason: appointment.reason || '',
    notes: appointment.notes || '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState(timeSlots);
  
  // When doctor changes, fetch available time slots
  useEffect(() => {
    if (formData.doctorId !== appointment.doctorId) {
      setLoading(true);
      
      fetch(`/api/admin/doctors/${formData.doctorId}/timeslots`)
        .then(res => res.json())
        .then(data => {
          setAvailableTimeSlots(data);
          setFormData(prev => ({
            ...prev,
            timeSlotId: ''
          }));
        })
        .catch(err => {
          console.error('Error fetching time slots:', err);
          setError('Failed to load time slots');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [formData.doctorId, appointment.doctorId]);
  
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
    setSuccess(false);
    
    try {
      const response = await fetch(`/api/admin/appointments/${appointment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          oldTimeSlotId: appointment.timeSlotId
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update appointment');
      }
      
      setSuccess(true);
      
      // Redirect after successful update
      setTimeout(() => {
        router.push(`/${lang}/admin/appointments`);
        router.refresh();
      }, 2000);
    } catch (err) {
      console.error('Error updating appointment:', err);
      setError(err.message || dictionary.errorMessage);
    } finally {
      setLoading(false);
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
      
      <p className="text-gray-600 mb-8">{dictionary.subtitle}</p>
      
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
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium mb-4">{isArmenian ? 'Հիմնական Տեղեկություններ' : 'Basic Information'}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Doctor Selection */}
            <div>
              <label htmlFor="doctorId" className="block text-gray-700 font-medium mb-2">
                {dictionary.doctor}
              </label>
              <select
                id="doctorId"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">{dictionary.selectDoctor}</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {isArmenian && doctor.nameHy ? doctor.nameHy : doctor.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Patient Information (read-only) */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                {dictionary.patient}
              </label>
              <div className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50">
                {appointment.patient.firstName} {appointment.patient.lastName} ({appointment.patient.email})
              </div>
            </div>
            
            {/* Date Selection */}
            <div>
              <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
                {dictionary.date}
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            {/* Time Slot Selection */}
            <div>
              <label htmlFor="timeSlotId" className="block text-gray-700 font-medium mb-2">
                {dictionary.time}
              </label>
              {loading ? (
                <div className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isArmenian ? 'Բեռնում...' : 'Loading...'}
                </div>
              ) : availableTimeSlots.length > 0 ? (
                <select
                  id="timeSlotId"
                  name="timeSlotId"
                  value={formData.timeSlotId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">{dictionary.selectTimeSlot}</option>
                  {availableTimeSlots.map(slot => (
                    <option key={slot.id} value={slot.id}>
                      {slot.day}, {slot.startTime} - {slot.endTime}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500">
                  {dictionary.noTimeSlots}
                </div>
              )}
            </div>
            
            {/* Status Selection */}
            <div>
              <label htmlFor="status" className="block text-gray-700 font-medium mb-2">
                {dictionary.status}
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">{dictionary.selectStatus}</option>
                <option value="SCHEDULED">{dictionary.statuses.SCHEDULED}</option>
                <option value="CONFIRMED">{dictionary.statuses.CONFIRMED}</option>
                <option value="COMPLETED">{dictionary.statuses.COMPLETED}</option>
                <option value="CANCELLED">{dictionary.statuses.CANCELLED}</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium mb-4">{isArmenian ? 'Լրացուցիչ Տեղեկություններ' : 'Additional Information'}</h2>
          
          <div className="space-y-4">
            {/* Reason */}
            <div>
              <label htmlFor="reason" className="block text-gray-700 font-medium mb-2">
                {dictionary.reason}
              </label>
              <input
                type="text"
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-gray-700 font-medium mb-2">
                {dictionary.notes}
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
          </div>
        </div>
        
        <div className="p-6 flex justify-end">
          <Link
            href={`/${lang}/admin/appointments`}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
          >
            {dictionary.cancel}
          </Link>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isArmenian ? 'Պահպանվում է...' : 'Saving...'}
              </span>
            ) : (
              dictionary.submit
            )}
          </button>
        </div>
      </form>
    </div>
  );
}