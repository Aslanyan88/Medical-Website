// components/NewAppointmentForm.js (updated version with improved design)
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewAppointmentForm({ 
  lang, 
  isArmenian, 
  doctors, 
  selectedDoctorId, 
  timeSlots, 
  dictionary, 
  userId 
}) {
  const router = useRouter();
  const [doctor, setDoctor] = useState(selectedDoctorId || '');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState(timeSlots || []);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
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
  
  // Helper function to get day name from date
  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  };
  
  // When doctor changes, fetch available time slots and info
  useEffect(() => {
    if (!doctor) {
      setAvailableTimeSlots([]);
      setSelectedDoctor(null);
      return;
    }
    
    // If the doctor selection changes, reset date and time
    if (doctor !== selectedDoctorId) {
      setSelectedDate('');
      setSelectedTimeSlot('');
      setSelectedDay('');
    }
    
    // Find the selected doctor object
    const docObj = doctors.find(d => d.id === doctor);
    setSelectedDoctor(docObj);
    
    const fetchTimeSlots = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/timeslots?doctorId=${doctor}`);
        if (!response.ok) throw new Error('Failed to fetch time slots');
        
        const data = await response.json();
        setAvailableTimeSlots(data);
      } catch (err) {
        console.error('Error fetching time slots:', err);
        setError('Failed to load available time slots');
      } finally {
        setLoading(false);
      }
    };
    
    // Only fetch if not already provided or if doctor changed
    if ((!timeSlots || timeSlots.length === 0 || doctor !== selectedDoctorId) && doctor) {
      fetchTimeSlots();
    }
  }, [doctor, selectedDoctorId, timeSlots, doctors]);
  
  // When date changes, update the selected day
  useEffect(() => {
    if (selectedDate) {
      setSelectedDay(getDayOfWeek(selectedDate));
    } else {
      setSelectedDay('');
    }
  }, [selectedDate]);
  
  // Filter time slots based on selected date/day
  const filteredTimeSlots = selectedDay 
    ? availableTimeSlots.filter(slot => {
        return slot.day.toLowerCase() === selectedDay;
      })
    : [];
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!doctor || !selectedDate || !selectedTimeSlot) {
      setError(isArmenian ? 'Բոլոր պարտադիր դաշտերը պետք է լրացված լինեն' : 'All required fields must be filled');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId: doctor,
          patientId: userId,
          date: selectedDate,
          timeSlotId: selectedTimeSlot,
          reason,
          notes,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create appointment');
      }
      
      setSuccess(true);
      // Redirect to appointments list after successful creation
      setTimeout(() => {
        router.push(`/${lang}/appointments`);
      }, 2000);
    } catch (err) {
      console.error('Error creating appointment:', err);
      setError(err.message || dictionary.errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link 
          href={`/${lang}/appointments`} 
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          {dictionary.back}
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900">{dictionary.title}</h1>
        </div>
        
        {success ? (
          <div className="p-6">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {dictionary.successMessage}
            </div>
          </div>
        ) : error ? (
          <div className="p-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold mb-4">{isArmenian ? 'Ընտրեք Բժիշկին' : 'Select a Doctor'}</h2>
              
              <select
                id="doctor"
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                className="w-full border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-3"
                required
              >
                <option value="">-- {dictionary.selectDoctor} --</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {isArmenian && doc.nameHy ? doc.nameHy : doc.name} - {isArmenian && doc.specialtyHy ? doc.specialtyHy : doc.specialty}
                  </option>
                ))}
              </select>
            </div>
            
            {selectedDoctor && (
              <div className="p-6 border-b">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-blue-100 overflow-hidden mr-4">
                    {selectedDoctor.image ? (
                      <img 
                        src={selectedDoctor.image} 
                        alt={isArmenian && selectedDoctor.nameHy ? selectedDoctor.nameHy : selectedDoctor.name}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-blue-600 text-2xl font-bold">
                        {(isArmenian && selectedDoctor.nameHy ? selectedDoctor.nameHy : selectedDoctor.name).charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      {isArmenian && selectedDoctor.nameHy ? selectedDoctor.nameHy : selectedDoctor.name}
                    </h3>
                    <p className="text-blue-600">
                      {isArmenian && selectedDoctor.specialtyHy ? selectedDoctor.specialtyHy : selectedDoctor.specialty}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row md:space-x-4">
                  <div className="mb-4 md:mb-0 md:w-1/2">
                    <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
                      {dictionary.selectDate} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="date"
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setSelectedTimeSlot('');
                      }}
                      className="w-full border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-3"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  
                  <div className="md:w-1/2">
                    <label htmlFor="timeSlot" className="block text-gray-700 font-medium mb-2">
                      {dictionary.selectTime} <span className="text-red-500">*</span>
                    </label>
                    
                    {loading ? (
                      <div className="flex items-center justify-center p-4 border border-gray-300 rounded-lg bg-gray-50">
                        <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="ml-2">Loading...</span>
                      </div>
                    ) : !selectedDate ? (
                      <p className="p-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 italic">
                        {dictionary.selectDate}
                      </p>
                    ) : filteredTimeSlots.length === 0 ? (
                      <p className="p-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 italic">
                        {dictionary.noTimeSlots}
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {filteredTimeSlots.map((slot) => (
                          <div key={slot.id}>
                            <input
                              type="radio"
                              id={`slot-${slot.id}`}
                              name="timeSlot"
                              value={slot.id}
                              checked={selectedTimeSlot === slot.id}
                              onChange={() => setSelectedTimeSlot(slot.id)}
                              className="sr-only"
                              required
                            />
                            <label
                              htmlFor={`slot-${slot.id}`}
                              className={`block text-center p-3 rounded-lg border transition-colors cursor-pointer ${
                                selectedTimeSlot === slot.id
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {slot.startTime} - {slot.endTime}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {doctor && selectedDate && selectedTimeSlot && (
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold mb-4">{isArmenian ? 'Լրացուցիչ Տեղեկություններ' : 'Additional Information'}</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="reason" className="block text-gray-700 font-medium mb-2">
                      {dictionary.reason}
                    </label>
                    <input
                      type="text"
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-3"
                      placeholder={isArmenian ? 'Օր․՝ Տարեկան ստուգում' : 'E.g., Annual checkup'}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="notes" className="block text-gray-700 font-medium mb-2">
                      {dictionary.notes}
                    </label>
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows="4"
                      className="w-full border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-3"
                      placeholder={isArmenian ? 'Այստեղ նշեք ցանկացած լրացուցիչ տեղեկություն' : 'Note any additional information here'}
                    ></textarea>
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-6 flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                disabled={loading || !doctor || !selectedDate || !selectedTimeSlot}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isArmenian ? 'Պահպանվում է...' : 'Booking...'}
                  </div>
                ) : (
                  dictionary.submit
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}