// app/[lang]/admin/page.js
import Link from 'next/link';
import { prisma } from '../../../lib/prisma';

export default async function AdminDashboard({ params }) {
  const { lang } = params;
  const isArmenian = lang === 'hy';
  
  // Fetch overview data
  const doctorsCount = await prisma.doctor.count();
  const usersCount = await prisma.user.count();
  const appointmentsCount = await prisma.appointment.count();
  const upcomingAppointments = await prisma.appointment.count({
    where: {
      date: {
        gte: new Date()
      },
      status: 'SCHEDULED'
    }
  });
  
  // Dictionary for translations
  const dictionary = {
    dashboard: {
      title: isArmenian ? 'Ադմինիստրատորի Վահանակ' : 'Admin Dashboard',
      overview: isArmenian ? 'Ընդհանուր Ակնարկ' : 'Overview',
      stats: {
        doctors: isArmenian ? 'Բժիշկներ' : 'Doctors',
        users: isArmenian ? 'Օգտատերեր' : 'Users',
        appointments: isArmenian ? 'Ժամադրություններ' : 'Appointments',
        upcoming: isArmenian ? 'Առաջիկա Ժամադրություններ' : 'Upcoming Appointments'
      },
      quickLinks: isArmenian ? 'Արագ Հղումներ' : 'Quick Links',
      links: {
        newDoctor: isArmenian ? 'Ավելացնել Նոր Բժիշկ' : 'Add New Doctor',
        viewAppointments: isArmenian ? 'Դիտել Ժամադրությունները' : 'View Appointments',
        manageTimeslots: isArmenian ? 'Կառավարել Ժամային Միջակայքերը' : 'Manage Timeslots'
      }
    }
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{dictionary.dashboard.title}</h1>
      
      {/* Stats Overview */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">{dictionary.dashboard.overview}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Doctors Count */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">{dictionary.dashboard.stats.doctors}</p>
                <h3 className="text-3xl font-bold">{doctorsCount}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <span className="text-2xl">👨‍⚕️</span>
              </div>
            </div>
          </div>
          
          {/* Users Count */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">{dictionary.dashboard.stats.users}</p>
                <h3 className="text-3xl font-bold">{usersCount}</h3>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>
          
          {/* Appointments Count */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">{dictionary.dashboard.stats.appointments}</p>
                <h3 className="text-3xl font-bold">{appointmentsCount}</h3>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                <span className="text-2xl">📅</span>
              </div>
            </div>
          </div>
          
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">{dictionary.dashboard.stats.upcoming}</p>
                <h3 className="text-3xl font-bold">{upcomingAppointments}</h3>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                <span className="text-2xl">🗓️</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Links */}
      <div>
        <h2 className="text-xl font-semibold mb-4">{dictionary.dashboard.quickLinks}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            href={`/${lang}/admin/doctors/new`} 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 mx-auto">
              <span className="text-2xl">➕</span>
            </div>
            <h3 className="font-bold mb-2">{dictionary.dashboard.links.newDoctor}</h3>
          </Link>
          
          <Link 
            href={`/${lang}/admin/appointments`} 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-4 mx-auto">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="font-bold mb-2">{dictionary.dashboard.links.viewAppointments}</h3>
          </Link>
          
          <Link 
            href={`/${lang}/admin/timeslots`} 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 mx-auto">
              <span className="text-2xl">⏰</span>
            </div>
            <h3 className="font-bold mb-2">{dictionary.dashboard.links.manageTimeslots}</h3>
          </Link>
        </div>
      </div>
    </div>
  );
}