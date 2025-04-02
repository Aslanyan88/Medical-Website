import { doctors as doctorsData } from '../../lib/doctors';
import DoctorCard from '../../components/DoctorCard'
export default async function DoctorsPage({ params }) {
  // Await params before destructuring
  const { lang = 'en' } = await params;
  const isArmenian = lang === 'hy';

  const dictionary = {
    doctors: {
      title: isArmenian ? 'Մեր Բժիշկները' : 'Our Doctors',
      subtitle: isArmenian
        ? 'Փորձառու Մասնագետների Թիմ'
        : 'Team of Experienced Specialists',
      experience: isArmenian ? 'Փորձի Տարիներ' : 'Years of Experience',
      languages: isArmenian ? 'Խոսակցական Լեզուներ' : 'Languages Spoken',
      availability: isArmenian ? 'Հասանելիություն' : 'Availability',
      viewProfile: isArmenian ? 'Դիտել Պրոֆիլը' : 'View Profile',
      bookAppointment: isArmenian
        ? 'Գրանցվել Ընդունելության'
        : 'Book Appointment'
    }
  };

  // Add a check to ensure doctorsData exists and is an array
  if (!doctorsData || !Array.isArray(doctorsData)) {
    console.error('Doctors data is not properly loaded');
    return <div>Error loading doctors</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {dictionary.doctors.title}
        </h1>
        <p className="text-xl text-gray-600">
          {dictionary.doctors.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {doctorsData.map((doctor) => (
          <DoctorCard 
            key={doctor.id} 
            doctor={doctor} 
            dictionary={dictionary} 
            lang={lang} 
          />
        ))}
      </div>
    </div>
  );
}