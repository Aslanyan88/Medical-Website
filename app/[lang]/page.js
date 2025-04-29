import Link from 'next/link';
import { prisma } from '../lib/prisma';

export default async function HomePage({ params }) {
  const { lang } = params;
  const isArmenian = lang === 'hy';
  
  // Fetch featured doctors (top 3 by experience)
  const featuredDoctors = await prisma.doctor.findMany({
    orderBy: {
      experience: 'desc',
    },
    take: 3,
  });
  
  // Dictionary for translations
  const dictionary = {
    home: {
      hero: {
        title: isArmenian ? 'Բարի գալուստ ՄեդիՔեյր Կլինիկա' : 'Welcome to MediCare Clinic',
        subtitle: isArmenian 
          ? 'Ձեր առողջությունը մեր առաջնահերթությունն է' 
          : 'Your health is our priority',
        cta: isArmenian ? 'Ամրագրել Այցելություն' : 'Book an Appointment',
        learnMore: isArmenian ? 'Իմանալ ավելին' : 'Learn More',
      },
      services: {
        title: isArmenian ? 'Մեր Ծառայությունները' : 'Our Services',
        consultations: {
          title: isArmenian ? 'Մասնագիտական Խորհրդատվություն' : 'Professional Consultations',
          description: isArmenian 
            ? 'Ստացեք որակյալ խորհրդատվություն մեր փորձառու բժիշկներից։' 
            : 'Get quality consultations from our experienced doctors.',
          duration: '30 ' + (isArmenian ? 'րոպե' : 'minutes'),
          icon: '🩺'
        },
        diagnostics: {
          title: isArmenian ? 'Ժամանակակից Ախտորոշում' : 'Modern Diagnostics',
          description: isArmenian 
            ? 'Մեր ժամանակակից սարքավորումները թույլ են տալիս անցկացնել ճշգրիտ ախտորոշումներ։' 
            : 'Our modern equipment allows for accurate diagnostics.',
          duration: '15 ' + (isArmenian ? 'րոպե' : 'minutes'),
          icon: '🔬'
        },
        treatments: {
          title: isArmenian ? 'Արդյունավետ Բուժում' : 'Effective Treatment',
          description: isArmenian 
            ? 'Մենք առաջարկում ենք անհատականացված բուժման պլաններ յուրաքանչյուր հիվանդի համար։' 
            : 'We offer personalized treatment plans for each patient.',
          duration: '45 ' + (isArmenian ? 'րոպե' : 'minutes'),
          icon: '❤️'
        },
        xray: {
          title: isArmenian ? 'Ռենտգեն Հետազոտություն' : 'X-Ray Examination',
          description: isArmenian 
            ? 'Ռենտգեն հետազոտություններ բարձր որակի սարքավորումներով։' 
            : 'X-Ray examinations with high-quality equipment.',
          duration: '20 ' + (isArmenian ? 'րոպե' : 'minutes'),
          icon: '📷'
        }
      },
      features: {
        title: isArmenian ? 'Ինչու Ընտրել Մեզ' : 'Why Choose Us',
        experts: {
          title: isArmenian ? 'Փորձառու Մասնագետներ' : 'Expert Specialists',
          description: isArmenian 
            ? 'Մեր բժիշկները ունեն տարիների փորձ իրենց մասնագիտական ոլորտներում' 
            : 'Our doctors have years of experience in their specialized fields',
          icon: '👨‍⚕️'
        },
        equipment: {
          title: isArmenian ? 'Ժամանակակից Սարքավորումներ' : 'Modern Equipment',
          description: isArmenian 
            ? 'Մենք օգտագործում ենք նորագույն տեխնոլոգիաներ ախտորոշման և բուժման համար' 
            : 'We use the latest technologies for diagnosis and treatment',
          icon: '🔧'
        },
        support: {
          title: isArmenian ? '24/7 Աջակցություն' : '24/7 Support',
          description: isArmenian 
            ? 'Մեր աջակցման թիմը հասանելի է օրը 24 ժամ, շաբաթը 7 օր' 
            : 'Our support team is available 24 hours a day, 7 days a week',
          icon: '⏰'
        }
      },
      doctors: {
        title: isArmenian ? 'Մեր Փորձառու Բժիշկները' : 'Our Expert Doctors',
        viewAll: isArmenian ? 'Դիտել բոլոր բժիշկներին' : 'View All Doctors',
        experience: isArmenian ? 'տարվա փորձ' : 'years experience',
        viewProfile: isArmenian ? 'Դիտել Պրոֆիլը' : 'View Profile'
      },
      testimonials: {
        title: isArmenian ? 'Հիվանդների Կարծիքներ' : 'What Our Patients Say',
        patients: [
          {
            name: isArmenian ? 'Դավիթ Հովհաննիսյան' : 'David Johnson',
            role: isArmenian ? 'Հիվանդ' : 'Patient',
            rating: 5,
            text: isArmenian 
              ? 'ՄեդիՔեյր կլինիկայի շնորհիվ ես ստացա բարձրակարգ բուժօգնություն: Բժիշկները շատ ուշադիր են և մասնագիտական: Շատ շնորհակալ եմ ողջ թիմին:'
              : 'Thanks to MediCare Clinic, I received top-notch medical care. The doctors are very attentive and professional. Many thanks to the entire team!',
            icon: '👨'
          },
          {
            name: isArmenian ? 'Անի Սարգսյան' : 'Anna Mitchell',
            role: isArmenian ? 'Հիվանդ' : 'Patient',
            rating: 5,
            text: isArmenian 
              ? 'Դր․ Սառա Ջոնսոնը հիանալի մասնագետ է: Նա շատ համբերատար է և լսում է բոլոր մտահոգությունները: Կլինիկան մաքուր է և ժամանակակից:'
              : 'Dr. Sarah Johnson is an excellent specialist. She is very patient and listens to all concerns. The clinic is clean and modern.',
            icon: '👩'
          },
          {
            name: isArmenian ? 'Արամ Պետրոսյան' : 'Robert Williams',
            role: isArmenian ? 'Հիվանդ' : 'Patient',
            rating: 4,
            text: isArmenian 
              ? 'Ես հաճախում եմ ՄեդիՔեյր արդեն 5 տարի: Բուժաշխատողները միշտ բարեհամբյուր են, և ես գնահատում եմ նրանց մասնագիտական մոտեցումը:'
              : 'I have been visiting MediCare for 5 years. The staff is always friendly, and I appreciate their professional approach.',
            icon: '👴'
          }
        ]
      },
      cta: {
        title: isArmenian ? 'Պատրա՞ստ եք առաջնահերթություն տալ ձեր առողջությանը' : 'Ready to prioritize your health?',
        subtitle: isArmenian 
          ? 'Հերթագրվեք մեր փորձառու բժիշկների մոտ և կատարեք առաջին քայլը դեպի ավելի լավ առողջություն:'
          : 'Schedule an appointment with our experienced doctors and take the first step towards better health.',
        button: isArmenian ? 'Ամրագրել Այցելություն' : 'Book an Appointment'
      }
    }
  };

  return (
    <div>
      {/* Hero Section */}
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
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{dictionary.home.hero.title}</h1>
              <p className="text-xl text-blue-100 mb-8">{dictionary.home.hero.subtitle}</p>
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <Link 
                  href={`/${lang}/appointments/new`} 
                  className="inline-block bg-white text-blue-700 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
                >
                  {dictionary.home.hero.cta}
                </Link>
                <Link 
                  href={`/${lang}/about`} 
                  className="inline-block border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700/50 transition-colors"
                >
                  {dictionary.home.hero.learnMore}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{dictionary.home.services.title}</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Consultation Service */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 mx-auto">
                <span className="text-2xl">{dictionary.home.services.consultations.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">
                {dictionary.home.services.consultations.title}
              </h3>
              <p className="text-center text-gray-600 mb-2">{dictionary.home.services.consultations.description}</p>
              <p className="text-center text-gray-500">{dictionary.home.services.consultations.duration}</p>
            </div>
            
            {/* Diagnostics Service */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 mx-auto">
                <span className="text-2xl">{dictionary.home.services.diagnostics.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">
                {dictionary.home.services.diagnostics.title}
              </h3>
              <p className="text-center text-gray-600 mb-2">{dictionary.home.services.diagnostics.description}</p>
              <p className="text-center text-gray-500">{dictionary.home.services.diagnostics.duration}</p>
            </div>
            
            {/* X-Ray Service */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 mx-auto">
                <span className="text-2xl">{dictionary.home.services.xray.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">
                {dictionary.home.services.xray.title}
              </h3>
              <p className="text-center text-gray-600 mb-2">{dictionary.home.services.xray.description}</p>
              <p className="text-center text-gray-500">{dictionary.home.services.xray.duration}</p>
            </div>
            
            {/* Treatment Service */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 mx-auto">
                <span className="text-2xl">{dictionary.home.services.treatments.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">
                {dictionary.home.services.treatments.title}
              </h3>
              <p className="text-center text-gray-600 mb-2">{dictionary.home.services.treatments.description}</p>
              <p className="text-center text-gray-500">{dictionary.home.services.treatments.duration}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{dictionary.home.features.title}</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Expert Specialists */}
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 mx-auto">
                <span className="text-4xl">{dictionary.home.features.experts.icon}</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{dictionary.home.features.experts.title}</h3>
              <p className="text-gray-600">{dictionary.home.features.experts.description}</p>
            </div>
            
            {/* Modern Equipment */}
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 mx-auto">
                <span className="text-4xl">{dictionary.home.features.equipment.icon}</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{dictionary.home.features.equipment.title}</h3>
              <p className="text-gray-600">{dictionary.home.features.equipment.description}</p>
            </div>
            
            {/* 24/7 Support */}
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 mx-auto">
                <span className="text-4xl">{dictionary.home.features.support.icon}</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{dictionary.home.features.support.title}</h3>
              <p className="text-gray-600">{dictionary.home.features.support.description}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Doctors Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div className="text-center w-full">
              <h2 className="text-3xl font-bold text-gray-900">{dictionary.home.doctors.title}</h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
  {featuredDoctors.map((doctor) => (
    <div key={doctor.id} className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={doctor.image || '/placeholder-doctor.jpg'} 
          alt={isArmenian && doctor.nameHy ? doctor.nameHy : doctor.name}
          className="w-full h-full object-cover object-top"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {isArmenian && doctor.nameHy ? doctor.nameHy : doctor.name}
        </h3>
        <p className="text-blue-600 mb-4">
          {isArmenian && doctor.specialtyHy ? doctor.specialtyHy : doctor.specialty}
        </p>
        {doctor.experience && (
          <p className="text-gray-700 mb-4">
            <span className="font-medium">{doctor.experience}</span> {dictionary.home.doctors.experience}
          </p>
        )}
        <Link 
          href={`/${lang}/doctors/${doctor.id}`}
          className="block text-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {dictionary.home.doctors.viewProfile}
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
              {dictionary.home.doctors.viewAll}
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/70 to-blue-800/70"></div>
        <img 
          src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2190&q=80" 
          alt="Hospital waiting room" 
          className="object-cover h-full w-full absolute inset-0"
        />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">{dictionary.home.testimonials.title}</h2>
            <div className="w-24 h-1 bg-white mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dictionary.home.testimonials.patients.map((patient, index) => (
              <div key={index} className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
                    <span className="text-xl">{patient.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-bold">{patient.name}</h4>
                    <p className="text-gray-600 text-sm">{patient.role}</p>
                  </div>
                </div>
                <div className="flex mb-2">
                  <span className="text-yellow-500">
                    {'★'.repeat(patient.rating)}
                    {'☆'.repeat(5 - patient.rating)}
                  </span>
                </div>
                <p className="text-gray-700 italic">{patient.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {dictionary.home.cta.title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            {dictionary.home.cta.subtitle}
          </p>
          <Link 
            href={`/${lang}/appointments/new`}
            className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            {dictionary.home.cta.button}
          </Link>
        </div>
      </section>
    </div>
  );
}