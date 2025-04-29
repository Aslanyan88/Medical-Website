// components/AdminSidebar.js
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar({ lang }) {
  const pathname = usePathname();
  const isArmenian = lang === 'hy';
  
  const navLinks = [
    { 
      href: `/${lang}/admin`, 
      label: isArmenian ? 'Վահանակ' : 'Dashboard',
      icon: '📊'
    },
    { 
      href: `/${lang}/admin/appointments`, 
      label: isArmenian ? 'Ժամադրություններ' : 'Appointments',
      icon: '📅'
    },
    { 
      href: `/${lang}/admin/doctors`, 
      label: isArmenian ? 'Բժիշկներ' : 'Doctors',
      icon: '👨‍⚕️'
    },
    { 
      href: `/${lang}/admin/users`, 
      label: isArmenian ? 'Օգտատերեր' : 'Users',
      icon: '👥'
    },
    { 
      href: `/${lang}/admin/timeslots`, 
      label: isArmenian ? 'Ժամային Միջակայքեր' : 'Timeslots',
      icon: '⏰'
    },
    { 
      href: `/${lang}`, 
      label: isArmenian ? 'Վերադառնալ Կայք' : 'Back to Site',
      icon: '🏠'
    }
  ];
  
  return (
    <div className="w-64 bg-blue-800 text-white min-h-screen">
      <div className="p-4 border-b border-blue-700">
        <h2 className="text-xl font-bold">
          {isArmenian ? 'Ադմինիստրատոր' : 'Admin Panel'}
        </h2>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link 
                href={link.href}
                className={`flex items-center p-3 rounded-lg ${
                  pathname === link.href 
                    ? 'bg-blue-700 text-white' 
                    : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                } transition-colors`}
              >
                <span className="mr-3">{link.icon}</span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}