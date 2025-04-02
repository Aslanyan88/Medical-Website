export const doctors = [
    {
      id: 1,
      name: 'Dr. John Smith',
      nameHy: 'Դր․ Ջոն Սմիթ',
      specialty: 'Cardiology',
      specialtyHy: 'Սրտաբանություն',
      image: '/images/doctor1.jpg',
      experience: 15,
      languages: ['English', 'Spanish'],
      languagesHy: ['Անգլերեն', 'Իսպաներեն'],
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
    },
    {
      id: 2,
      name: 'Dr. Sarah Johnson',
      nameHy: 'Դր․ Սառա Ջոնսոն',
      specialty: 'Dermatology',
      specialtyHy: 'Մաշկաբանություն',
      image: '/images/doctor2.jpg',
      experience: 8,
      languages: ['English', 'French'],
      languagesHy: ['Անգլերեն', 'Ֆրանսերեն'],
      availability: [
        { day: 'Tuesday', hours: '10:00 AM - 6:00 PM' },
        { day: 'Thursday', hours: '10:00 AM - 6:00 PM' },
      ],
      availabilityHy: [
        { day: 'Երեքշաբթի', hours: '10:00 - 18:00' },
        { day: 'Հինգշաբթի', hours: '10:00 - 18:00' },
      ],
    },
  ];
  
  export const patients = [
    {
      id: 1,
      firstName: 'Alice',
      lastName: 'Brown',
      dateOfBirth: '1985-06-12',
      email: 'alice.brown@example.com',
      phone: '555-123-4567',
      address: '123 Main St, Anytown, USA',
      insurance: 'HealthPlus',
      insuranceId: 'HP12345678',
      medicalHistory: [
        { date: '2023-01-15', diagnosis: 'Common Cold', treatment: 'Prescribed antibiotics' },
        { date: '2022-05-20', diagnosis: 'Annual Checkup', treatment: 'None' },
      ],
    },
    {
      id: 2,
      firstName: 'Robert',
      lastName: 'Williams',
      dateOfBirth: '1978-09-28',
      email: 'robert.williams@example.com',
      phone: '555-987-6543',
      address: '456 Oak Ave, Othertown, USA',
      insurance: 'MediCare Plus',
      insuranceId: 'MCP87654321',
      medicalHistory: [
        { date: '2023-03-10', diagnosis: 'Hypertension', treatment: 'Prescribed medication and lifestyle changes' },
        { date: '2022-11-05', diagnosis: 'Influenza', treatment: 'Prescribed antivirals' },
      ],
    },
  ];
  
  export const appointments = [
    {
      id: 'apt123',
      patientId: 1,
      doctorId: 2,
      date: '2023-07-15',
      time: '10:30 AM',
      reason: 'Annual skin checkup',
      status: 'confirmed',
    },
    {
      id: 'apt456',
      patientId: 2,
      doctorId: 1,
      date: '2023-07-17',
      time: '2:00 PM',
      reason: 'Follow-up appointment for hypertension',
      status: 'confirmed',
    },
  ];
  
  export const insurancePlans = [
    {
      id: 1,
      name: 'Basic Health Plan',
      nameHy: 'Հիմնական Առողջության Ծրագիր',
      coverage: 70,
      monthlyPremium: 150,
      annualDeductible: 1000,
      description: 'Basic coverage for essential medical services',
      descriptionHy: 'Հիմնական ապահովագրություն անհրաժեշտ բժշկական ծառայությունների համար',
    },
    {
      id: 2,
      name: 'Premium Health Plan',
      nameHy: 'Պրեմիում Առողջության Ծրագիր',
      coverage: 90,
      monthlyPremium: 300,
      annualDeductible: 500,
      description: 'Comprehensive coverage with low deductibles',
      descriptionHy: 'Համապարփակ ապահովագրություն ցածր գանձումներով',
    },
  ];
  
  export const services = [
    {
      id: 1,
      name: 'General Consultation',
      nameHy: 'Ընդհանուր Խորհրդատվություն',
      price: 150,
      duration: 30, // minutes
    },
    {
      id: 2,
      name: 'Complete Blood Test',
      nameHy: 'Ամբողջական Արյան Թեստ',
      price: 200,
      duration: 15, // minutes
    },
    {
      id: 3,
      name: 'EKG',
      nameHy: 'ԷՍԳ',
      price: 250,
      duration: 20, // minutes
    },
    {
      id: 4,
      name: 'Dermatological Examination',
      nameHy: 'Մաշկաբանական Զննում',
      price: 180,
      duration: 45, // minutes
    },
  ];