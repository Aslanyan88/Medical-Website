const doctors = [
      {
        "id": 1,
        "name": "Dr. John Smith",
        "nameHy": "Դր․ Ջոն Սմիթ",
        "specialty": "Cardiology",
        "specialtyHy": "Սրտաբանություն",
        "image": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1170&q=80",
        "experience": 15,
        "languages": ["English", "Spanish"],
        "languagesHy": ["Անգլերեն", "Իսպաներեն"],
        "availability": [
          { "day": "Monday", "hours": "9:00 AM - 12:00 PM" },
          { "day": "Wednesday", "hours": "2:00 PM - 5:00 PM" }
        ],
        "availabilityHy": [
          { "day": "Երկուշաբթի", "hours": "9:00 - 12:00" },
          { "day": "Չորեքշաբթի", "hours": "14:00 - 17:00" }
        ]
      },
      {
        "id": 2,
        "name": "Dr. Sarah Johnson",
        "nameHy": "Դր․ Սառա Ջոնսոն",
        "specialty": "Dermatology",
        "specialtyHy": "Մաշկաբանություն",
        "image": "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=987&q=80",
        "experience": 8,
        "languages": ["English", "French"],
        "languagesHy": ["Անգլերեն", "Ֆրանսերեն"],
        "availability": [
          { "day": "Tuesday", "hours": "10:00 AM - 1:00 PM" },
          { "day": "Thursday", "hours": "3:00 PM - 6:00 PM" }
        ],
        "availabilityHy": [
          { "day": "Երեքշաբթի", "hours": "10:00 - 13:00" },
          { "day": "Հինգշաբթի", "hours": "15:00 - 18:00" }
        ]
      },
      {
        "id": 3,
        "name": "Dr. Michael Chen",
        "nameHy": "Դր․ Մայքլ Չեն",
        "specialty": "Neurology",
        "specialtyHy": "Նյարդաբանություն",
        "image": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=928&q=80",
        "experience": 12,
        "languages": ["English", "Mandarin", "Japanese"],
        "languagesHy": ["Անգլերեն", "Չինարեն", "Ճապոներեն"],
        "availability": [
          { "day": "Monday", "hours": "1:00 PM - 4:00 PM" },
          { "day": "Friday", "hours": "9:00 AM - 12:00 PM" }
        ],
        "availabilityHy": [
          { "day": "Երկուշաբթի", "hours": "13:00 - 16:00" },
          { "day": "Ուրբաթ", "hours": "9:00 - 12:00" }
        ]
      },
      {
        "id": 4,
        "name": "Dr. Emily Rodriguez",
        "nameHy": "Դր․ Էմիլի Ռոդրիգես",
        "specialty": "Pediatrics",
        "specialtyHy": "Մանկաբուժություն",
        "image": "https://plus.unsplash.com/premium_photo-1661580574627-9211124e5c3f?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "experience": 10,
        "languages": ["English", "Portuguese"],
        "languagesHy": ["Անգլերեն", "Պորտուգալերեն"],
        "availability": [
          { "day": "Wednesday", "hours": "8:00 AM - 11:00 AM" },
          { "day": "Thursday", "hours": "4:00 PM - 7:00 PM" }
        ],
        "availabilityHy": [
          { "day": "Չորեքշաբթի", "hours": "8:00 - 11:00" },
          { "day": "Հինգշաբթի", "hours": "16:00 - 19:00" }
        ]
      },
      {
        "id": 5,
        "name": "Dr. Alexander Kim",
        "nameHy": "Դր․ Ալեքսանդր Կիմ",
        "specialty": "Orthopedics",
        "specialtyHy": "Օրթոպեդիա",
        "image": "https://plus.unsplash.com/premium_photo-1658506671316-0b293df7c72b?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "experience": 18,
        "languages": ["English", "Korean"],
        "languagesHy": ["Անգլերեն", "Կորեերեն"],
        "availability": [
          { "day": "Tuesday", "hours": "2:00 PM - 5:00 PM" },
          { "day": "Friday", "hours": "10:00 AM - 1:00 PM" }
        ],
        "availabilityHy": [
          { "day": "Երեքշաբթի", "hours": "14:00 - 17:00" },
          { "day": "Ուրբաթ", "hours": "10:00 - 13:00" }
        ]
      },
      {
        "id": 6,
        "name": "Dr. Olivia Thompson",
        "nameHy": "Դր․ Օլիվիա Թոմպսոն",
        "specialty": "Gynecology",
        "specialtyHy": "Գինեկոլոգիա",
        "image": "https://plus.unsplash.com/premium_photo-1661766718556-13c2efac1388?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "experience": 14,
        "languages": ["English", "German"],
        "languagesHy": ["Անգլերեն", "Գերմաներեն"],
        "availability": [
          { "day": "Monday", "hours": "11:00 AM - 2:00 PM" },
          { "day": "Wednesday", "hours": "3:00 PM - 6:00 PM" }
        ],
        "availabilityHy": [
          { "day": "Երկուշաբթի", "hours": "11:00 - 14:00" },
          { "day": "Չորեքշաբթի", "hours": "15:00 - 18:00" }
        ]
      },
      {
        "id": 7,
        "name": "Dr. David Nguyen",
        "nameHy": "Դր․ Դավիթ Նգուեն",
        "specialty": "Oncology",
        "specialtyHy": "Հիվանդությունների բուժում",
        "image": "https://plus.unsplash.com/premium_photo-1661764878654-3d0fc2eefcca?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "experience": 20,
        "languages": ["English", "Vietnamese"],
        "languagesHy": ["Անգլերեն", "Վիետնամերեն"],
        "availability": [
          { "day": "Thursday", "hours": "9:00 AM - 12:00 PM" },
          { "day": "Tuesday", "hours": "1:00 PM - 4:00 PM" }
        ],
        "availabilityHy": [
          { "day": "Հինգշաբթի", "hours": "9:00 - 12:00" },
          { "day": "Երեքշաբթի", "hours": "13:00 - 16:00" }
        ]
      },
      {
        "id": 8,
        "name": "Dr. Maria Garcia",
        "nameHy": "Դր․ Մարիա Գարսիա",
        "specialty": "Psychiatry",
        "specialtyHy": "Հոգեբուժություն",
        "image": "https://plus.unsplash.com/premium_photo-1681966531074-0957dc900a5f?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "experience": 12,
        "languages": ["English", "Spanish", "Portuguese"],
        "languagesHy": ["Անգլերեն", "Իսպաներեն", "Պորտուգալերեն"],
        "availability": [
          { "day": "Friday", "hours": "2:00 PM - 5:00 PM" },
          { "day": "Wednesday", "hours": "10:00 AM - 1:00 PM" }
        ],
        "availabilityHy": [
          { "day": "Ուրբաթ", "hours": "14:00 - 17:00" },
          { "day": "Չորեքշաբթի", "hours": "10:00 - 13:00" }
        ]
      },
      {
        "id": 9,
        "name": "Dr. Robert Zhang",
        "nameHy": "Դր․ Ռոբերտ Ժանգ",
        "specialty": "Endocrinology",
        "specialtyHy": "Էնդոկրինոլոգիա",
        "image": "https://plus.unsplash.com/premium_photo-1681996359725-06262b082c27?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "experience": 16,
        "languages": ["English", "Mandarin"],
        "languagesHy": ["Անգլերեն", "Չինարեն"],
        "availability": [
          { "day": "Tuesday", "hours": "11:00 AM - 2:00 PM" },
          { "day": "Thursday", "hours": "3:00 PM - 6:00 PM" }
        ],
        "availabilityHy": [
          { "day": "Երեքշաբթի", "hours": "11:00 - 14:00" },
          { "day": "Հինգշաբթի", "hours": "15:00 - 18:00" }
        ]
      },
      {
        "id": 10,
        "name": "Dr. Anna Petrova",
        "nameHy": "Դր․ Աննա Պետրովա",
        "specialty": "Radiology",
        "specialtyHy": "Ռենտգենոլոգիա",
        "image": "https://plus.unsplash.com/premium_photo-1682089144957-f48bbcf706b2?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "experience": 14,
        "languages": ["English", "Russian"],
        "languagesHy": ["Անգլերեն", "Ռուսերեն"],
        "availability": [
          { "day": "Monday", "hours": "10:00 AM - 1:00 PM" },
          { "day": "Wednesday", "hours": "4:00 PM - 7:00 PM" }
        ],
        "availabilityHy": [
          { "day": "Երկուշաբթի", "hours": "10:00 - 13:00" },
          { "day": "Չորեքշաբթի", "hours": "16:00 - 19:00" }
        ]
      },
      {
        "id": 11,
        "name": "Dr. Hassan Ali",
        "nameHy": "Դր․ Հասան Ալի",
        "specialty": "Gastroenterology",
        "specialtyHy": "Գաստրոէնտերոլոգիա",
        "image": "https://plus.unsplash.com/premium_photo-1661745702156-cd4b0382455f?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "experience": 13,
        "languages": ["English", "Arabic"],
        "languagesHy": ["Անգլերեն", "Արաբերեն"],
        "availability": [
          { "day": "Thursday", "hours": "11:00 AM - 2:00 PM" },
          { "day": "Tuesday", "hours": "3:00 PM - 6:00 PM" }
        ],
        "availabilityHy": [
          { "day": "Հինգշաբթի", "hours": "11:00 - 14:00" },
          { "day": "Երեքշաբթի", "hours": "15:00 - 18:00" }
        ]
      },
      {
        "id": 12,
        "name": "Dr. Elena Müller",
        "nameHy": "Դր․ Էլենա Մյուլեր",
        "specialty": "Pulmonology",
        "specialtyHy": "Թոքաբանություն",
        "image": "https://plus.unsplash.com/premium_photo-1661722591980-3c546c7de11a?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "experience": 11,
        "languages": ["English", "German", "Italian"],
        "languagesHy": ["Անգլերեն", "Գերմաներեն", "Իտալերեն"],
        "availability": [
          { "day": "Friday", "hours": "10:00 AM - 1:00 PM" },
          { "day": "Monday", "hours": "2:00 PM - 5:00 PM" }
        ],
        "availabilityHy": [
          { "day": "Ուրբաթ", "hours": "10:00 - 13:00" },
          { "day": "Երկուշաբթի", "hours": "14:00 - 17:00" }
        ]
      }
    ]
    export { doctors };

    // Optional helper functions
    export const getDoctorById = (id) => 
      doctors.find(doctor => doctor.id === id);
    
    export const getDoctorsBySpecialty = (specialty) => 
      doctors.filter(doctor => 
        doctor.specialty.toLowerCase() === specialty.toLowerCase()
      );
    
    export default doctors;