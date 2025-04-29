import Link from 'next/link';
import { prisma } from '../../../lib/prisma';

function StatusBadge({ status, translations }) {
  const badgeStyles = {
    SCHEDULED: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-blue-100 text-blue-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeStyles[status]}`}
      aria-label={`Status: ${translations[status]}`}
    >
      {translations[status]}
    </span>
  );
}

export default async function AdminAppointments({ params }) {
  const validLangs = ['en', 'hy'];
  const lang = validLangs.includes(params.lang) ? params.lang : 'en';
  const isArmenian = lang === 'hy';

  // Dictionary for translations
  const dictionary = {
    adminAppointments: {
      title: isArmenian ? 'Կառավարել Ժամադրությունները' : 'Manage Appointments',
      table: {
        patient: isArmenian ? 'Հիվանդ' : 'Patient',
        doctor: isArmenian ? 'Բժիշկ' : 'Doctor',
        date: isArmenian ? 'Ամսաթիվ' : 'Date',
        time: isArmenian ? 'Ժամ' : 'Time',
        status: isArmenian ? 'Կարգավիճակ' : 'Status',
        actions: isArmenian ? 'Գործողություններ' : 'Actions',
      },
      statuses: {
        SCHEDULED: isArmenian ? 'Պլանավորված' : 'Scheduled',
        CONFIRMED: isArmenian ? 'Հաստատված' : 'Confirmed',
        COMPLETED: isArmenian ? 'Ավարտված' : 'Completed',
        CANCELLED: isArmenian ? 'Չեղարկված' : 'Cancelled',
      },
      actions: {
        edit: isArmenian ? 'Խմբագրել' : 'Edit',
        cancel: isArmenian ? 'Չեղարկել' : 'Cancel',
        view: isArmenian ? 'Դիտել' : 'View',
        addNew: isArmenian ? 'Ավելացնել Նոր Ժամադրություն' : 'Add New Appointment',
      },
      noAppointments: isArmenian ? 'Ժամադրություններ չեն գտնվել' : 'No appointments found',
    },
  };

  // Fetch appointments
  let appointments = [];
  try {
    appointments = await prisma.appointment.findMany({
      include: {
        doctor: {
          select: {
            name: true,
            nameHy: true,
          },
        },
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
      take: 10,
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
  }

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return isArmenian ? 'Անվավեր ամսաթիվ' : 'Invalid date';
    }
    return date.toLocaleDateString(isArmenian ? 'hy-AM' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{dictionary.adminAppointments.title}</h1>
        <Link 
          href={`/${lang}/admin/appointments/new`} 
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          {dictionary.adminAppointments.actions.addNew}
        </Link>
      </div>

      {/* Appointments Table */}
      {appointments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th scope="col" className="py-3 px-4 text-left">
                  {dictionary.adminAppointments.table.patient}
                </th>
                <th scope="col" className="py-3 px-4 text-left">
                  {dictionary.adminAppointments.table.doctor}
                </th>
                <th scope="col" className="py-3 px-4 text-left">
                  {dictionary.adminAppointments.table.date}
                </th>
                <th scope="col" className="py-3 px-4 text-left">
                  {dictionary.adminAppointments.table.time}
                </th>
                <th scope="col" className="py-3 px-4 text-left">
                  {dictionary.adminAppointments.table.status}
                </th>
                <th scope="col" className="py-3 px-4 text-right">
                  {dictionary.adminAppointments.table.actions}
                </th>
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
                  <td className="py-3 px-4">{formatDate(appointment.date)}</td>
                  <td className="py-3 px-4">{appointment.time}</td>
                  <td className="py-3 px-4">
                    <StatusBadge
                      status={appointment.status}
                      translations={dictionary.adminAppointments.statuses}
                    />
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <Link 
                      href={`/${lang}/admin/appointments/${appointment.id}`}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      {dictionary.adminAppointments.actions.view}
                    </Link>
                    {appointment.status === 'SCHEDULED' && (
                      <>
                        <Link 
                          href={`/${lang}/admin/appointments/${appointment.id}/edit`}
                          className="text-green-600 hover:text-green-800 mr-2"
                        >
                          {dictionary.adminAppointments.actions.edit}
                        </Link>
                        <Link 
                          href={`/${lang}/admin/appointments/${appointment.id}/cancel`}
                          className="text-red-600 hover:text-red-800"
                        >
                          {dictionary.adminAppointments.actions.cancel}
                        </Link>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">{dictionary.adminAppointments.noAppointments}</p>
          <Link 
            href={`/${lang}/admin/appointments/new`} 
            className="mt-4 inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            {dictionary.adminAppointments.actions.addNew}
          </Link>
        </div>
      )}
    </div>
  );
}