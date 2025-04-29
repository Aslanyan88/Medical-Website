// app/[lang]/admin/appointments/page.js
import Link from 'next/link';
import { prisma } from '../../../../lib/prisma';
import AppointmentManagement from '../../../../components/AppointmentManagement';

export default async function AdminAppointments({ params, searchParams }) {
  const { lang } = params;
  const isArmenian = lang === 'hy';
  
  // Get query parameters
  const page = Number(searchParams.page) || 1;
  const limit = 10;
  const status = searchParams.status || 'all';
  const search = searchParams.search || '';
  
  // Prepare filter conditions
  const statusFilter = status !== 'all' ? { status } : {};
  const searchFilter = search 
    ? {
        OR: [
          { patient: { firstName: { contains: search, mode: 'insensitive' } } },
          { patient: { lastName: { contains: search, mode: 'insensitive' } } },
          { doctor: { name: { contains: search, mode: 'insensitive' } } },
        ]
      } 
    : {};
  
  // Fetch appointments with pagination
  const appointments = await prisma.appointment.findMany({
    where: {
      ...statusFilter,
      ...searchFilter
    },
    include: {
      doctor: true,
      patient: true,
      timeSlot: true
    },
    orderBy: {
      date: 'desc'
    },
    skip: (page - 1) * limit,
    take: limit
  });
  
  // Get total count for pagination
  const totalCount = await prisma.appointment.count({
    where: {
      ...statusFilter,
      ...searchFilter
    }
  });
  
  const totalPages = Math.ceil(totalCount / limit);
  
  // Dictionary for translations
  const dictionary = {
    adminAppointments: {
      title: isArmenian ? 'Կառավարել Ժամադրությունները' : 'Manage Appointments',
      search: isArmenian ? 'Որոնել...' : 'Search...',
      filters: {
        all: isArmenian ? 'Բոլորը' : 'All',
        scheduled: isArmenian ? 'Պլանավորված' : 'Scheduled',
        confirmed: isArmenian ? 'Հաստատված' : 'Confirmed',
        completed: isArmenian ? 'Ավարտված' : 'Completed',
        cancelled: isArmenian ? 'Չեղարկված' : 'Cancelled'
      },
      table: {
        patient: isArmenian ? 'Հիվանդ' : 'Patient',
        doctor: isArmenian ? 'Բժիշկ' : 'Doctor',
        date: isArmenian ? 'Ամսաթիվ' : 'Date',
        time: isArmenian ? 'Ժամ' : 'Time',
        status: isArmenian ? 'Կարգավիճակ' : 'Status',
        actions: isArmenian ? 'Գործողություններ' : 'Actions'
      },
      actions: {
        view: isArmenian ? 'Դիտել' : 'View',
        edit: isArmenian ? 'Խմբագրել' : 'Edit',
        cancel: isArmenian ? 'Չեղարկել' : 'Cancel',
        delete: isArmenian ? 'Ջնջել' : 'Delete'
      },
      pagination: {
        previous: isArmenian ? 'Նախորդ' : 'Previous',
        next: isArmenian ? 'Հաջորդ' : 'Next',
        of: isArmenian ? '-ից' : 'of'
      },
      noAppointments: isArmenian ? 'Ժամադրություններ չեն գտնվել' : 'No appointments found'
    }
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{dictionary.adminAppointments.title}</h1>
      
      <AppointmentManagement 
        appointments={appointments}
        totalPages={totalPages}
        currentPage={page}
        lang={lang}
        dictionary={dictionary.adminAppointments}
        status={status}
        search={search}
      />
    </div>
  );
}