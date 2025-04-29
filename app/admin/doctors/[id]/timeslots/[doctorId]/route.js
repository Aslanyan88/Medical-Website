// app/[lang]/admin/doctors/[doctorId]/timeslots/page.js
import { prisma } from '../../../../../lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import TimeslotManager from '../../../../../../components/TimeslotManager';

export default async function DoctorTimeslots({ params }) {
  const { lang, doctorId } = params;  // Changed from id to doctorId
  const isArmenian = lang === 'hy';
  
  // Fetch doctor with existing timeslots
  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId },  // Changed from id to doctorId
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
  
  // Rest of the code remains the same
  const dictionary = {
    // ... dictionary contents
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