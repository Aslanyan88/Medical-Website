// app/[lang]/admin/doctors/new/page.js
import { prisma } from '../../../lib/prisma';
import DoctorForm from '../../../../../components/DoctorForm';

export default async function NewDoctor({ params }) {
  const { lang } = params;
  const isArmenian = lang === 'hy';
  
  // Dictionary for translations
  const dictionary = {
    title: isArmenian ? 'Ավելացնել Նոր Բժիշկ' : 'Add New Doctor',
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
    successMessage: isArmenian ? 'Բժիշկը հաջողությամբ ավելացվել է։' : 'Doctor has been successfully added.',
    errorMessage: isArmenian ? 'Սխալ է տեղի ունեցել։ Խնդրում ենք փորձել կրկին։' : 'An error occurred. Please try again.'
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{dictionary.title}</h1>
      <DoctorForm 
        lang={lang}
        dictionary={dictionary}
      />
    </div>
  );
}