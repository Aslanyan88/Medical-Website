export default function AboutPage({ params }) {
  const { lang } = params;
  const isArmenian = lang === 'hy';
  
  // Dictionary for translations
  const dictionary = {
    about: {
      title: isArmenian ? 'Մեր Մասին' : 'About Us',
      intro: isArmenian 
        ? 'Մեր բժշկական կենտրոնը հիմնադրվել է 2010 թվականին՝ նպատակ ունենալով տրամադրել բարձրորակ բժշկական ծառայություններ։' 
        : 'Our medical clinic was founded in 2010 with the aim of providing high-quality medical services.',
      mission: {
        title: isArmenian ? 'Մեր Առաքելությունը' : 'Our Mission',
        text: isArmenian 
          ? 'Մեր առաքելությունն է տրամադրել անհատականացված, բարձրորակ բժշկական խնամք՝ հիմնված ժամանակակից մոտեցումների և տեխնոլոգիաների վրա։ Մենք ձգտում ենք լինել ձեր վստահելի գործընկերը առողջության հարցերում՝ առաջնահերթ դնելով հիվանդների բարեկեցությունը։' 
          : 'Our mission is to provide personalized, high-quality medical care based on modern approaches and technologies. We strive to be your trusted partner in health matters, prioritizing patient well-being.',
      },
      vision: {
        title: isArmenian ? 'Մեր Տեսլականը' : 'Our Vision',
        text: isArmenian 
          ? 'Մենք ձգտում ենք դառնալ առաջատար բժշկական կենտրոն, որը հայտնի է իր գերազանց ծառայությունների, նորարար լուծումների և հիվանդակենտրոն մոտեցման համար։' 
          : 'We strive to become a leading medical center known for its excellent services, innovative solutions, and patient-centered approach.',
      },
      values: {
        title: isArmenian ? 'Մեր Արժեքները' : 'Our Values',
        excellence: {
          title: isArmenian ? 'Գերազանցություն' : 'Excellence',
          text: isArmenian 
            ? 'Մենք ձգտում ենք գերազանցության բժշկական խնամքի բոլոր ասպեկտներում։' 
            : 'We strive for excellence in all aspects of medical care.',
        },
        integrity: {
          title: isArmenian ? 'Ազնվություն' : 'Integrity',
          text: isArmenian 
            ? 'Մենք գործում ենք բարձրագույն էթիկայի և ազնվության չափանիշներով։' 
            : 'We operate with the highest standards of ethics and honesty.',
        },
        compassion: {
          title: isArmenian ? 'Կարեկցանք' : 'Compassion',
          text: isArmenian 
            ? 'Մենք տրամադրում ենք հոգատար և կարեկցող խնամք յուրաքանչյուր հիվանդի։' 
            : 'We provide caring and compassionate care to each patient.',
        },
        innovation: {
          title: isArmenian ? 'Նորարարություն' : 'Innovation',
          text: isArmenian 
            ? 'Մենք ձգտում ենք նորարարության և շարունակական բարելավման։' 
            : 'We pursue innovation and continuous improvement.',
        },
      },
      team: {
        title: isArmenian ? 'Մեր Թիմը' : 'Our Team',
        text: isArmenian 
          ? 'Մեր թիմը բաղկացած է որակավորված բժիշկներից, բուժքույրերից և աջակցող անձնակազմից, ովքեր նվիրված են ձեր առողջությանը և բարեկեցությանը։' 
          : 'Our team consists of qualified doctors, nurses, and support staff who are dedicated to your health and well-being.',
      },
      location: {
        title: isArmenian ? 'Մեր Տեղակայումը' : 'Our Location',
        address: isArmenian 
          ? 'Ամիրյան 10, Երևան, Հայաստան' 
          : '10 Amiryan St, Yerevan, Armenia',
        workingHours: isArmenian 
          ? 'Աշխատանքային ժամեր: Երկուշաբթի-ուրբաթ: 9:00-18:00, Շաբաթ: 9:00-14:00' 
          : 'Working hours: Monday-Friday: 9:00-18:00, Saturday: 9:00-14:00',
      },
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center mb-12">{dictionary.about.title}</h1>
      
      <div className="prose prose-lg max-w-4xl mx-auto mb-12">
        <p className="text-xl leading-relaxed">{dictionary.about.intro}</p>
      </div>
      
      {/* Mission and Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">{dictionary.about.mission.title}</h2>
          <p className="text-gray-700">{dictionary.about.mission.text}</p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">{dictionary.about.vision.title}</h2>
          <p className="text-gray-700">{dictionary.about.vision.text}</p>
        </div>
      </div>
      
      {/* Our Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">{dictionary.about.values.title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">{dictionary.about.values.excellence.title}</h3>
            <p className="text-gray-600">{dictionary.about.values.excellence.text}</p>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">{dictionary.about.values.integrity.title}</h3>
            <p className="text-gray-600">{dictionary.about.values.integrity.text}</p>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">{dictionary.about.values.compassion.title}</h3>
            <p className="text-gray-600">{dictionary.about.values.compassion.text}</p>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">{dictionary.about.values.innovation.title}</h3>
            <p className="text-gray-600">{dictionary.about.values.innovation.text}</p>
          </div>
        </div>
      </div>
      

      
      {/* Location */}
      <div className="aspect-video rounded-lg overflow-hidden">
    <video 
      src="/images/medicare.mp4"
      className="w-full h-full object-cover"
      autoPlay
      loop
      muted
      playsInline
    />
  </div>
    </div>
  );
}