import Link from 'next/link';
import { prisma } from '../../lib/prisma';

export default async function DoctorsList({ params }) {
  const { lang } = params;
  const isArmenian = lang === 'hy';
  
  // Fetch all doctors with their department information
  const doctors = await prisma.doctor.findMany({
    orderBy: {
      name: 'asc',
    },
  });
  
  // Translation dictionary
  const dictionary = {
    doctorsList: {
      title: isArmenian ? 'Մեր բժիշկները' : 'Our Doctors',
      viewProfile: isArmenian ? 'Դիտել պրոֆիլը' : 'View Profile',
      yearsExperience: isArmenian ? 'տարվա փորձ' : 'years experience',
      department: isArmenian ? 'Բաժին' : 'Department',
      specialty: isArmenian ? 'Մասնագիտություն' : 'Specialty',
    }
  };

  // Helper function to parse languages if stored as a string
  const parseLanguages = (doctor, isArmenian) => {
    if (!doctor.languages && !doctor.languagesHy) return '';
    
    const languagesStr = isArmenian ? doctor.languagesHy : doctor.languages;
    if (!languagesStr) return '';
    
    try {
      const languages = JSON.parse(languagesStr);
      if (Array.isArray(languages)) {
        return languages.join(', ');
      }
      return languagesStr;
    } catch (e) {
      // If not valid JSON, return as is
      return languagesStr;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-12">{dictionary.doctorsList.title}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {doctors.map((doctor) => (
    <div key={doctor.id} className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-64 overflow-hidden">
        <img 
          src={doctor.image || '/placeholder-doctor.jpg'}
          alt={isArmenian ? doctor.nameHy : doctor.name}
          className="w-full h-full object-cover object-top" // Added object-top to focus on the head
        />
      </div>
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {isArmenian ? doctor.nameHy : doctor.name}
        </h2>
        <p className="text-blue-600 mb-2">
          {isArmenian ? doctor.specialtyHy : doctor.specialty}
        </p>
        <p className="text-gray-600 mb-4">
          {isArmenian ? doctor.departmentHy : doctor.department}
        </p>
        
        {doctor.experience && (
          <p className="text-gray-700 mb-2">
            <span className="font-medium">{doctor.experience}</span> {dictionary.doctorsList.yearsExperience}
          </p>
        )}
        
        <Link 
          href={`/${lang}/doctors/${doctor.id}`}
          className="block text-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors mt-4"
        >
          {dictionary.doctorsList.viewProfile}
        </Link>
      </div>
    </div>
  ))}
</div>
    </div>
  );
}