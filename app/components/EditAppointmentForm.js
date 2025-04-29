// components/EditAppointmentForm.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditAppointmentForm({ 
  lang, 
  isArmenian, 
  appointment, 
  timeSlots, 
  dictionary, 
  userId 
}) {
  const router = useRouter();
  const [availableTimeSlots, setAvailableTimeSlots] = useState(timeSlots || []);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [reason, setReason] = useState(appointment.reason || '');
  const [notes, setNotes] = useState(appointment.notes || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Group time slots by day
  const timeSlotsByDay = availableTimeSlots.reduce((acc, slot) => {
    const day = slot.day.toLowerCase();
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(slot);
    return acc;
  }, {});
  
  // Helper function to get day of week from date
  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  };
  
  // Filter time slots based on selected date
  const filteredTimeSlots = selectedDate 
    ? availableTimeSlots.filter(slot => {
        const dayOfWeek = getDayOfWeek(selectedDate);
        return slot.day.toLowerCase() === dayOfWeek;
      })
    : [];
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTimeSlot) {
      setError(isArmenian ? 'Ամսաթիվը և ժամը պարտադիր են' : 'Date and time are required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/appointments/${appointment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate,
          timeSlotId: selectedTimeSlot,
          reason,
          notes,
          oldTimeSlotId: appointment.timeSlotId,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update appointment');
      }
      
      setSuccess(true);
      // Redirect after successful update
      setTimeout(() => {
        router.push(`/${lang}/appointments/${appointment.id}`);
        router.refresh();
      }, 2000);
    } catch (err) {
      console.error('Error updating appointment:', err);
      setError(err.message || dictionary.errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link 
          href={`/${lang}/appointments/${appointment.id}`} 
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          {dictionary.back}
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{dictionary.title}</h1>
        
        {success ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {dictionary.successMessage}
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : null}
        
        <form onSubmit={handleSubmit}>
          {/* Doctor Info */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              {dictionary.doctor}
            </label>
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="font-medium">{isArmenian && appointment.doctor.nameHy ? appointment.doctor.nameHy : appointment.doctor.name}</p>
              <p className="text-gray-600">{isArmenian && appointment.doctor.specialtyHy ? appointment.doctor.specialtyHy : appointment.doctor.specialty}</p>
            </div>
          </div>
          
          {/* Date Selection */}
          <div className="mb-6">
            <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
              {dictionary.selectDate} <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          {/* Time Slot Selection */}
          <div className="mb-6">
            <label htmlFor="timeSlot" className="block text-gray-700 font-medium mb-2">
              {dictionary.selectTime} <span className="text-red-500">*</span>
            </label>
            
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="ml-2">Loading...</span>
              </div>
            ) : !selectedDate ? (
              <p className="text-gray-500 italic">{dictionary.selectDate}</p>
            ) : selectedDate && filteredTimeSlots.length === 0 ? (
              <p className="text-gray-500 italic">{dictionary.noTimeSlots}</p>
            ) : (
              <select
                id="timeSlot"
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              >
                <option value="">-- {dictionary.selectTime} --</option>
                {filteredTimeSlots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.startTime} - {slot.endTime}
                  </option>
                ))}
              </select>
            )}
          </div>
          
          {/* Reason for Appointment */}
          <div className="mb-6">
            <label htmlFor="reason" className="block text-gray-700 font-medium mb-2">
              {dictionary.reason}
            </label>
            <input
              type="text"
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          
          {/* Additional Notes */}
          <div className="mb-6">
            <label htmlFor="notes" className="block text-gray-700 font-medium mb-2">
              {dictionary.notes}
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            ></textarea>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
              disabled={loading || !selectedDate || !selectedTimeSlot}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isArmenian ? 'Պահպանվում է...' : 'Saving...'}
                </div>
              ) : (
                dictionary.submit
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}