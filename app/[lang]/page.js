// app/[lang]/page.js
import { use } from 'react';
import Link from 'next/link';

export default function HomePage({ params }) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang || 'en';
  
  // Dictionary
  const dictionary = {
    home: {
      title: lang === 'hy' ? 'Բարի գալուստ ՄեդիՔեյր Կլինիկա' : 'Welcome to MediCare Clinic',
      subtitle: lang === 'hy' ? 'Ձեր առողջությունը մեր առաջնահերթությունն է' : 'Your health is our priority',
      cta: lang === 'hy' ? 'Գրանցվել Ընդունելության' : 'Book an Appointment',
      servicesTitle: lang === 'hy' ? 'Մեր Ծառայությունները' : 'Our Services',
      doctorsTitle: lang === 'hy' ? 'Մեր Փորձառու Բժիշկները' : 'Our Expert Doctors',
      featuresTitle: lang === 'hy' ? 'Ինչու Ընտրել Մեզ' : 'Why Choose Us',
      testimonialTitle: lang === 'hy' ? 'Հիվանդների Կարծիքներ' : 'What Our Patients Say',
      viewAll: lang === 'hy' ? 'Դիտել Բոլորը' : 'View All',
    }
  };
  
  // Services
  const services = [
    {
      id: 1,
      name: 'General Consultation',
      nameHy: 'Ընդհանուր Խորհրդատվություն',
      duration: 30,
      icon: '🩺'
    },
    {
      id: 2,
      name: 'Complete Blood Test',
      nameHy: 'Ամբողջական Արյան Թեստ',
      duration: 15,
      icon: '🔬'
    },
    {
      id: 3,
      name: 'X-Ray Examination',
      nameHy: 'Ռենտգեն Հետազոտություն',
      duration: 20,
      icon: '📷'
    },
    {
      id: 4,
      name: 'Cardiology Check',
      nameHy: 'Սրտաբանական Ստուգում',
      duration: 45,
      icon: '❤️'
    }
  ];
  
  // Doctors
  const doctors = [
    {
      id: 1,
      name: 'Dr. John Smith',
      nameHy: 'Դր․ Ջոն Սմիթ',
      specialty: 'Cardiology',
      specialtyHy: 'Սրտաբանություն',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      experience: 15
    },
    {
      id: 2,
      name: 'Dr. Sarah Johnson',
      nameHy: 'Դր․ Սառա Ջոնսոն',
      specialty: 'Dermatology',
      specialtyHy: 'Մաշկաբանություն',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
      experience: 8
    }
  ];
  
  // Features
  const features = [
    {
      id: 1,
      title: lang === 'hy' ? 'Փորձառու Մասնագետներ' : 'Expert Specialists',
      description: lang === 'hy' ? 'Մեր բժիշկները ունեն տարիների փորձ իրենց մասնագիտական ոլորտներում' : 'Our doctors have years of experience in their specialized fields',
      icon: '👨‍⚕️'
    },
    {
      id: 2,
      title: lang === 'hy' ? 'Ժամանակակից Սարքավորումներ' : 'Modern Equipment',
      description: lang === 'hy' ? 'Մենք օգտագործում ենք նորագույն տեխնոլոգիաներ ախտորոշման և բուժման համար' : 'We use the latest technologies for diagnosis and treatment',
      icon: '🔧'
    },
    {
      id: 3,
      title: lang === 'hy' ? '24/7 Աջակցություն' : '24/7 Support',
      description: lang === 'hy' ? 'Մեր աջակցման թիմը հասանելի է օրը 24 ժամ, շաբաթը 7 օր' : 'Our support team is available 24 hours a day, 7 days a week',
      icon: '⏰'
    }
  ];
  
  const isArmenian = lang === 'hy';

  return (
    <div>
      {/* Hero Section with large image */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-800/90 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
          alt="Medical facility" 
          className="object-cover h-[500px] w-full"
        />
        <div className="absolute inset-0 flex items-center z-20">
          <div className="container mx-auto px-6">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{dictionary.home.title}</h1>
              <p className="text-xl text-blue-100 mb-8">{dictionary.home.subtitle}</p>
              <Link 
                href={`/${lang}/appointments`}
                className="inline-block bg-white text-blue-700 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
              >
                {dictionary.home.cta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section with icons */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{dictionary.home.servicesTitle}</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 mx-auto">
                  <span className="text-2xl">{service.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">
                  {isArmenian ? service.nameHy : service.name}
                </h3>
                <p className="text-center text-gray-500">
                  {service.duration} {isArmenian ? 'րոպե' : 'minutes'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{dictionary.home.featuresTitle}</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.id} className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 mx-auto">
                  <span className="text-4xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Section with images */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{dictionary.home.doctorsTitle}</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
                <img
                  src={doctor.image}
                  alt={isArmenian ? doctor.nameHy : doctor.name}
                  className="w-full md:w-1/2 h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{isArmenian ? doctor.nameHy : doctor.name}</h3>
                  <p className="text-blue-600 mb-3">{isArmenian ? doctor.specialtyHy : doctor.specialty}</p>
                  <p className="mb-4 text-gray-600">
                    <span className="font-medium">{isArmenian ? 'Փորձի տարիներ' : 'Experience'}:</span> {doctor.experience} {isArmenian ? 'տարի' : 'years'}
                  </p>
                  <Link 
                    href={`/${lang}/doctors/${doctor.id}`}
                    className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                  >
                    {isArmenian ? 'Դիտել Պրոֆիլը' : 'View Profile'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link 
              href={`/${lang}/doctors`}
              className="inline-block border-2 border-blue-600 text-blue-600 font-bold py-2 px-6 rounded-lg hover:bg-blue-50 transition-colors"
            >
              {dictionary.home.viewAll}
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial Section with image */}
{/* Testimonial Section with multiple reviews */}
<section className="py-16 relative">
  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/70 to-blue-800/70"></div>
  <img 
    src="../images/hero.jpg" 
    alt="Hospital waiting room" 
    className="object-cover h-full w-full absolute inset-0"
  />
  <div className="container mx-auto px-6 relative z-10">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-white">{dictionary.home.testimonialTitle}</h2>
      <div className="w-24 h-1 bg-white mx-auto mt-4"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Testimonial 1 */}
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
            <span className="text-xl">👨</span>
          </div>
          <div>
            <h4 className="font-bold">{isArmenian ? 'Դավիթ Հովհաննիսյան' : 'David Johnson'}</h4>
            <p className="text-gray-600 text-sm">{isArmenian ? 'Հիվանդ' : 'Patient'}</p>
          </div>
        </div>
        <div className="flex mb-2">
          <span className="text-yellow-500">★★★★★</span>
        </div>
        <p className="text-gray-700 italic">
          {isArmenian 
            ? 'ՄեդիՔեյր կլինիկայի շնորհիվ ես ստացա բարձրակարգ բուժօգնություն: Բժիշկները շատ ուշադիր են և մասնագիտական: Շատ շնորհակալ եմ ողջ թիմին:'
            : 'Thanks to MediCare Clinic, I received top-notch medical care. The doctors are very attentive and professional. Many thanks to the entire team!'}
        </p>
      </div>
      
      {/* Testimonial 2 */}
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
            <span className="text-xl">👩</span>
          </div>
          <div>
            <h4 className="font-bold">{isArmenian ? 'Անի Սարգսյան' : 'Anna Mitchell'}</h4>
            <p className="text-gray-600 text-sm">{isArmenian ? 'Հիվանդ' : 'Patient'}</p>
          </div>
        </div>
        <div className="flex mb-2">
          <span className="text-yellow-500">★★★★★</span>
        </div>
        <p className="text-gray-700 italic">
          {isArmenian 
            ? 'Դր․ Սառա Ջոնսոնը հիանալի մասնագետ է: Նա շատ համբերատար է և լսում է բոլոր մտահոգությունները: Կլինիկան մաքուր է և ժամանակակից:'
            : 'Dr. Sarah Johnson is an excellent specialist. She is very patient and listens to all concerns. The clinic is clean and modern.'}
        </p>
      </div>
      
      {/* Testimonial 3 */}
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
            <span className="text-xl">👴</span>
          </div>
          <div>
            <h4 className="font-bold">{isArmenian ? 'Արամ Պետրոսյան' : 'Robert Williams'}</h4>
            <p className="text-gray-600 text-sm">{isArmenian ? 'Հիվանդ' : 'Patient'}</p>
          </div>
        </div>
        <div className="flex mb-2">
          <span className="text-yellow-500">★★★★<span className="text-gray-300">★</span></span>
        </div>
        <p className="text-gray-700 italic">
          {isArmenian 
            ? 'Ես հաճախում եմ ՄեդիՔեյր արդեն 5 տարի: Բուժաշխատողները միշտ բարեհամբյուր են, և ես գնահատում եմ նրանց մասնագիտական մոտեցումը:'
            : 'I have been visiting MediCare for 5 years. The staff is always friendly, and I appreciate their professional approach.'}
        </p>
      </div>
    </div>
  </div>
</section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {isArmenian ? 'Պատրա՞ստ եք առաջնահերթություն տալ ձեր առողջությանը' : 'Ready to prioritize your health?'}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            {isArmenian 
              ? 'Հերթագրվեք մեր փորձառու բժիշկների մոտ և կատարեք առաջին քայլը դեպի ավելի լավ առողջություն:'
              : 'Schedule an appointment with our experienced doctors and take the first step towards better health.'}
          </p>
          <Link 
            href={`/${lang}/appointments`}
            className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            {dictionary.home.cta}
          </Link>
        </div>
      </section>
    </div>
  );
}