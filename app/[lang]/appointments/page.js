// app/[lang]/appointments/page.js
import Link from 'next/link';
import { prisma } from '../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function AppointmentsList({ params, searchParams }) {
  const { lang } = params;
  const isArmenian = lang === 'hy';
  
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);
    
    // If no session, redirect to login
    if (!session) {
      redirect(`/${lang}/login?callbackUrl=/${lang}/appointments`);
    }
    
    // Fetch user's appointments with doctor info
    const appointments = await prisma.appointment.findMany({
      where: {
        patientId: session.user.id,
      },
      include: {
        doctor: true,
        timeSlot: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
    
    // Dictionary for translations
    const dictionary = {
      appointments: {
        title: isArmenian ? 'Իմ Ժամադրությունները' : 'My Appointments',
        doctor: isArmenian ? 'Բժիշկ' : 'Doctor',
        date: isArmenian ? 'Ամսաթիվ' : 'Date',
        time: isArmenian ? 'Ժամ' : 'Time',
        status: isArmenian ? 'Կարգավիճակ' : 'Status',
        reason: isArmenian ? 'Պատճառ' : 'Reason',
        actions: isArmenian ? 'Գործողություններ' : 'Actions',
        noAppointments: isArmenian ? 'Դուք դեռ չունեք պլանավորված ժամադրություններ։' : 'You don\'t have any scheduled appointments yet.',
        newAppointment: isArmenian ? 'Նոր Ժամադրություն' : 'New Appointment',
        cancel: isArmenian ? 'Չեղարկել' : 'Cancel',
        reschedule: isArmenian ? 'Վերահամաձայնեցնել' : 'Reschedule',
        viewDetails: isArmenian ? 'Դիտել Մանրամասները' : 'View Details',
        statuses: {
          SCHEDULED: isArmenian ? 'Պլանավորված' : 'Scheduled',
          CONFIRMED: isArmenian ? 'Հաստատված' : 'Confirmed',
          COMPLETED: isArmenian ? 'Ավարտված' : 'Completed',
          CANCELLED: isArmenian ? 'Չեղարկված' : 'Cancelled',
        },
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
    
    // Translate status
    const translateStatus = (status) => {
      return dictionary.appointments.statuses[status] || status;
    };

    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{dictionary.appointments.title}</h1>
          <Link 
            href={`/${lang}/appointments/new`} 
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {dictionary.appointments.newAppointment}
          </Link>
        </div>
        
        {appointments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 mb-6">{dictionary.appointments.noAppointments}</p>
            <Link 
              href={`/${lang}/doctors`} 
              className="inline-block bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {dictionary.appointments.newAppointment}
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {dictionary.appointments.doctor}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {dictionary.appointments.date}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {dictionary.appointments.time}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {dictionary.appointments.status}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {dictionary.appointments.reason}
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {dictionary.appointments.actions}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          <Link href={`/${lang}/doctors/${appointment.doctorId}`} className="hover:text-blue-600">
                            {isArmenian && appointment.doctor.nameHy ? 
                              appointment.doctor.nameHy : 
                              appointment.doctor.name}
                          </Link>
                        </div>
                        <div className="text-sm text-gray-500">
                          {isArmenian && appointment.doctor.specialtyHy ? 
                            appointment.doctor.specialtyHy : 
                            appointment.doctor.specialty}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(appointment.date)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appointment.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          appointment.status === 'SCHEDULED' ? 'bg-yellow-100 text-yellow-800' :
                          appointment.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {translateStatus(appointment.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {appointment.reason ? 
                            (appointment.reason.length > 50 ? 
                              `${appointment.reason.substring(0, 50)}...` : 
                              appointment.reason) : 
                            '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {appointment.id && (
                          <>
                            <Link 
                              href={`/${lang}/appointments/${appointment.id}`}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              {dictionary.appointments.viewDetails}
                            </Link>
                            
                            {appointment.status === 'SCHEDULED' && (
                              <>
                                <Link 
                                  href={`/${lang}/appointments/${appointment.id}/edit`}
                                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                                >
                                  {dictionary.appointments.reschedule}
                                </Link>
                                <Link 
                                  href={`/${lang}/appointments/${appointment.id}/cancel`}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  {dictionary.appointments.cancel}
                                </Link>
                              </>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 text-center">
        <h1 className="text-3xl font-bold mb-6">{isArmenian ? 'Իմ Ժամադրությունները' : 'My Appointments'}</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {isArmenian 
            ? 'Սխալ է տեղի ունեցել ժամադրությունները բեռնելիս։ Խնդրում ենք փորձել կրկին։' 
            : 'An error occurred while loading appointments. Please try again.'}
        </div>
        <Link 
          href={`/${lang}`} 
          className="inline-block bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isArmenian ? 'Վերադառնալ Գլխավոր Էջ' : 'Return to Home'}
        </Link>
      </div>
    );
  }
}