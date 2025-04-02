// app/[lang]/doctors/[id]/page.js
import { use } from 'react';
import Link from 'next/link';

export default function DoctorProfile({ params }) {
  const resolvedParams = use(params);
  const { lang, id } = resolvedParams;
  const doctorId = parseInt(id);
  
  const isArmenian = lang === 'hy';
  
  // Complete list of doctors (same as in the doctors page)
  const doctors = [
    {
      id: 1,
      name: 'Dr. John Smith',
      nameHy: 'Դր․ Ջոն Սմիթ',
      specialty: 'Cardiology',
      specialtyHy: 'Սրտաբանություն',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1170&q=80',
      experience: 15,
      education: [
        {
          degree: 'MD',
          degreeHy: 'ԲԳԴ',
          institution: 'Harvard Medical School',
          institutionHy: 'Հարվարդի Բժշկական Դպրոց',
          year: '2005'
        },
        {
          degree: 'Residency in Cardiology',
          degreeHy: 'Ռեզիդենտուրա Սրտաբանության մեջ',
          institution: 'Johns Hopkins Hospital',
          institutionHy: 'Ջոնս Հոփկինսի Հիվանդանոց',
          year: '2009'
        }
      ],
      certifications: [
        {
          name: 'American Board of Cardiology',
          nameHy: 'Ամերիկյան Սրտաբանության Խորհուրդ',
          year: '2010'
        },
        {
          name: 'European Society of Cardiology',
          nameHy: 'Եվրոպական Սրտաբանության Ընկերություն',
          year: '2012'
        }
      ],
      languages: ['English', 'Spanish'],
      languagesHy: ['Անգլերեն', 'Իսպաներեն'],
      bio: "Dr. John Smith is a highly skilled cardiologist with over 15 years of experience in diagnosing and treating cardiovascular diseases. He specializes in interventional cardiology and has performed over 1,000 cardiac catheterizations. Dr. Smith is known for his patient-centered approach and dedication to preventive care.",
      bioHy: "Դր․ Ջոն Սմիթը բարձր որակավորում ունեցող սրտաբան է՝ սրտանոթային հիվանդությունների ախտորոշման և բուժման ավելի քան 15 տարվա փորձով: Նա մասնագիտացած է ինտերվենցիոն սրտաբանության մեջ և կատարել է ավելի քան 1,000 սրտի կաթետերիզացիա: Դր․ Սմիթը հայտնի է իր հիվանդակենտրոն մոտեցմամբ և կանխարգելիչ խնամքի նվիրվածությամբ:",
      availability: [
        { day: 'Monday', hours: '9:00 AM - 5:00 PM' },
        { day: 'Wednesday', hours: '9:00 AM - 5:00 PM' },
        { day: 'Friday', hours: '9:00 AM - 1:00 PM' },
      ],
      availabilityHy: [
        { day: 'Երկուշաբթի', hours: '9:00 - 17:00' },
        { day: 'Չորեքշաբթի', hours: '9:00 - 17:00' },
        { day: 'Ուրբաթ', hours: '9:00 - 13:00' },
      ],
      specializations: [
        {
          name: 'Interventional Cardiology',
          nameHy: 'Ինտերվենցիոն Սրտաբանություն',
          description: 'Specialized in cardiac catheterization and angioplasty',
          descriptionHy: 'Մասնագիտացած է սրտի կաթետերիզացիայի և անգիոպլաստիկայի մեջ'
        },
        {
          name: 'Preventive Cardiology',
          nameHy: 'Կանխարգելիչ Սրտաբանություն',
          description: 'Focus on lifestyle modifications and risk factor management',
          descriptionHy: 'Կենտրոնացած է կենսակերպի փոփոխությունների և ռիսկի գործոնների կառավարման վրա'
        }
      ]
    },
    {
      id: 2,
      name: 'Dr. Sarah Johnson',
      nameHy: 'Դր․ Սառա Ջոնսոն',
      specialty: 'Dermatology',
      specialtyHy: 'Մաշկաբանություն',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=987&q=80',
      experience: 8,
      education: [
        {
          degree: 'MD',
          degreeHy: 'ԲԳԴ',
          institution: 'Stanford Medical School',
          institutionHy: 'Ստենֆորդի Բժշկական Դպրոց',
          year: '2010'
        },
        {
          degree: 'Residency in Dermatology',
          degreeHy: 'Ռեզիդենտուրա Մաշկաբանության մեջ',
          institution: 'UCLA Medical Center',
          institutionHy: 'UCLA Բժշկական Կենտրոն',
          year: '2014'
        }
      ],
      certifications: [
        {
          name: 'American Board of Dermatology',
          nameHy: 'Ամերիկյան Մաշկաբանության Խորհուրդ',
          year: '2015'
        }
      ],
      languages: ['English', 'French'],
      languagesHy: ['Անգլերեն', 'Ֆրանսերեն'],
      bio: "Dr. Sarah Johnson is a board-certified dermatologist specializing in cosmetic and medical dermatology. With a passion for skin health, she offers comprehensive treatments ranging from acne management to advanced skin rejuvenation techniques.",
      bioHy: "Դր․ Սառա Ջոնսոնը հավաստագրված մաշկաբան է՝ մասնագիտացված կոսմետիկ և բժշկական մաշկաբանության մեջ: Մաշկի առողջության նկատմամբ կրքով, նա առաջարկում է համապարփակ բուժում՝ ներառյալ ական կառավարումը և մաշկի վերականգնման առաջադեմ տեխնիկաները:",
      availability: [
        { day: 'Tuesday', hours: '10:00 AM - 6:00 PM' },
        { day: 'Thursday', hours: '9:00 AM - 5:00 PM' },
      ],
      availabilityHy: [
        { day: 'Երեքշաբթի', hours: '10:00 - 18:00' },
        { day: 'Հինգշաբթի', hours: '9:00 - 17:00' },
      ],
      specializations: [
        {
          name: 'Cosmetic Dermatology',
          nameHy: 'Կոսմետիկ Մաշկաբանություն',
          description: 'Advanced skin rejuvenation and aesthetic treatments',
          descriptionHy: 'Մաշկի վերականգնման և էսթետիկ բուժման առաջադեմ մեթոդներ'
        },
        {
          name: 'Medical Dermatology',
          nameHy: 'Բժշկական Մաշկաբանություն',
          description: 'Diagnosis and treatment of skin conditions',
          descriptionHy: 'Մաշկի հիվանդությունների ախտորոշում և բուժում'
        }
      ]
    },
    // ... Add the rest of the doctors from the previous list with similar detailed information
    {
      id: 12,
      name: 'Dr. Elena Müller',
      nameHy: 'Դր․ Էլենա Մյուլեր',
      specialty: 'Pulmonology',
      specialtyHy: 'Թոքաբանություն',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=1170&q=80',
      experience: 11,
      education: [
        {
          degree: 'MD',
          degreeHy: 'ԲԳԴ',
          institution: 'University of Munich Medical School',
          institutionHy: 'Մյունխենի Բժշկական Դպրոց',
          year: '2008'
        },
        {
          degree: 'Pulmonology Specialization',
          degreeHy: 'Մասնագիտացում Թոքաբանության մեջ',
          institution: 'Charité - Universitätsmedizin Berlin',
          institutionHy: 'Շարիտե - Բեռլինի Համալսարանական Բժշկություն',
          year: '2012'
        }
      ],
      certifications: [
        {
          name: 'European Respiratory Society',
          nameHy: 'Եվրոպական Շնչառական Ընկերություն',
          year: '2013'
        }
      ],
      languages: ['English', 'German', 'Italian'],
      languagesHy: ['Անգլերեն', 'Գերմաներեն', 'Իտալերեն'],
      bio: "Dr. Elena Müller is a specialized pulmonologist with extensive experience in respiratory medicine. She focuses on comprehensive lung health, advanced diagnostics, and personalized treatment plans for various respiratory conditions.",
      bioHy: "Դր․ Էլենա Մյուլերը թոքաբանության մեջ մասնագիտացված բժիշկ է՝ շնչառական բժշկության ոլորտում ընդարձակ փորձով: Նա կենտրոնանում է թոքերի առողջության համապարփակ մոտեցման, առաջադեմ ախտորոշման և տարբեր շնչառական հիվանդությունների անձնավորված բուժման պլանների վրա:",
      availability: [
        { day: 'Friday', hours: '10:00 AM - 1:00 PM' },
        { day: 'Monday', hours: '2:00 PM - 5:00 PM' }
      ],
      availabilityHy: [
        { day: 'Ուրբաթ', hours: '10:00 - 13:00' },
        { day: 'Երկուշաբթի', hours: '14:00 - 17:00' }
      ],
      specializations: [
        {
          name: 'Respiratory Medicine',
          nameHy: 'Շնչառական Բժշկություն',
          description: 'Comprehensive lung health and advanced diagnostics',
          descriptionHy: 'Թոքերի առողջության համապարփակ մոտեցում և առաջադեմ ախտորոշում'
        },
        {
          name: 'Pulmonary Rehabilitation',
          nameHy: 'Թոքերի Վերականգնում',
          description: 'Personalized treatment for respiratory conditions',
          descriptionHy: 'Շնչառական հիվանդությունների անձնավորված բուժում'
        }
      ]
    }
  ];
  
  // Find the specific doctor by ID
  const doctor = doctors.find(d => d.id === doctorId);

  // If no doctor is found, you might want to redirect or show an error
  if (!doctor) {
    return <div>Doctor not found</div>;
  }
  
  // Dictionary for translations
  const dictionary = {
    doctorProfile: {
      experience: isArmenian ? 'Փորձի Տարիներ' : 'Years of Experience',
      education: isArmenian ? 'Կրթություն' : 'Education',
      certifications: isArmenian ? 'Հավաստագրեր' : 'Certifications',
      languages: isArmenian ? 'Խոսակցական Լեզուներ' : 'Languages Spoken',
      availability: isArmenian ? 'Հասանելիություն' : 'Availability',
      specializations: isArmenian ? 'Մասնագիտացումներ' : 'Specializations',
      bio: isArmenian ? 'Կենսագրություն' : 'Biography',
      bookAppointment: isArmenian ? 'Գրանցվել Ընդունելության' : 'Book an Appointment',
      back: isArmenian ? 'Վերադառնալ Բժիշկների Էջ' : 'Back to Doctors'
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
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
              src={doctor.image} 
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
                <p className="text-gray-700">
                  <span className="font-semibold">{dictionary.doctorProfile.experience}:</span> {doctor.experience} {isArmenian ? 'տարի' : 'years'}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">{dictionary.doctorProfile.languages}:</span> {isArmenian ? doctor.languagesHy.join(', ') : doctor.languages.join(', ')}
                </p>
              </div>
              <div>
                <Link 
                  href={`/${lang}/appointments?doctor=${doctor.id}`}
                  className="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors w-full text-center"
                >
                  {dictionary.doctorProfile.bookAppointment}
                </Link>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{dictionary.doctorProfile.availability}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {(isArmenian ? doctor.availabilityHy : doctor.availability).map((slot, index) => (
                  <div key={index} className="bg-blue-50 p-2 rounded">
                    <p className="font-semibold">{slot.day}</p>
                    <p className="text-gray-700">{slot.hours}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Doctor Bio */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{dictionary.doctorProfile.bio}</h2>
        <p className="text-gray-700 leading-relaxed">
          {isArmenian ? doctor.bioHy : doctor.bio}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Education and Certifications */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{dictionary.doctorProfile.education}</h2>
          <ul className="space-y-4">
            {doctor.education.map((edu, index) => (
              <li key={index} className="border-b pb-4 last:border-0">
                <p className="font-bold">{isArmenian ? edu.degreeHy : edu.degree}</p>
                <p className="text-gray-700">{isArmenian ? edu.institutionHy : edu.institution}, {edu.year}</p>
              </li>
            ))}
          </ul>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{dictionary.doctorProfile.certifications}</h2>
          <ul className="space-y-4">
            {doctor.certifications.map((cert, index) => (
              <li key={index} className="border-b pb-4 last:border-0">
                <p className="font-bold">{isArmenian ? cert.nameHy : cert.name}</p>
                <p className="text-gray-700">{cert.year}</p>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Specializations */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{dictionary.doctorProfile.specializations}</h2>
          <ul className="space-y-6">
            {doctor.specializations.map((spec, index) => (
              <li key={index} className="border-b pb-6 last:border-0">
                <p className="font-bold text-lg text-blue-600">{isArmenian ? spec.nameHy : spec.name}</p>
                <p className="text-gray-700 mt-2">{isArmenian ? spec.descriptionHy : spec.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );}