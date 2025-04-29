// app/[lang]/appointments/[id]/page.js
import Link from 'next/link';
import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function AppointmentDetail({ params }) {
  const { lang, id } = params;
  const isArmenian = lang === 'hy';
  
  // Get the current user session
  const session = await getServerSession(authOptions);
  
  // If no session, redirect to login
  if (!session) {
    redirect(`/${lang}/login?callbackUrl=/${lang}/appointments/${id}`);
  }
  
  // Fetch appointment details with error handling
  let appointment;
  try {
    appointment = await prisma.appointment.findUnique({
      where: {
        id: id,
      },
      include: {
        doctor: true,
        patient: true,
        timeSlot: true,
      },
    });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 text-center">
        <p className="text-red-600">Error loading appointment. Please try again.</p>
        <Link href={`/${lang}/appointments`} className="text-blue-600 hover:underline mt-4 inline-block">
          Return to appointments
        </Link>
      </div>
    );
  }
  
  // If no appointment found or not authorized
  if (!appointment || (appointment.patientId !== session.user.id && !session.user.isAdmin)) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 text-center">
        <p className="text-red-600">Appointment not found or you don't have permission to view it.</p>
        <Link href={`/${lang}/appointments`} className="text-blue-600 hover:underline mt-4 inline-block">
          Return to appointments
        </Link>
      </div>
    );
  }
  
  // Dictionary for translations
  const dictionary = {
    appointmentDetail: {
      title: isArmenian ? 'Ժամադրության մանրամասներ' : 'Appointment Details',
      appointmentInfo: isArmenian ? 'Ժամադրության տվյալներ' : 'Appointment Information',
      doctor: isArmenian ? 'Բժիշկ' : 'Doctor',
      date: isArmenian ? 'Ամսաթիվ' : 'Date',
      time: isArmenian ? 'Ժամ' : 'Time',
      status: isArmenian ? 'Կարգավիճակ' : 'Status',
      reason: isArmenian ? 'Պատճառ' : 'Reason',
      notes: isArmenian ? 'Նշումներ' : 'Notes',
      patient: isArmenian ? 'Հիվանդ' : 'Patient',
      back: isArmenian ? 'Վերադառնալ' : 'Back',
      reschedule: isArmenian ? 'Վերահամաձայնեցնել' : 'Reschedule',
      cancel: isArmenian ? 'Չեղարկել' : 'Cancel',
      statuses: {
        SCHEDULED: isArmenian ? 'Պլանավորված' : 'Scheduled',
        CONFIRMED: isArmenian ? 'Հաստատված' : 'Confirmed',
        COMPLETED: isArmenian ? 'Ավարտված' : 'Completed',
        CANCELLED: isArmenian ? 'Չեղարկված' : 'Cancelled',
      },
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link 
          href={`/${lang}/appointments`} 
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          {dictionary.appointmentDetail.back}
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-8">{dictionary.appointmentDetail.title}</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6">{dictionary.appointmentDetail.appointmentInfo}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-gray-600 mb-1">{dictionary.appointmentDetail.doctor}</p>
              <p className="text-lg font-medium">
                <Link href={`/${lang}/doctors/${appointment.doctorId}`} className="text-blue-600 hover:underline">
                  {isArmenian && appointment.doctor.nameHy ? appointment.doctor.nameHy : appointment.doctor.name}
                </Link>
              </p>
              <p className="text-gray-500">
                {isArmenian && appointment.doctor.specialtyHy ? appointment.doctor.specialtyHy : appointment.doctor.specialty}
              </p>
            </div>
            
            <div>
              <p className="text-gray-600 mb-1">{dictionary.appointmentDetail.patient}</p>
              <p className="text-lg font-medium">
                {appointment.patient.firstName} {appointment.patient.lastName}
              </p>
              <p className="text-gray-500">{appointment.patient.email}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-gray-600 mb-1">{dictionary.appointmentDetail.date}</p>
              <p className="text-lg font-medium">
                {new Date(appointment.date).toLocaleDateString(isArmenian ? 'hy-AM' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            
            <div>
              <p className="text-gray-600 mb-1">{dictionary.appointmentDetail.time}</p>
              <p className="text-lg font-medium">{appointment.time}</p>
            </div>
          </div>
          
          <div className="mb-8">
            <p className="text-gray-600 mb-1">{dictionary.appointmentDetail.status}</p>
            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
              appointment.status === 'SCHEDULED' ? 'bg-yellow-100 text-yellow-800' :
              appointment.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
              appointment.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
              'bg-red-100 text-red-800'
            }`}>
              {dictionary.appointmentDetail.statuses[appointment.status]}
            </span>
          </div>
          
          {(appointment.reason || appointment.notes) && (
            <div className="border-t pt-6">
              {appointment.reason && (
                <div className="mb-6">
                  <p className="text-gray-600 mb-1">{dictionary.appointmentDetail.reason}</p>
                  <p className="text-lg">{appointment.reason}</p>
                </div>
              )}
              
              {appointment.notes && (
                <div>
                  <p className="text-gray-600 mb-1">{dictionary.appointmentDetail.notes}</p>
                  <p className="text-lg">{appointment.notes}</p>
                </div>
              )}
            </div>
          )}
          
          {appointment.status === 'SCHEDULED' && (
            <div className="border-t pt-6 flex flex-col sm:flex-row sm:justify-end space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                href={`/${lang}/appointments/${appointment.id}/edit`}
                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 text-center transition-colors"
              >
                {dictionary.appointmentDetail.reschedule}
              </Link>
              <Link 
                href={`/${lang}/appointments/${appointment.id}/cancel`}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 text-center transition-colors"
              >
                {dictionary.appointmentDetail.cancel}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}