// components/TimeslotManager.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TimeslotManager({ 
  doctor, 
  timeSlots, 
  lang, 
  dictionary 
}) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const isArmenian = lang === 'hy';
  
  // New timeslot form state
  const [formData, setFormData] = useState({
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:00',
    isAvailable: true
  });
  
  // Available days
  const days = [
    { value: 'Monday', label: dictionary.days.monday },
    { value: 'Tuesday', label: dictionary.days.tuesday },
    { value: 'Wednesday', label: dictionary.days.wednesday },
    { value: 'Thursday', label: dictionary.days.thursday },
    { value: 'Friday', label: dictionary.days.friday },
    { value: 'Saturday', label: dictionary.days.saturday },
    { value: 'Sunday', label: dictionary.days.sunday }
  ];
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle form submission for adding a new timeslot
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`/api/admin/doctors/${doctor.id}/timeslots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add timeslot');
      }
      
      setSuccess(dictionary.messages?.success || 'Timeslot added successfully');
      setIsAdding(false);
      setFormData({
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:00',
        isAvailable: true
      });
      
      // Refresh the page to show new timeslot
      router.refresh();
    } catch (err) {
      console.error('Error adding timeslot:', err);
      setError(err.message || dictionary.messages?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form submission for editing a timeslot
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`/api/admin/timeslots/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update timeslot');
      }
      
      setSuccess(dictionary.messages?.success || 'Timeslot updated successfully');
      setIsEditing(false);
      setEditingId(null);
      setFormData({
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:00',
        isAvailable: true
      });
      
      // Refresh the page to show updated timeslot
      router.refresh();
    } catch (err) {
      console.error('Error updating timeslot:', err);
      setError(err.message || dictionary.messages?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle delete confirmation
  const confirmDelete = (id) => {
    setDeleteId(id);
    setIsDeleting(true);
  };
  
  const cancelDelete = () => {
    setIsDeleting(false);
    setDeleteId(null);
  };
  
  // Handle timeslot deletion
  const handleDelete = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`/api/admin/timeslots/${deleteId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete timeslot');
      }
      
      setSuccess(dictionary.messages?.success || 'Timeslot deleted successfully');
      setIsDeleting(false);
      setDeleteId(null);
      
      // Refresh the page to show updated timeslots
      router.refresh();
    } catch (err) {
      console.error('Error deleting timeslot:', err);
      setError(err.message || dictionary.messages?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  // Start editing a timeslot
  const handleEdit = (timeslot) => {
    setEditingId(timeslot.id);
    setFormData({
      day: timeslot.day,
      startTime: timeslot.startTime,
      endTime: timeslot.endTime,
      isAvailable: timeslot.isAvailable
    });
    setIsEditing(true);
  };
  
  // Cancel editing
  const cancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      day: 'Monday',
      startTime: '09:00',
      endTime: '10:00',
      isAvailable: true
    });
  };
  
  // Translate day names
  const translateDay = (day) => {
    const dayMap = {
      'monday': dictionary.days.monday,
      'tuesday': dictionary.days.tuesday,
      'wednesday': dictionary.days.wednesday,
      'thursday': dictionary.days.thursday,
      'friday': dictionary.days.friday,
      'saturday': dictionary.days.saturday,
      'sunday': dictionary.days.sunday
    };
    
    return dayMap[day.toLowerCase()] || day;
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <Link 
          href={`/${lang}/admin/doctors`} 
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          {dictionary.back}
        </Link>
        
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {dictionary.addTimeslot}
        </button>
      </div>
      
      {/* Success and Error Messages */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Add Timeslot Form */}
      {isAdding && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">{dictionary.addTimeslot}</h3>
          <form onSubmit={handleAddSubmit} className="space-y-4">
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
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
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
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
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
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
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
            
            {/* Form Actions */}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                {dictionary.form.cancel}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </span>
                ) : (
                  dictionary.form.add
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Edit Timeslot Form */}
      {isEditing && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">
            {isArmenian ? 'Խմբագրել Ժամային Միջակայքը' : 'Edit Timeslot'}
          </h3>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Day */}
              <div>
                <label htmlFor="edit-day" className="block text-gray-700 mb-1">
                  {dictionary.form.day}
                </label>
                <select
                  id="edit-day"
                  name="day"
                  value={formData.day}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
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
                <label htmlFor="edit-startTime" className="block text-gray-700 mb-1">
                  {dictionary.form.startTime}
                </label>
                <input
                  type="time"
                  id="edit-startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              {/* End Time */}
              <div>
                <label htmlFor="edit-endTime" className="block text-gray-700 mb-1">
                  {dictionary.form.endTime}
                </label>
                <input
                  type="time"
                  id="edit-endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
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
            
            {/* Form Actions */}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                {dictionary.form.cancel}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  dictionary.form.update
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Timeslots Table */}
      {timeSlots && timeSlots.length > 0 ? (
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
                    {translateDay(timeslot.day)}
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
                        onClick={() => handleEdit(timeslot)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        {dictionary.form.edit || 'Edit'}
                      </button>
                      <button
                        onClick={() => confirmDelete(timeslot.id)}
                        className="text-red-600 hover:text-red-800"
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
        <div className="text-center py-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">{dictionary.noTimeslots}</p>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              {isArmenian ? 'Հաստատեք ջնջումը' : 'Confirm Deletion'}
            </h3>
            <p className="mb-6 text-gray-600">
              {isArmenian 
                ? 'Վստա՞հ եք, որ ցանկանում եք ջնջել այս ժամային միջակայքը: Այս գործողությունը չի կարող հետարկվել:' 
                : 'Are you sure you want to delete this timeslot? This action cannot be undone.'}
            </p>
            <div className="flex justify-end space-x-2">
              <button 
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                {isArmenian ? 'Չեղարկել' : 'Cancel'}
              </button>
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
                    Deleting...
                  </span>
                ) : (
                  isArmenian ? 'Ջնջել' : 'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}