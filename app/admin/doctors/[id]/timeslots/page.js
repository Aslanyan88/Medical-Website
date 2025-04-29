// app/[lang]/admin/doctors/[id]/timeslots/page.js
import { prisma } from '../../../../lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import TimeslotManager from '../../../../../../components/TimeslotManager';

export default async function DoctorTimeslots({ params }) {
  const { lang, id } = params;
  const isArmenian = lang === 'hy';
  
  // Fetch doctor with existing timeslots
  const doctor = await prisma.doctor.findUnique({
    where: { id },
    include: {
      timeSlots: {
        orderBy: [
          { day: 'asc' },
          { startTime: 'asc' }
        ]
      }
    }
  });
  
  if (!doctor) {
    redirect(`/${lang}/admin/doctors`);
  }
  
  // Dictionary for translations
  const dictionary = {
    title: isArmenian 
      ? `Ժամային Միջակայքեր - ${doctor.nameHy || doctor.name}` 
      : `Timeslots for ${doctor.name}`,
    subtitle: isArmenian 
      ? 'Կառավարեք բժշկի հասանելի ժամային միջակայքերը' 
      : "Manage doctor's available time slots",
    back: isArmenian ? 'Վերադառնալ Բժիշկների Էջ' : 'Back to Doctors',
    addTimeslot: isArmenian ? 'Ավելացնել Նոր Ժամային Միջակայք' : 'Add New Timeslot',
    noTimeslots: isArmenian ? 'Ժամային միջակայքեր չեն գտնվել' : 'No timeslots found',
    form: {
      day: isArmenian ? 'Օր' : 'Day',
      startTime: isArmenian ? 'Սկսվելու ժամ' : 'Start Time',
      endTime: isArmenian ? 'Ավարտի ժամ' : 'End Time',
      isAvailable: isArmenian ? 'Հասանելի' : 'Available',
      add: isArmenian ? 'Ավելացնել' : 'Add',
      cancel: isArmenian ? 'Չեղարկել' : 'Cancel',
      update: isArmenian ? 'Թարմացնել' : 'Update',
      delete: isArmenian ? 'Ջնջել' : 'Delete',
      edit: isArmenian ? 'Խմբագրել' : 'Edit',
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
    messages: {
      success: isArmenian ? 'Գործողությունը հաջողությամբ կատարվել է։' : 'Action completed successfully.',
      error: isArmenian ? 'Սխալ է տեղի ունեցել։ Խնդրում ենք փորձել կրկին։' : 'An error occurred. Please try again.',
      confirmDelete: isArmenian 
        ? 'Վստա՞հ եք, որ ցանկանում եք ջնջել այս ժամային միջակայքը:' 
        : 'Are you sure you want to delete this timeslot?',
      deleteWarning: isArmenian
        ? 'Այս գործողությունը չի կարող հետարկվել։'
        : 'This action cannot be undone.',
      cannotDeleteBooked: isArmenian
        ? 'Հնարավոր չէ ջնջել ամրագրված ժամային միջակայքը։'
        : 'Cannot delete a booked timeslot.',
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{dictionary.title}</h1>
      <p className="text-gray-600 mb-8">{dictionary.subtitle}</p>
      
      <TimeslotManager 
        doctor={doctor} 
        timeSlots={doctor.timeSlots} 
        lang={lang} 
        dictionary={dictionary} 
      />
    </div>
  );
}