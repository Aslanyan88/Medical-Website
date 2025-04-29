import { prisma } from '../../../lib/prisma';
import NewAppointmentForm from '../../../components/NewAppointmentForm';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function NewAppointment({ params, searchParams }) {
  const { lang } = params;
  const { doctor: doctorId } = searchParams || {};
  const isArmenian = lang === 'hy';
  
  // Get the current user session
  const session = await getServerSession(authOptions);
  
  // If no session, redirect to login
  if (!session) {
    redirect(`/${lang}/login?callbackUrl=/${lang}/appointments/new${doctorId ? `?doctor=${doctorId}` : ''}`);
  }
  
  // Fetch all doctors for the selection dropdown
  const doctors = await prisma.doctor.findMany({
    orderBy: {
      name: 'asc',
    },
  });
  
  // If doctorId is provided, fetch available time slots for that doctor
  let timeSlots = [];
  let selectedDoctor = null;
  
  if (doctorId) {
    selectedDoctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });
    
    if (selectedDoctor) {
      // Fetch available time slots for this doctor
      timeSlots = await prisma.timeSlot.findMany({
        where: {
          doctorId: doctorId,
          isAvailable: true,
        },
        orderBy: [
          { day: 'asc' },
          { startTime: 'asc' },
        ],
      });
    }
  }
  
  // Dictionary for translations
  const dictionary = {
    newAppointment: {
      title: isArmenian ? 'Նոր Ժամադրություն' : 'New Appointment',
      selectDoctor: isArmenian ? 'Ընտրեք բժիշկին' : 'Select a Doctor',
      selectDate: isArmenian ? 'Ընտրեք ամսաթիվը' : 'Select a Date',
      selectTime: isArmenian ? 'Ընտրեք ժամը' : 'Select a Time',
      reason: isArmenian ? 'Ժամադրության պատճառը (ոչ պարտադիր)' : 'Reason for appointment (optional)',
      submit: isArmenian ? 'Պահպանել Ժամադրությունը' : 'Book Appointment',
      notes: isArmenian ? 'Լրացուցիչ նշումներ (ոչ պարտադիր)' : 'Additional notes (optional)',
      back: isArmenian ? 'Վերադառնալ' : 'Back',
      noDoctorSelected: isArmenian ? 'Խնդրում ենք ընտրել բժիշկ` հասանելի ժամանակի միջակայքերը տեսնելու համար։' : 'Please select a doctor to see available time slots.',
      noTimeSlots: isArmenian ? 'Այս պահին հասանելի ժամանակի միջակայքեր չկան։' : 'No available time slots at the moment.',
      successMessage: isArmenian ? 'Ձեր ժամադրությունը հաջողությամբ ստեղծվել է։' : 'Your appointment has been successfully created.',
      errorMessage: isArmenian ? 'Սխալ է տեղի ունեցել։ Խնդրում ենք փորձել կրկին։' : 'An error occurred. Please try again.',
      days: {
        monday: isArmenian ? 'Երկուշաբթի' : 'Monday',
        tuesday: isArmenian ? 'Երեքշաբթի' : 'Tuesday',
        wednesday: isArmenian ? 'Չորեքշաբթի' : 'Wednesday',
        thursday: isArmenian ? 'Հինգշաբթի' : 'Thursday',
        friday: isArmenian ? 'Ուրբաթ' : 'Friday',
        saturday: isArmenian ? 'Շաբաթ' : 'Saturday',
        sunday: isArmenian ? 'Կիրակի' : 'Sunday'
      }
    }
  };
  
  // Pass to client-side component
  return (
    <NewAppointmentForm 
      lang={lang}
      isArmenian={isArmenian}
      doctors={doctors}
      selectedDoctorId={selectedDoctor?.id}
      timeSlots={timeSlots}
      dictionary={dictionary.newAppointment}
      userId={session.user.id}
    />
  );
}