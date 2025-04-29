import Link from 'next/link';
import { prisma } from '../../../lib/prisma';

export default async function DoctorProfile({ params }) {
  const { lang, id } = params;
  const isArmenian = lang === 'hy';
  
  // Fetch doctor from database with timeslots
  const doctor = await prisma.doctor.findUnique({
    where: {
      id: id,
    },
    include: {
      timeSlots: {
        where: {
          isAvailable: true
        }
      }
    },
  });

  // If no doctor is found, show error
  if (!doctor) {
    return <div>Doctor not found</div>;
  }
  
  // Parse languages if stored as a string
  const parseLanguages = (doctor, isArmenian) => {
    if (!doctor.languages && !doctor.languagesHy) return [];
    
    const languagesStr = isArmenian ? doctor.languagesHy : doctor.languages;
    if (!languagesStr) return [];
    
    try {
      const languages = JSON.parse(languagesStr);
      if (Array.isArray(languages)) {
        return languages;
      }
      // If it's not an array but valid JSON, wrap it
      return [languagesStr];
    } catch (e) {
      // If not valid JSON, split by comma as fallback
      return languagesStr.split(',').map(lang => lang.trim());
    }
  };
  
  const languages = parseLanguages(doctor, isArmenian);
  
  // Dictionary for translations
  const dictionary = {
    doctorProfile: {
      experience: isArmenian ? 'Փորձի Տարիներ' : 'Years of Experience',
      department: isArmenian ? 'Բաժին' : 'Department',
      languages: isArmenian ? 'Խոսակցական Լեզուներ' : 'Languages Spoken',
      availability: isArmenian ? 'Հասանելիություն' : 'Availability',
      bio: isArmenian ? 'Կենսագրություն' : 'Biography',
      bookAppointment: isArmenian ? 'Գրանցվել Ընդունելության' : 'Book an Appointment',
      back: isArmenian ? 'Վերադառնալ Բժիշկների Էջ' : 'Back to Doctors',
      contactInfo: isArmenian ? 'Կապի Տվյալներ' : 'Contact Information',
      email: isArmenian ? 'Էլ. հասցե' : 'Email',
      noTimeSlots: isArmenian ? 'Այս պահին հասանելի ժամանակի միջակայքեր չկան։' : 'No available time slots at the moment.',
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
  
  // Helper function to translate day names
  const translateDay = (day) => {
    const lowerDay = day.toLowerCase();
    const dayKey = Object.keys(dictionary.doctorProfile.days).find(
      key => key.toLowerCase() === lowerDay
    );
    
    return dayKey ? dictionary.doctorProfile.days[dayKey] : day;
  };
  
  // Group timeslots by day
  const groupedTimeSlots = doctor.timeSlots.reduce((acc, slot) => {
    const day = slot.day;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(slot);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Back button */}
      <div className="mb-6">
        <Link 
          href={`/${lang}/doctors`} 
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          {dictionary.doctorProfile.back}
        </Link>
      </div>
      
      {/* Doctor Profile Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img 
              src={doctor.image || '/placeholder-doctor.jpg'} 
              alt={isArmenian ? doctor.nameHy : doctor.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 md:w-2/3">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isArmenian ? doctor.nameHy : doctor.name}
            </h1>
            <p className="text-xl text-blue-600 mb-4">
              {isArmenian ? doctor.specialtyHy : doctor.specialty}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                {doctor.experience && (
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">{dictionary.doctorProfile.experience}:</span> {doctor.experience} {isArmenian ? 'տարի' : 'years'}
                  </p>
                )}
                
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">{dictionary.doctorProfile.department}:</span> {isArmenian ? doctor.departmentHy : doctor.department}
                </p>
                
                {languages.length > 0 && (
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">{dictionary.doctorProfile.languages}:</span> {languages.join(', ')}
                  </p>
                )}
                
                <p className="text-gray-700">
                  <span className="font-semibold">{dictionary.doctorProfile.email}:</span> {doctor.email}
                </p>
              </div>
              <div>
                <Link 
                  href={`/${lang}/appointments/new?doctor=${doctor.id}`}
                  className="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors w-full text-center"
                >
                  {dictionary.doctorProfile.bookAppointment}
                </Link>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{dictionary.doctorProfile.availability}</h2>
              
              {Object.keys(groupedTimeSlots).length === 0 ? (
                <p className="text-gray-500 italic">{dictionary.doctorProfile.noTimeSlots}</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {Object.entries(groupedTimeSlots).map(([day, slots]) => (
                    <div key={day} className="bg-blue-50 p-2 rounded">
                      <p className="font-semibold">{isArmenian ? translateDay(day) : day}</p>
                      <div>
                        {slots.map((slot, idx) => (
                          <p key={idx} className="text-gray-700">{slot.startTime} - {slot.endTime}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Doctor Bio */}
      {(doctor.bio || doctor.bioHy) && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{dictionary.doctorProfile.bio}</h2>
          <p className="text-gray-700 leading-relaxed">
            {isArmenian && doctor.bioHy ? doctor.bioHy : doctor.bio}
          </p>
        </div>
      )}
    </div>
  );
}