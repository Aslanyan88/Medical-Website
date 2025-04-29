// app/[lang]/admin/layout.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({ children, params }) {
  const { lang } = params;
  const isArmenian = lang === 'hy';
  
  // Check if user is authenticated and is an admin
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user.isAdmin) {
    redirect(`/${lang}/login?callbackUrl=/${lang}/admin`);
  }
  
  const dictionary = {
    adminSidebar: {
      dashboard: isArmenian ? 'Վահանակ' : 'Dashboard',
      doctors: isArmenian ? 'Բժիշկներ' : 'Doctors',
      appointments: isArmenian ? 'Ժամադրություններ' : 'Appointments',
      backToSite: isArmenian ? 'Վերադառնալ Կայք' : 'Back to Site',
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Simple sidebar */}
      <div className="w-64 bg-blue-800 text-white min-h-screen">
        <div className="p-4 border-b border-blue-700">
          <h2 className="text-xl font-bold">
            {isArmenian ? 'Ադմինիստրատոր' : 'Admin Panel'}
          </h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                href={`/${lang}/admin`}
                className="flex items-center p-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span className="mr-3">📊</span>
                {dictionary.adminSidebar.dashboard}
              </Link>
            </li>
            <li>
              <Link 
                href={`/${lang}/admin/doctors`}
                className="flex items-center p-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span className="mr-3">👨‍⚕️</span>
                {dictionary.adminSidebar.doctors}
              </Link>
            </li>
            <li>
              <Link 
                href={`/${lang}/admin/appointments`}
                className="flex items-center p-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span className="mr-3">📅</span>
                {dictionary.adminSidebar.appointments}
              </Link>
            </li>
            <li className="mt-8 pt-4 border-t border-blue-700">
              <Link 
                href={`/${lang}`}
                className="flex items-center p-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span className="mr-3">🏠</span>
                {dictionary.adminSidebar.backToSite}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-6 overflow-auto">
        {children}
      </div>
    </div>
  );
}