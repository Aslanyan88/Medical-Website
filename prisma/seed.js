const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting database seeding...');

    // Clean up existing data to prevent conflicts
    await prisma.appointment.deleteMany({});
    await prisma.timeSlot.deleteMany({});
    await prisma.doctor.deleteMany({});
    await prisma.user.deleteMany({});
    
    console.log('Cleaned up existing data');

    // 1. Create admin user
    const adminUser = await prisma.user.create({
      data: {
        id: 'admin_user_id',
        email: 'admin@medicare.com',
        firstName: 'Admin',
        lastName: 'User',
        isAdmin: true,
        updatedAt: new Date(),
        password: await hash('adminpassword', 10)
      }
    });
    
    console.log('Created admin user');

    // 2. Create test users
    const users = await prisma.user.createMany({
      data: [
        {
          id: 'cm8y9phfu0000ew70nwhhuira',
          email: 'aslanyanarman88@gmail.com',
          firstName: 'Arman',
          lastName: 'aslanyan',
          isAdmin: false,
          updatedAt: new Date(),
          password: await hash('password123', 10)
        },
        {
          id: 'cm8yjephk0000ewx0cyqr5s8f',
          email: 'aslanyanarman88s@gmail.com',
          firstName: 'Arman',
          lastName: 'aslanyan',
          isAdmin: false,
          updatedAt: new Date(),
          password: await hash('password123', 10)
        },
        {
          id: 'cm8zmz9zn0000ewjwtkvyij3u',
          email: 'aslanyanarman8899@gmail.com',
          firstName: 'Arman',
          lastName: 'aslanyan',
          isAdmin: false,
          updatedAt: new Date(),
          password: await hash('password123', 10)
        }
      ]
    });
    
    console.log('Created test users');

    // 3. Create doctors
    const doctors = [
      {
        id: 'cm8y6xyz30000ewqoaks3ip9t',
        name: 'Dr. John Smith',
        nameHy: 'Դր․ Ջոն Սմիթ',
        email: 'john.smith@medicare.com',
        specialty: 'Cardiology',
        specialtyHy: 'Սրտաբանություն',
        department: 'Cardiology',
        departmentHy: 'Սրտաբանություն',
        bio: 'Dr. Smith is a cardiologist with over 15 years of experience. He speaks English and Spanish.',
        bioHy: 'Դր․ Սմիթը սրտաբան է՝ ավելի քան 15 տարվա փորձով։ Նա խոսում է անգլերեն և իսպաներեն:',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1170&q=80',
        experience: 15,
        updatedAt: new Date()
      },
      {
        id: 'cm8y6xyzm0003ewqoviee126s',
        name: 'Dr. Sarah Johnson',
        nameHy: 'Դր․ Սառա Ջոնսոն',
        email: 'sarah.johnson@medicare.com',
        specialty: 'Dermatology',
        specialtyHy: 'Մաշկաբանություն',
        department: 'Dermatology',
        departmentHy: 'Մաշկաբանություն',
        bio: 'Dr. Johnson specializes in treating skin conditions and cosmetic procedures. She speaks English and French.',
        bioHy: 'Դր․ Ջոնսոնը մասնագիտացած է մաշկային հիվանդությունների բուժման և կոսմետիկ գործողությունների մեջ: Նա խոսում է անգլերեն և ֆրանսերեն:',
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=987&q=80',
        experience: 8,
        updatedAt: new Date()
      },
      {
        id: 'cm8y6xz000006ewqod6k1m0ip',
        name: 'Dr. Michael Chen',
        nameHy: 'Դր․ Մայքլ Չեն',
        email: 'michael.chen@medicare.com',
        specialty: 'Neurology',
        specialtyHy: 'Նյարդաբանություն',
        department: 'Neurology',
        departmentHy: 'Նյարդաբանություն',
        bio: 'Dr. Chen is a neurologist with experience in treating various neurological disorders. He speaks English, Mandarin, and Japanese.',
        bioHy: 'Դր․ Չենը նյարդաբան է՝ տարբեր նյարդաբանական խանգարումների բուժման փորձով։ Նա խոսում է անգլերեն, չինարեն և ճապոներեն:',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=928&q=80',
        experience: 12,
        updatedAt: new Date()
      },
      {
        id: 'cm8y6xz0a0009ewqom479n8fi',
        name: 'Dr. Emily Rodriguez',
        nameHy: 'Դր․ Էմիլի Ռոդրիգես',
        email: 'emily.rodriguez@medicare.com',
        specialty: 'Pediatrics',
        specialtyHy: 'Մանկաբուժություն',
        department: 'Pediatrics',
        departmentHy: 'Մանկաբուժություն',
        bio: 'Dr. Rodriguez specializes in pediatric care with 10 years of experience. She speaks English and Portuguese.',
        bioHy: 'Դր․ Ռոդրիգեսը մասնագիտացված է մանկական բուժօգնության մեջ 10 տարվա փորձով։ Նա խոսում է անգլերեն և պորտուգալերեն:',
        image: 'https://plus.unsplash.com/premium_photo-1661580574627-9211124e5c3f?auto=format&fit=crop',
        experience: 10,
        updatedAt: new Date()
      },
      {
        id: 'cm8y6xz0l000cewqofkh6o1y1',
        name: 'Dr. Alexander Kim',
        nameHy: 'Դր․ Ալեքսանդր Կիմ',
        email: 'alexander.kim@medicare.com',
        specialty: 'Orthopedics',
        specialtyHy: 'Օրթոպեդիա',
        department: 'Orthopedics',
        departmentHy: 'Օրթոպեդիա',
        bio: 'Dr. Kim is an orthopedic surgeon with 18 years of experience. He speaks English and Korean.',
        bioHy: 'Դր․ Կիմը օրթոպեդ վիրաբույժ է 18 տարվա փորձով։ Նա խոսում է անգլերեն և կորեերեն:',
        image: 'https://plus.unsplash.com/premium_photo-1658506671316-0b293df7c72b?auto=format&fit=crop',
        experience: 18,
        updatedAt: new Date()
      },
      {
        id: 'cm8y6xz12000fewqoz17203h0',
        name: 'Dr. Olivia Thompson',
        nameHy: 'Դր․ Օլիվիա Թոմպսոն',
        email: 'olivia.thompson@medicare.com',
        specialty: 'Gynecology',
        specialtyHy: 'Գինեկոլոգիա',
        department: 'Gynecology',
        departmentHy: 'Գինեկոլոգիա',
        bio: 'Dr. Thompson is a gynecologist with 14 years of experience. She speaks English and German.',
        bioHy: 'Դր․ Թոմփսոնը գինեկոլոգ է 14 տարվա փորձով։ Նա խոսում է անգլերեն և գերմաներեն:',
        image: 'https://plus.unsplash.com/premium_photo-1661766718556-13c2efac1388?auto=format&fit=crop',
        experience: 14,
        updatedAt: new Date()
      },
      {
        id: 'cm8y6xz1d000iewqoykxbudph',
        name: 'Dr. David Nguyen',
        nameHy: 'Դր․ Դավիթ Նգուեն',
        email: 'david.nguyen@medicare.com',
        specialty: 'Oncology',
        specialtyHy: 'Հիվանդությունների բուժում',
        department: 'Oncology',
        departmentHy: 'Հիվանդությունների բուժում',
        bio: 'Dr. Nguyen is an oncologist with 20 years of experience. He speaks English and Vietnamese.',
        bioHy: 'Դր․ Նգուենը հիվանդության մասնագետ է 20 տարվա փորձով։ Նա խոսում է անգլերեն և վիետնամերեն:',
        image: 'https://plus.unsplash.com/premium_photo-1661764878654-3d0fc2eefcca?auto=format&fit=crop',
        experience: 20,
        updatedAt: new Date()
      },
      {
        id: 'cm8y6xz1o000lewqotx6qixqg',
        name: 'Dr. Maria Garcia',
        nameHy: 'Դր․ Մարիա Գարսիա',
        email: 'maria.garcia@medicare.com',
        specialty: 'Psychiatry',
        specialtyHy: 'Հոգեբուժություն',
        department: 'Psychiatry',
        departmentHy: 'Հոգեբուժություն',
        bio: 'Dr. Garcia is a psychiatrist with 12 years of experience. She speaks English, Spanish, and Portuguese.',
        bioHy: 'Դր․ Գարսիան հոգեբույժ է 12 տարվա փորձով։ Նա խոսում է անգլերեն, իսպաներեն և պորտուգալերեն:',
        image: 'https://plus.unsplash.com/premium_photo-1681966531074-0957dc900a5f?auto=format&fit=crop',
        experience: 12,
        updatedAt: new Date()
      },
      {
        id: 'cm8y6xz1y000oewqohvwpeltz',
        name: 'Dr. Robert Zhang',
        nameHy: 'Դր․ Ռոբերտ Ժանգ',
        email: 'robert.zhang@medicare.com',
        specialty: 'Endocrinology',
        specialtyHy: 'Էնդոկրինոլոգիա',
        department: 'Endocrinology',
        departmentHy: 'Էնդոկրինոլոգիա',
        bio: 'Dr. Zhang is an endocrinologist with 16 years of experience. He speaks English and Mandarin.',
        bioHy: 'Դր․ Ժանգը էնդոկրինոլոգ է 16 տարվա փորձով։ Նա խոսում է անգլերեն և չինարեն:',
        image: 'https://plus.unsplash.com/premium_photo-1681996359725-06262b082c27?auto=format&fit=crop',
        experience: 16,
        updatedAt: new Date()
      },
      {
        id: 'cm8y6xz27000rewqowimb7w4x',
        name: 'Dr. Anna Petrova',
        nameHy: 'Դր․ Աննա Պետրովա',
        email: 'anna.petrova@medicare.com',
        specialty: 'Radiology',
        specialtyHy: 'Ռենտգենոլոգիա',
        department: 'Radiology',
        departmentHy: 'Ռենտգենոլոգիա',
        bio: 'Dr. Petrova is a radiologist with 14 years of experience. She speaks English and Russian.',
        bioHy: 'Դր․ Պետրովան ռենտգենոլոգ է 14 տարվա փորձով։ Նա խոսում է անգլերեն և ռուսերեն:',
        image: 'https://plus.unsplash.com/premium_photo-1682089144957-f48bbcf706b2?auto=format&fit=crop',
        experience: 14,
        updatedAt: new Date()
      },
      {
        id: 'cm8y6xz2h000uewqoqd4cu0gn',
        name: 'Dr. Hassan Ali',
        nameHy: 'Դր․ Հասան Ալի',
        email: 'hassan.ali@medicare.com',
        specialty: 'Gastroenterology',
        specialtyHy: 'Գաստրոէնտերոլոգիա',
        department: 'Gastroenterology',
        departmentHy: 'Գաստրոէնտերոլոգիա',
        bio: 'Dr. Ali is a gastroenterologist with 13 years of experience. He speaks English and Arabic.',
        bioHy: 'Դր․ Ալին գաստրոէնտերոլոգ է 13 տարվա փորձով։ Նա խոսում է անգլերեն և արաբերեն:',
        image: 'https://plus.unsplash.com/premium_photo-1661745702156-cd4b0382455f?auto=format&fit=crop',
        experience: 13,
        updatedAt: new Date()
      },
      {
        id: 'cm8y6xz2p000xewqoqofpynmi',
        name: 'Dr. Elena Müller',
        nameHy: 'Դր․ Էլենա Մյուլեր',
        email: 'elena.muller@medicare.com',
        specialty: 'Pulmonology',
        specialtyHy: 'Թոքաբանություն',
        department: 'Pulmonology',
        departmentHy: 'Թոքաբանություն',
        bio: 'Dr. Müller is a pulmonologist with 11 years of experience. She speaks English, German, and Italian.',
        bioHy: 'Դր․ Մյուլերը թոքաբան է 11 տարվա փորձով։ Նա խոսում է անգլերեն, գերմաներեն և իտալերեն:',
        image: 'https://plus.unsplash.com/premium_photo-1661722591980-3c546c7de11a?auto=format&fit=crop',
        experience: 11,
        updatedAt: new Date()
      }
    ];

    for (const doctor of doctors) {
      await prisma.doctor.create({
        data: doctor
      });
    }
    
    console.log('Created 12 doctors');

    // 4. Create time slots
    const timeSlots = [
      // Dr. John Smith (Cardiologist)
      {
        id: 'cm8y6xyz80001ewqoz3mt7gl6',
        day: 'Monday',
        startTime: '09:00',
        endTime: '12:00',
        isAvailable: true,
        doctorId: 'cm8y6xyz30000ewqoaks3ip9t',
        updatedAt: new Date()
      },
      {
        id: 'cm8y6xyze0002ewqoa6iqqidl',
        day: 'Wednesday',
        startTime: '14:00',
        endTime: '17:00',
        isAvailable: true,
        doctorId: 'cm8y6xyz30000ewqoaks3ip9t',
        updatedAt: new Date()
      },
      
      // Dr. Sarah Johnson (Dermatologist)
      {
        id: 'cm8y6xyzr0004ewqo9zwipk3z',
        day: 'Tuesday',
        startTime: '10:00',
        endTime: '13:00',
        isAvailable: true,
        doctorId: 'cm8y6xyzm0003ewqoviee126s',
        updatedAt: new Date()
      },
      {
        id: 'cm8y6xyzw0005ewqo1m474t7y',
        day: 'Thursday',
        startTime: '15:00',
        endTime: '18:00',
        isAvailable: true,
        doctorId: 'cm8y6xyzm0003ewqoviee126s',
        updatedAt: new Date()
      },
      
      // Dr. Michael Chen (Neurologist)
      {
        id: 'cm8y6xz030007ewqo30xzj2hx',
        day: 'Monday',
        startTime: '13:00',
        endTime: '16:00',
        isAvailable: true,
        doctorId: 'cm8y6xz000006ewqod6k1m0ip',
        updatedAt: new Date()
      },
      {
        id: 'cm8y6xz060008ewqoojqxa1w3',
        day: 'Friday',
        startTime: '09:00',
        endTime: '12:00',
        isAvailable: true,
        doctorId: 'cm8y6xz000006ewqod6k1m0ip',
        updatedAt: new Date()
      },
      
      // Dr. Emily Rodriguez (Pediatrician)
      {
        id: 'cm8y6xz0d000aewqo5ze4l3xt',
        day: 'Wednesday',
        startTime: '08:00',
        endTime: '11:00',
        isAvailable: true,
        doctorId: 'cm8y6xz0a0009ewqom479n8fi',
        updatedAt: new Date()
      },
      {
        id: 'cm8y6xz0g000bewqocbn5aqw0',
        day: 'Thursday',
        startTime: '16:00',
        endTime: '19:00',
        isAvailable: true,
        doctorId: 'cm8y6xz0a0009ewqom479n8fi',
        updatedAt: new Date()
      },
      
      // Dr. Alexander Kim (Orthopedics)
      {
        id: 'cm8y6xz0u000dewqodtftp7ps',
        day: 'Tuesday',
        startTime: '14:00',
        endTime: '17:00',
        isAvailable: true,
        doctorId: 'cm8y6xz0l000cewqofkh6o1y1',
        updatedAt: new Date()
      },
      {
        id: 'cm8y6xz0y000eewqot09c73k9',
        day: 'Friday',
        startTime: '10:00',
        endTime: '13:00',
        isAvailable: true,
        doctorId: 'cm8y6xz0l000cewqofkh6o1y1',
        updatedAt: new Date()
      },
      
      // Dr. Olivia Thompson (Gynecology)
      {
        id: 'cm8y6xz16000gewqofzh55lth',
        day: 'Monday',
        startTime: '11:00',
        endTime: '14:00',
        isAvailable: true,
        doctorId: 'cm8y6xz12000fewqoz17203h0',
        updatedAt: new Date()
      },
      {
        id: 'cm8y6xz19000hewqo0hlfvw14',
        day: 'Wednesday',
        startTime: '15:00',
        endTime: '18:00',
        isAvailable: true,
        doctorId: 'cm8y6xz12000fewqoz17203h0',
        updatedAt: new Date()
      },
      
      // Dr. David Nguyen (Oncology)
      {
        id: 'cm8y6xz1h000jewqodmhdbvsw',
        day: 'Thursday',
        startTime: '09:00',
        endTime: '12:00',
        isAvailable: true,
        doctorId: 'cm8y6xz1d000iewqoykxbudph',
        updatedAt: new Date()
      },
      {
        id: 'cm8y6xz1k000kewqohbcldd1x',
        day: 'Tuesday',
        startTime: '13:00',
        endTime: '16:00',
        isAvailable: true,
        doctorId: 'cm8y6xz1d000iewqoykxbudph',
        updatedAt: new Date()
      },
      {
        id: 'cm8zmzqja0002ewjw0jn4tl1o',
        day: 'Thursday',
        startTime: '15:00',
        endTime: '16:00',
        isAvailable: false,  // Already booked
        doctorId: 'cm8y6xz1d000iewqoykxbudph',
        updatedAt: new Date()
      },
      
      // Dr. Maria Garcia (Psychiatry)
      {
        id: 'cm8y6xz1s000mewqo1brlxylc',
        day: 'Friday',
        startTime: '14:00',
        endTime: '17:00',
        isAvailable: true,
        doctorId: 'cm8y6xz1o000lewqotx6qixqg',
        updatedAt: new Date()
      },
      {
        id: 'cm8y6xz1v000newqo0yq9lg3u',
        day: 'Wednesday',
        startTime: '10:00',
        endTime: '13:00',
        isAvailable: true,
        doctorId: 'cm8y6xz1o000lewqotx6qixqg',
        updatedAt: new Date()
      },
      
      // Dr. Robert Zhang (Endocrinology)
      {
        id: 'cm8y6xz21000pewqovj2p5l9x',
        day: 'Tuesday',
        startTime: '11:00',
        endTime: '14:00',
        isAvailable: true,
        doctorId: 'cm8y6xz1y000oewqohvwpeltz',
        updatedAt: new Date()
      },
      {
        id: 'cm8y6xz24000qewqoae0k6clz',
        day: 'Thursday',
        startTime: '15:00',
        endTime: '18:00',
        isAvailable: true,
        doctorId: 'cm8y6xz1y000oewqohvwpeltz',
        updatedAt: new Date()
      },
      
      // Dr. Anna Petrova (Radiology)
      {
        id: 'cm8y6xz2a000sewqouz65i35c',
        day: 'Monday',
        startTime: '10:00',
        endTime: '13:00',
        isAvailable: true,
        doctorId: 'cm8y6xz27000rewqowimb7w4x',
        updatedAt: new Date()
      },
      {
        id: 'cm8y6xz2e000tewqot35t5s2f',
        day: 'Wednesday',
        startTime: '16:00',
        endTime: '19:00',
        isAvailable: true,
        doctorId: 'cm8y6xz27000rewqowimb7w4x',
        updatedAt: new Date()
      },
      {
        id: 'cm8zj7s6h0001ewrw2fqom0u6',
        day: 'Tuesday',
        startTime: '09:00',
        endTime: '10:00',
        isAvailable: true,
        doctorId: 'cm8y6xz27000rewqowimb7w4x',
        updatedAt: new Date()
      },
      
      // Dr. Hassan Ali (Gastroenterology)
      {
        id: 'cm8y6xz2k000vewqoaqpl9bpo',
        day: 'Thursday',
        startTime: '11:00',
        endTime: '14:00',
        isAvailable: true,
        doctorId: 'cm8y6xz2h000uewqoqd4cu0gn',
        updatedAt: new Date()
      },
      {
        id: 'cm8y6xz2n000wewqo18q6xgsj',
        day: 'Tuesday',
        startTime: '15:00',
        endTime: '18:00',
        isAvailable: true,
        doctorId: 'cm8y6xz2h000uewqoqd4cu0gn',
        updatedAt: new Date()
      },
      {
        id: 'cm8zmfux70001ewi4zmcr8j4o',
        day: 'Friday',
        startTime: '10:00',
        endTime: '11:00',
        isAvailable: true,
        doctorId: 'cm8y6xz2h000uewqoqd4cu0gn',
        updatedAt: new Date()
      },
      
      // Dr. Elena Müller (Pulmonology)
      {
        id: 'cm8y6xz2t000yewqoxrki9buc',
        day: 'Friday',
        startTime: '10:00',
        endTime: '13:00',
        isAvailable: true,
        doctorId: 'cm8y6xz2p000xewqoqofpynmi',
        updatedAt: new Date()
      },
      {
        id: 'cm8y6xz2x000zewqoxtdga8nj',
        day: 'Monday',
        startTime: '14:00',
        endTime: '17:00',
        isAvailable: true,
        doctorId: 'cm8y6xz2p000xewqoqofpynmi',
        updatedAt: new Date()
      },
      {
        id: 'cm8zmqs4m0001ewh8dhik6x10',
        day: 'Tuesday',
        startTime: '12:00',
        endTime: '13:00',
        isAvailable: true,
        doctorId: 'cm8y6xz2p000xewqoqofpynmi',
        updatedAt: new Date()
      }
    ];

    for (const timeSlot of timeSlots) {
      await prisma.timeSlot.create({
        data: timeSlot
      });
    }
    
    console.log('Created time slots');

    // 5. Create appointments
    const appointments = [
      {
        id: 'cm8y6xz320010ewqognagyq0z',
        date: new Date('2025-04-24T20:00:00.000Z'),
        time: '09:00',
        reason: 'Annual checkup',
        notes: 'Patient has history of high blood pressure',
        status: 'SCHEDULED',
        patientId: 'admin_user_id',
        doctorId: 'cm8y6xyz30000ewqoaks3ip9t',
        timeSlotId: 'cm8y6xyz80001ewqoz3mt7gl6',
        updatedAt: new Date()
      },
      {
        id: 'cm8zmzqjj0003ewjw3uyg2lmo',
        date: new Date('2025-04-24T00:00:00.000Z'),
        time: '15:00',
        reason: '',
        notes: null,
        status: 'SCHEDULED',
        patientId: 'cm8zmz9zn0000ewjwtkvyij3u',
        doctorId: 'cm8y6xz1d000iewqoykxbudph',
        timeSlotId: 'cm8zmzqja0002ewjw0jn4tl1o',
        updatedAt: new Date()
      }
    ];

    for (const appointment of appointments) {
      await prisma.appointment.create({
        data: appointment
      });
    }
    
    console.log('Created appointments');

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });