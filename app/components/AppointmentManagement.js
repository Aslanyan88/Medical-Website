// components/AppointmentManagement.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AppointmentManagement({ 
  appointments, 
  totalPages, 
  currentPage, 
  lang, 
  dictionary,
  status = 'all',
  search = ''
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(search);
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'hy' ? 'hy-AM' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/${lang}/admin/appointments?search=${searchTerm}&status=${selectedStatus}&page=1`);
  };
  
  // Handle status filter change
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
    router.push(`/${lang}/admin/appointments?search=${searchTerm}&status=${newStatus}&page=1`);
  };
  
  // Handle delete appointment
  const confirmDelete = (id) => {
    setDeleteId(id);
    setIsDeleting(true);
  };
  
  const cancelDelete = () => {
    setIsDeleting(false);
    setDeleteId(null);
  };
  
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/appointments/${deleteId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Refresh page after successful deletion
        router.refresh();
      } else {
        alert('Failed to delete appointment');
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('An error occurred while deleting the appointment');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <div>
      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <form onSubmit={handleSearch} className="flex items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={dictionary.search}
            className="border border-gray-300 rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>
        
        <div>
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">{dictionary.filters.all}</option>
            <option value="SCHEDULED">{dictionary.filters.scheduled}</option>
            <option value="CONFIRMED">{dictionary.filters.confirmed}</option>
            <option value="COMPLETED">{dictionary.filters.completed}</option>
            <option value="CANCELLED">{dictionary.filters.cancelled}</option>
          </select>
        </div>
      </div>
      
      {/* Appointments Table */}
      {appointments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">{dictionary.table.patient}</th>
                <th className="py-3 px-4 text-left">{dictionary.table.doctor}</th>
                <th className="py-3 px-4 text-left">{dictionary.table.date}</th>
                <th className="py-3 px-4 text-left">{dictionary.table.time}</th>
                <th className="py-3 px-4 text-left">{dictionary.table.status}</th>
                <th className="py-3 px-4 text-right">{dictionary.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {appointment.patient.firstName} {appointment.patient.lastName}
                  </td>
                  <td className="py-3 px-4">
                    {lang === 'hy' && appointment.doctor.nameHy 
                      ? appointment.doctor.nameHy 
                      : appointment.doctor.name}
                  </td>
                  <td className="py-3 px-4">
                    {formatDate(appointment.date)}
                  </td>
                  <td className="py-3 px-4">
                    {appointment.time}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      appointment.status === 'SCHEDULED' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {dictionary.filters[appointment.status.toLowerCase()]}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Link 
                        href={`/${lang}/admin/appointments/${appointment.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {dictionary.actions.view}
                      </Link>
                      <Link 
                        href={`/${lang}/admin/appointments/${appointment.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        {dictionary.actions.edit}
                      </Link>
                      <button 
                        onClick={() => confirmDelete(appointment.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        {dictionary.actions.delete}
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
          <p className="text-gray-500">{dictionary.noAppointments}</p>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 0 && (
        <div className="mt-6 flex justify-between items-center">
          <div>
            <p className="text-gray-600">
              {currentPage} {dictionary.pagination.of} {totalPages}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => router.push(`/${lang}/admin/appointments?search=${searchTerm}&status=${selectedStatus}&page=${currentPage - 1}`)}
              disabled={currentPage <= 1}
              className={`px-4 py-2 rounded-md ${
                currentPage <= 1 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {dictionary.pagination.previous}
            </button>
            <button
              onClick={() => router.push(`/${lang}/admin/appointments?search=${searchTerm}&status=${selectedStatus}&page=${currentPage + 1}`)}
              disabled={currentPage >= totalPages}
              className={`px-4 py-2 rounded-md ${
                currentPage >= totalPages 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {dictionary.pagination.next}
            </button>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              {lang === 'hy' ? 'Հաստատեք ջնջումը' : 'Confirm Deletion'}
            </h3>
            <p className="mb-6 text-gray-600">
              {lang === 'hy' 
                ? 'Վստա՞հ եք, որ ցանկանում եք ջնջել այս ժամադրությունը: Այս գործողությունը չի կարող հետարկվել:' 
                : 'Are you sure you want to delete this appointment? This action cannot be undone.'}
            </p>
            <div className="flex justify-end space-x-2">
              <button 
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                {lang === 'hy' ? 'Չեղարկել' : 'Cancel'}
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                {lang === 'hy' ? 'Ջնջել' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}