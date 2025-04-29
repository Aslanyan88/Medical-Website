// app/[lang]/admin/appointments/new/page.js
import { prisma } from '../../../../../lib/prisma';
import { redirect } from 'next/navigation';
import CreateAppointmentForm from '../../../../../components/admin/CreateAppointmentForm';

export default async function AdminCreateAppointment({ params }) {
  const { lang } = params;
  const isArmenian = lang === 'hy';
  
  // Fetch all doctors
  const doctors = await prisma.doctor.findMany({
    orderBy: {
      name: 'asc'
    }
  });
  
  // Fetch all patients (users)
  const patients = await prisma.user.findMany({
    where: {
      isAdmin: false
    },
    orderBy: {
      firstName: 'asc'
    }
  });
  
  // Dictionary for translations
  const dictionary = {
    createAppointment: {
      title: isArmenian ? 'Ստեղծել Նոր Ժամադրություն' : 'Create New Appointment',
   // app/[lang]/admin/appointments/new/page.js (continued)
   subtitle: isArmenian ? 'Լրացրեք հետևյալ ձևը նոր ժամադրություն ստեղծելու համար' : 'Fill out the form below to create a new appointment',
   back: isArmenian ? 'Վերադառնալ' : 'Back',
   doctor: isArmenian ? 'Բժիշկ' : 'Doctor',
   patient: isArmenian ? 'Հիվանդ' : 'Patient',
   date: isArmenian ? 'Ամսաթիվ' : 'Date',
   time: isArmenian ? 'Ժամ' : 'Time',
   status: isArmenian ? 'Կարգավիճակ' : 'Status',
   reason: isArmenian ? 'Պատճառ' : 'Reason',
   notes: isArmenian ? 'Նշումներ' : 'Notes',
   submit: isArmenian ? 'Ստեղծել Ժամադրություն' : 'Create Appointment',
   cancel: isArmenian ? 'Չեղարկել' : 'Cancel',
   selectDoctor: isArmenian ? 'Ընտրեք բժիշկին' : 'Select doctor',
   selectPatient: isArmenian ? 'Ընտրեք հիվանդին' : 'Select patient',
   selectDate: isArmenian ? 'Ընտրեք ամսաթիվը' : 'Select date',
   selectTimeSlot: isArmenian ? 'Ընտրեք ժամային միջակայքը' : 'Select time slot',
   noTimeSlots: isArmenian ? 'Հասանելի ժամային միջակայքեր չկան' : 'No available time slots',
   selectStatus: isArmenian ? 'Ընտրեք կարգավիճակը' : 'Select status',
   statuses: {
     SCHEDULED: isArmenian ? 'Պլանավորված' : 'Scheduled',
     CONFIRMED: isArmenian ? 'Հաստատված' : 'Confirmed',
     COMPLETED: isArmenian ? 'Ավարտված' : 'Completed',
     CANCELLED: isArmenian ? 'Չեղարկված' : 'Cancelled',
   },
   successMessage: isArmenian ? 'Ժամադրությունը հաջողությամբ ստեղծվել է։' : 'Appointment successfully created.',
   errorMessage: isArmenian ? 'Սխալ է տեղի ունեցել։ Խնդրում ենք փորձել կրկին։' : 'An error occurred. Please try again.',
 }
};

return (
 <div>
   <CreateAppointmentForm
     lang={lang}
     doctors={doctors}
     patients={patients}
     dictionary={dictionary.createAppointment}
   />
 </div>
);
}