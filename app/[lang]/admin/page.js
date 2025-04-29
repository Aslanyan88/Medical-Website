// app/[lang]/admin/page.js
import Link from 'next/link';
import { prisma } from '../../lib/prisma';

export default async function AdminDashboard({ params }) {
  const { lang } = params;
  const isArmenian = lang === 'hy';
  
  // Fetch basic stats
  const doctorsCount = await prisma.doctor.count();
  const appointmentsCount = await prisma.appointment.count();
  
  // Dictionary for translations
  const dictionary = {
    dashboard: {
      title: isArmenian ? 'Ադմինիստրատորի Վահանակ' : 'Admin Dashboard',
      overview: isArmenian ? 'Ընդհանուր Ակնարկ' : 'Overview',
      stats: {
        doctors: isArmenian ? 'Բժիշկներ' : 'Doctors',
        appointments: isArmenian ? 'Ժամադրություններ' : 'Appointments',
      },
      quickLinks: isArmenian ? 'Արագ Հղումներ' : 'Quick Links',
      links: {
        manageDoctors: isArmenian ? 'Կառավարել Բժիշկներին' : 'Manage Doctors',
        manageAppointments: isArmenian ? 'Կառավարել Ժամադրությունները' : 'Manage Appointments',
      }
    }
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{dictionary.dashboard.title}</h1>
      
      {/* Stats Overview */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">{dictionary.dashboard.overview}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>
      </div>
      
      {/* Quick Links */}
      <div>
        <h2 className="text-xl font-semibold mb-4">{dictionary.dashboard.quickLinks}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link 
            href={`/${lang}/admin/doctors`} 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
                <span className="text-2xl">👨‍⚕️</span>
              </div>
              <h3 className="text-lg font-bold">{dictionary.dashboard.links.manageDoctors}</h3>
            </div>
          </Link>
          
          <Link 
            href={`/${lang}/admin/appointments`} 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-4">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-lg font-bold">{dictionary.dashboard.links.manageAppointments}</h3>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}