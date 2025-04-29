// app/[lang]/admin/appointments/[appointmentId]/edit/page.js
import { prisma } from '../../../../../../lib/prisma';
import { redirect } from 'next/navigation';
import EditAppointmentForm from '../../../../../../components/admin/EditAppointmentForm';

export default async function AdminEditAppointment({ params }) {
  const { lang, appointmentId } = params;
  const isArmenian = lang === 'hy';
  
  // Fetch the appointment with related data
  const appointment = await prisma.appointment.findUnique({
    where: {
      id: appointmentId
    },
    include: {
      doctor: true,
      patient: true,
      timeSlot: true
    }
  });
  
  if (!appointment) {
    redirect(`/${lang}/admin/appointments`);
  }
  
  // Fetch all doctors for the form
  const doctors = await prisma.doctor.findMany({
    orderBy: {
      name: 'asc'
    }
  });
  
  // Fetch available time slots for the doctor (including the current one)
  const timeSlots = await prisma.timeSlot.findMany({
    where: {
      doctorId: appointment.doctorId,
      OR: [
        { isAvailable: true },
        { id: appointment.timeSlotId || '' }
      ]
    },
    orderBy: [
      { day: 'asc' },
      { startTime: 'asc' }
    ]
  });
  
  // Dictionary for translations
  const dictionary = {
    editAppointment: {
      title: isArmenian ? 'Խմբագրել Ժամադրությունը' : 'Edit Appointment',
      subtitle: isArmenian ? 'Թարմացրեք ժամադրության տվյալները' : 'Update appointment details',
      back: isArmenian ? 'Վերադառնալ' : 'Back',
      doctor: isArmenian ? 'Բժիշկ' : 'Doctor',
      patient: isArmenian ? 'Հիվանդ' : 'Patient',
      date: isArmenian ? 'Ամսաթիվ' : 'Date',
      time: isArmenian ? 'Ժամ' : 'Time',
      status: isArmenian ? 'Կարգավիճակ' : 'Status',
      reason: isArmenian ? 'Պատճառ' : 'Reason',
      notes: isArmenian ? 'Նշումներ' : 'Notes',
      submit: isArmenian ? 'Պահպանել Փոփոխությունները' : 'Save Changes',
      cancel: isArmenian ? 'Չեղարկել' : 'Cancel',
      selectTimeSlot: isArmenian ? 'Ընտրեք ժամային միջակայքը' : 'Select time slot',
      noTimeSlots: isArmenian ? 'Հասանելի ժամային միջակայքեր չկան' : 'No available time slots',
      selectDoctor: isArmenian ? 'Ընտրեք բժիշկին' : 'Select doctor',
      selectDate: isArmenian ? 'Ընտրեք ամսաթիվը' : 'Select date',
      selectStatus: isArmenian ? 'Ընտրեք կարգավիճակը' : 'Select status',
      statuses: {
        SCHEDULED: isArmenian ? 'Պլանավորված' : 'Scheduled',
        CONFIRMED: isArmenian ? 'Հաստատված' : 'Confirmed',
        COMPLETED: isArmenian ? 'Ավարտված' : 'Completed',
        CANCELLED: isArmenian ? 'Չեղարկված' : 'Cancelled',
      },
      successMessage: isArmenian ? 'Ժամադրությունը հաջողությամբ թարմացվել է։' : 'Appointment successfully updated.',
      errorMessage: isArmenian ? 'Սխալ է տեղի ունեցել։ Խնդրում ենք փորձել կրկին։' : 'An error occurred. Please try again.',
    }
  };
  
  return (
    <div>
      <EditAppointmentForm
        lang={lang}
        appointment={appointment}
        doctors={doctors}
        timeSlots={timeSlots}
        dictionary={dictionary.editAppointment}
      />
    </div>
  );
}