// app/[lang]/admin/doctors/[id]/edit/page.js
import { prisma } from '../../../../../../lib/prisma';
import DoctorForm from '../../../../../../components/DoctorForm';
import { redirect } from 'next/navigation';

export default async function EditDoctor({ params }) {
  const { lang, id } = params;
  const isArmenian = lang === 'hy';
  
  // Fetch doctor
  const doctor = await prisma.doctor.findUnique({
    where: { id }
  });
  
  if (!doctor) {
    redirect(`/${lang}/admin/doctors`);
  }
  
  // Dictionary for translations
  const dictionary = {
    title: isArmenian ? 'Խմբագրել Բժիշկին' : 'Edit Doctor',
    basicInfo: isArmenian ? 'Հիմնական Տեղեկություններ' : 'Basic Information',
    professionalInfo: isArmenian ? 'Մասնագիտական Տեղեկություններ' : 'Professional Information',
    bioInfo: isArmenian ? 'Կենսագրական Տեղեկություններ' : 'Biographical Information',
    fields: {
      name: isArmenian ? 'Անուն (Անգլերեն)' : 'Name (English)',
      nameHy: isArmenian ? 'Անուն (Հայերեն)' : 'Name (Armenian)',
      email: isArmenian ? 'Էլ. հասցե' : 'Email',
      experience: isArmenian ? 'Փորձի տարիներ' : 'Years of experience',
      image: isArmenian ? 'Նկարի URL' : 'Image URL',
      specialty: isArmenian ? 'Մասնագիտություն (Անգլերեն)' : 'Specialty (English)',
      specialtyHy: isArmenian ? 'Մասնագիտություն (Հայերեն)' : 'Specialty (Armenian)',
      department: isArmenian ? 'Բաժին (Անգլերեն)' : 'Department (English)',
      departmentHy: isArmenian ? 'Բաժին (Հայերեն)' : 'Department (Armenian)',
      bio: isArmenian ? 'Կենսագրություն (Անգլերեն)' : 'Biography (English)',
      bioHy: isArmenian ? 'Կենսագրություն (Հայերեն)' : 'Biography (Armenian)',
    },
    save: isArmenian ? 'Պահպանել' : 'Save',
    saving: isArmenian ? 'Պահպանվում է...' : 'Saving...',
    cancel: isArmenian ? 'Չեղարկել' : 'Cancel',
    successMessage: isArmenian ? 'Բժիշկը հաջողությամբ թարմացվել է։' : 'Doctor has been successfully updated.',
    errorMessage: isArmenian ? 'Սխալ է տեղի ունեցել։ Խնդրում ենք փորձել կրկին։' : 'An error occurred. Please try again.'
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{dictionary.title}</h1>
      <DoctorForm 
        lang={lang}
        doctor={doctor}
        dictionary={dictionary}
      />
    </div>
  );
}