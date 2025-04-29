// app/[lang]/admin/doctors/[doctorId]/timeslots/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DoctorTimeslots({ params }) {
  const { lang, doctorId } = params;
  const isArmenian = lang === 'hy';
  const router = useRouter();
  
  const [doctor, setDoctor] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // New timeslot form
  const [isAddingTimeslot, setIsAddingTimeslot] = useState(false);
  const [formData, setFormData] = useState({
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:00',
    isAvailable: true
  });
  
  // Edit timeslot
  const [isEditingTimeslot, setIsEditingTimeslot] = useState(false);
  const [editingTimeslotId, setEditingTimeslotId] = useState(null);
  
  // Delete timeslot
  const [isDeletingTimeslot, setIsDeletingTimeslot] = useState(false);
  const [deletingTimeslotId, setDeletingTimeslotId] = useState(null);
  
  // Form submission loading state
  const [loading, setLoading] = useState(false);
  
  // Dictionary for translations
  const dictionary = {
    title: isArmenian ? 'Ժամային Միջակայքեր' : 'Timeslots',
    back: isArmenian ? 'Վերադառնալ' : 'Back',
    addTimeslot: isArmenian ? 'Ավելացնել Ժամային Միջակայք' : 'Add Timeslot',
    noTimeslots: isArmenian ? 'Ժամային միջակայքեր չեն գտնվել' : 'No timeslots found',
    form: {
      day: isArmenian ? 'Օր' : 'Day',
      startTime: isArmenian ? 'Սկսվելու ժամ' : 'Start Time',
      endTime: isArmenian ? 'Ավարտի ժամ' : 'End Time',
      isAvailable: isArmenian ? 'Հասանելի' : 'Available',
      save: isArmenian ? 'Պահպանել' : 'Save',
      saving: isArmenian ? 'Պահպանվում է...' : 'Saving...',
      update: isArmenian ? 'Թարմացնել' : 'Update',
      updating: isArmenian ? 'Թարմացվում է...' : 'Updating...',
      cancel: isArmenian ? 'Չեղարկել' : 'Cancel',
      delete: isArmenian ? 'Ջնջել' : 'Delete',
      deleting: isArmenian ? 'Ջնջվում է...' : 'Deleting...',
    },
    days: {
      monday: isArmenian ? 'Երկուշաբթի' : 'Monday',
      tuesday: isArmenian ? 'Երեքշաբթի' : 'Tuesday',
      wednesday: isArmenian ? 'Չորեքշաբթի' : 'Wednesday',
      thursday: isArmenian ? 'Հինգշաբթի' : 'Thursday',
      friday: isArmenian ? 'Ուրբաթ' : 'Friday',
      saturday: isArmenian ? 'Շաբաթ' : 'Saturday',
      sunday: isArmenian ? 'Կիրակի' : 'Sunday',
    },
    table: {
      day: isArmenian ? 'Օր' : 'Day',
      time: isArmenian ? 'Ժամ' : 'Time',
      status: isArmenian ? 'Կարգավիճակ' : 'Status',
      actions: isArmenian ? 'Գործողություններ' : 'Actions',
    },
    status: {
      available: isArmenian ? 'Հասանելի' : 'Available',
      booked: isArmenian ? 'Ամրագրված' : 'Booked',
    },
    deleteConfirm: {
      title: isArmenian ? 'Ջնջել Ժամային Միջակայքը' : 'Delete Timeslot',
      message: isArmenian 
        ? 'Վստա՞հ եք, որ ցանկանում եք ջնջել այս ժամային միջակայքը: Այս գործողությունը հնարավոր չէ հետարկել:' 
        : 'Are you sure you want to delete this timeslot? This action cannot be undone.',
    },
    successMessages: {
      add: isArmenian ? 'Ժամային միջակայքը հաջողությամբ ավելացվել է։' : 'Timeslot has been successfully added.',
      update: isArmenian ? 'Ժամային միջակայքը հաջողությամբ թարմացվել է։' : 'Timeslot has been successfully updated.',
      delete: isArmenian ? 'Ժամային միջակայքը հաջողությամբ ջնջվել է։' : 'Timeslot has been successfully deleted.',
    },
    errorMessages: {
      load: isArmenian ? 'Չհաջողվեց բեռնել տվյալները։' : 'Failed to load data.',
      add: isArmenian ? 'Չհաջողվեց ավելացնել ժամային միջակայքը։' : 'Failed to add timeslot.',
      update: isArmenian ? 'Չհաջողվեց թարմացնել ժամային միջակայքը։' : 'Failed to update timeslot.',
      delete: isArmenian ? 'Չհաջողվեց ջնջել ժամային միջակայքը։' : 'Failed to delete timeslot.',
      deleteBooked: isArmenian 
        ? 'Հնարավոր չէ ջնջել արդեն ամրագրված ժամային միջակայքը։' 
        : 'Cannot delete a timeslot that is already booked.',
    }
  };
  
  // Available days for dropdown
  const days = [
    { value: 'Monday', label: dictionary.days.monday },
    { value: 'Tuesday', label: dictionary.days.tuesday },
    { value: 'Wednesday', label: dictionary.days.wednesday },
    { value: 'Thursday', label: dictionary.days.thursday },
    { value: 'Friday', label: dictionary.days.friday },
    { value: 'Saturday', label: dictionary.days.saturday },
    { value: 'Sunday', label: dictionary.days.sunday }
  ];
  
  // Fetch doctor data and timeslots
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch doctor data
        const doctorResponse = await fetch(`/api/admin/doctors/${doctorId}`);
        
        if (!doctorResponse.ok) {
          throw new Error('Failed to fetch doctor data');
        }
        
        const doctorData = await doctorResponse.json();
        setDoctor(doctorData);
        
        // Fetch timeslots
        const timeslotsResponse = await fetch(`/api/admin/doctors/${doctorId}/timeslots`);
        
        if (!timeslotsResponse.ok) {
          throw new Error('Failed to fetch timeslots');
        }
        
        const timeslotsData = await timeslotsResponse.json();
        setTimeSlots(timeslotsData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(dictionary.errorMessages.load);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [doctorId, dictionary.errorMessages.load]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle add timeslot form submission
  const handleAddTimeslot = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/admin/doctors/${doctorId}/timeslots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || dictionary.errorMessages.add);
      }
      
      const newTimeslot = await response.json();
      
      // Update timeslots list
      setTimeSlots(prev => [...prev, newTimeslot]);
      
      // Reset form
      setFormData({
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:00',
        isAvailable: true
      });
      
      setIsAddingTimeslot(false);
      setSuccess(dictionary.successMessages.add);
      
      // Clear success message after a delay
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Error adding timeslot:', err);
      setError(err.message || dictionary.errorMessages.add);
    } finally {
      setLoading(false);
    }
  };
  
  // Start editing a timeslot
  const handleEditStart = (timeslot) => {
    setFormData({
      day: timeslot.day,
      startTime: timeslot.startTime,
      endTime: timeslot.endTime,
      isAvailable: timeslot.isAvailable
    });
    setEditingTimeslotId(timeslot.id);
    setIsEditingTimeslot(true);
  };
  
  // Handle update timeslot form submission
  const handleUpdateTimeslot = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/admin/timeslots/${editingTimeslotId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || dictionary.errorMessages.update);
      }
      
      const updatedTimeslot = await response.json();
      
      // Update timeslots list
      setTimeSlots(prev => prev.map(slot => 
        slot.id === editingTimeslotId ? updatedTimeslot : slot
      ));
      
      // Reset form
      setFormData({
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:00',
        isAvailable: true
      });
      
      setIsEditingTimeslot(false);
      setEditingTimeslotId(null);
      setSuccess(dictionary.successMessages.update);
      
      // Clear success message after a delay
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Error updating timeslot:', err);
      setError(err.message || dictionary.errorMessages.update);
    } finally {
      setLoading(false);
    }
  };
  
  // Start deleting a timeslot
  const handleDeleteStart = (timeslotId) => {
    setDeletingTimeslotId(timeslotId);
    setIsDeletingTimeslot(true);
  };
  
  // Cancel delete
  const handleDeleteCancel = () => {
    setIsDeletingTimeslot(false);
    setDeletingTimeslotId(null);
  };
  
  // Handle delete timeslot
  const handleDeleteTimeslot = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/admin/timeslots/${deletingTimeslotId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || dictionary.errorMessages.delete);
      }
      
      // Update timeslots list
      setTimeSlots(prev => prev.filter(slot => slot.id !== deletingTimeslotId));
      
      setIsDeletingTimeslot(false);
      setDeletingTimeslotId(null);
      setSuccess(dictionary.successMessages.delete);
      
      // Clear success message after a delay
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Error deleting timeslot:', err);
      setError(err.message || dictionary.errorMessages.delete);
    } finally {
      setLoading(false);
    }
  };
  
  // Get day name in the selected language
  const getDayName = (day) => {
    const dayKey = day.toLowerCase();
    return dictionary.days[dayKey] || day;
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
        <div>
          <h1 className="text-2xl font-bold">
            {dictionary.title} - {isArmenian && doctor?.nameHy ? doctor.nameHy : doctor?.name}
          </h1>
          <p className="text-gray-600">
            {isArmenian && doctor?.specialtyHy ? doctor.specialtyHy : doctor?.specialty}
          </p>
        </div>
        <div className="space-x-2">
          <Link 
            href={`/${lang}/admin/doctors`}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-gray-800"
          >
            {dictionary.back}
          </Link>
          
          <button
            onClick={() => setIsAddingTimeslot(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {dictionary.addTimeslot}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      {/* Add/Edit Timeslot Form */}
      {(isAddingTimeslot || isEditingTimeslot) && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {isEditingTimeslot ? 
              (isArmenian ? 'Խմբագրել Ժամային Միջակայքը' : 'Edit Timeslot') : 
              dictionary.addTimeslot
            }
          </h2>
          
          <form onSubmit={isEditingTimeslot ? handleUpdateTimeslot : handleAddTimeslot} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Day */}
              <div>
                <label htmlFor="day" className="block text-gray-700 mb-1">
                  {dictionary.form.day}
                </label>
                <select
                  id="day"
                  name="day"
                  value={formData.day}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  {days.map(day => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Start Time */}
              <div>
                <label htmlFor="startTime" className="block text-gray-700 mb-1">
                  {dictionary.form.startTime}
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              
              {/* End Time */}
              <div>
                <label htmlFor="endTime" className="block text-gray-700 mb-1">
                  {dictionary.form.endTime}
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              
              {/* Is Available */}
              <div className="flex items-end">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                    className="rounded text-blue-600 focus:ring-blue-500 h-5 w-5"
                  />
                  <span className="ml-2">{dictionary.form.isAvailable}</span>
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  if (isEditingTimeslot) {
                    setIsEditingTimeslot(false);
                    setEditingTimeslotId(null);
                  } else {
                    setIsAddingTimeslot(false);
                  }
                  setFormData({
                    day: 'Monday',
                    startTime: '09:00',
                    endTime: '10:00',
                    isAvailable: true
                  });
                }}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-gray-800"
              >
                {dictionary.form.cancel}
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isEditingTimeslot ? dictionary.form.updating : dictionary.form.saving}
                  </span>
                ) : (
                  isEditingTimeslot ? dictionary.form.update : dictionary.form.save
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Timeslots Table */}
      {timeSlots.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">{dictionary.table.day}</th>
                <th className="py-3 px-4 text-left">{dictionary.table.time}</th>
                <th className="py-3 px-4 text-left">{dictionary.table.status}</th>
                <th className="py-3 px-4 text-right">{dictionary.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {timeSlots.map((timeslot) => (
                <tr key={timeslot.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {getDayName(timeslot.day)}
                  </td>
                  <td className="py-3 px-4">
                    {timeslot.startTime} - {timeslot.endTime}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      timeslot.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {timeslot.isAvailable ? dictionary.status.available : dictionary.status.booked}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEditStart(timeslot)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        {isArmenian ? 'Խմբագրել' : 'Edit'}
                      </button>
                      <button
                        onClick={() => handleDeleteStart(timeslot.id)}
                        className="text-red-600 hover:text-red-800"
                        disabled={!timeslot.isAvailable}
                      >
                        {dictionary.form.delete}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">{dictionary.noTimeslots}</p>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeletingTimeslot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">{dictionary.deleteConfirm.title}</h3>
            <p className="mb-6 text-gray-600">{dictionary.deleteConfirm.message}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-gray-800"
              >
                {dictionary.form.cancel}
              </button>
              <button
                onClick={handleDeleteTimeslot}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {dictionary.form.deleting}
                  </span>
                ) : (
                  dictionary.form.delete
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}