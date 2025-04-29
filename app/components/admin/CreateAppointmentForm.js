// app/[lang]/admin/appointments/page.js (updated version)
import Link from 'next/link';
import { prisma } from '../../../../lib/prisma';

export default async function AdminAppointments({ params, searchParams }) {
  const { lang } = params;
  const isArmenian = lang === 'hy';
  
  // Get query parameters
  const page = Number(searchParams.page) || 1;
  const limit = 10;
  const status = searchParams.status || 'all';
  const search = searchParams.search || '';
  
  // Prepare filter conditions
  const statusFilter = status !== 'all' ? { status } : {};
  const searchFilter = search 
    ? {
        OR: [
          { patient: { firstName: { contains: search, mode: 'insensitive' } } },
          { patient: { lastName: { contains: search, mode: 'insensitive' } } },
          { doctor: { name: { contains: search, mode: 'insensitive' } } },
        ]
      } 
    : {};
  
  // Fetch appointments
  const appointments = await prisma.appointment.findMany({
    where: {
      ...statusFilter,
      ...searchFilter
    },
    include: {
      doctor: true,
      patient: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      },
    },
    orderBy: {
      date: 'desc',
    },
    skip: (page - 1) * limit,
    take: limit
  });
  
  // Get total count for pagination
  const totalCount = await prisma.appointment.count({
    where: {
      ...statusFilter,
      ...searchFilter
    }
  });
  
  const totalPages = Math.ceil(totalCount / limit);
  
  // Dictionary for translations
  const dictionary = {
    adminAppointments: {
      title: isArmenian ? 'Կառավարել Ժամադրությունները' : 'Manage Appointments',
      createNew: isArmenian ? 'Ստեղծել Նոր Ժամադրություն' : 'Create New Appointment',
      search: isArmenian ? 'Որոնել...' : 'Search...',
      filters: {
        all: isArmenian ? 'Բոլորը' : 'All',
        scheduled: isArmenian ? 'Պլանավորված' : 'Scheduled',
        confirmed: isArmenian ? 'Հաստատված' : 'Confirmed',
        completed: isArmenian ? 'Ավարտված' : 'Completed',
        cancelled: isArmenian ? 'Չեղարկված' : 'Cancelled'
      },
      table: {
        patient: isArmenian ? 'Հիվանդ' : 'Patient',
        doctor: isArmenian ? 'Բժիշկ' : 'Doctor',
        date: isArmenian ? 'Ամսաթիվ' : 'Date',
        time: isArmenian ? 'Ժամ' : 'Time',
        status: isArmenian ? 'Կարգավիճակ' : 'Status',
        actions: isArmenian ? 'Գործողություններ' : 'Actions'
      },
      actions: {
        edit: isArmenian ? 'Խմբագրել' : 'Edit',
        cancel: isArmenian ? 'Չեղարկել' : 'Cancel',
      },
      pagination: {
        previous: isArmenian ? 'Նախորդ' : 'Previous',
        next: isArmenian ? 'Հաջորդ' : 'Next',
        of: isArmenian ? '-ից' : 'of'
      },
      noAppointments: isArmenian ? 'Ժամադրություններ չեն գտնվել' : 'No appointments found'
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
      <div className="flex flex-col md:flex-row justify-between mb-6 items-start md:items-center">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">{dictionary.adminAppointments.title}</h1>
        <Link
          href={`/${lang}/admin/appointments/new`}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          {dictionary.adminAppointments.createNew}
        </Link>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <form 
          action={`/${lang}/admin/appointments`} 
          method="GET" 
          className="flex items-center"
        >
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder={dictionary.adminAppointments.search}
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
          
          {/* Hidden input to preserve other query params */}
          <input type="hidden" name="status" value={status} />
          <input type="hidden" name="page" value="1" />
        </form>
        
        <div>
          <select
            name="status"
            defaultValue={status}
            onChange={(e) => {
              const url = new URL(window.location.href);
              url.searchParams.set('status', e.target.value);
              url.searchParams.set('page', '1');
              window.location.href = url.toString();
            }}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">{dictionary.adminAppointments.filters.all}</option>
            <option value="SCHEDULED">{dictionary.adminAppointments.filters.scheduled}</option>
            <option value="CONFIRMED">{dictionary.adminAppointments.filters.confirmed}</option>
            <option value="COMPLETED">{dictionary.adminAppointments.filters.completed}</option>
            <option value="CANCELLED">{dictionary.adminAppointments.filters.cancelled}</option>
          </select>
        </div>
      </div>
      
      {/* Appointments Table */}
      {appointments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">{dictionary.adminAppointments.table.patient}</th>
                <th className="py-3 px-4 text-left">{dictionary.adminAppointments.table.doctor}</th>
                <th className="py-3 px-4 text-left">{dictionary.adminAppointments.table.date}</th>
                <th className="py-3 px-4 text-left">{dictionary.adminAppointments.table.time}</th>
                <th className="py-3 px-4 text-left">{dictionary.adminAppointments.table.status}</th>
                <th className="py-3 px-4 text-right">{dictionary.adminAppointments.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {appointment.patient.firstName} {appointment.patient.lastName}
                    <div className="text-xs text-gray-500">{appointment.patient.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    {isArmenian && appointment.doctor.nameHy 
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
                      {dictionary.adminAppointments.filters[appointment.status.toLowerCase()]}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Link 
                        href={`/${lang}/admin/appointments/${appointment.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        {dictionary.adminAppointments.actions.edit}
                      </Link>
                      {appointment.status !== 'CANCELLED' && appointment.status !== 'COMPLETED' && (
                        <Link 
                          href={`/${lang}/admin/appointments/${appointment.id}/cancel`}
                          className="text-red-600 hover:text-red-800"
                        >
                          {dictionary.adminAppointments.actions.cancel}
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">{dictionary.adminAppointments.noAppointments}</p>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 0 && (
        <div className="mt-6 flex justify-between items-center">
          <div>
            <p className="text-gray-600">
              {page} {dictionary.adminAppointments.pagination.of} {totalPages}
            </p>
          </div>
          <div className="flex space-x-2">
            <Link
              href={`/${lang}/admin/appointments?search=${search}&status=${status}&page=${page - 1}`}
              className={`px-4 py-2 rounded-md ${
                page <= 1 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {dictionary.adminAppointments.pagination.previous}
            </Link>
            <Link
              href={`/${lang}/admin/appointments?search=${search}&status=${status}&page=${page + 1}`}
              className={`px-4 py-2 rounded-md ${
                page >= totalPages 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {dictionary.adminAppointments.pagination.next}
          </Link>
        </div>
      </div>
    )}
  </div>
);
}