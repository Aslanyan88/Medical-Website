// app/[lang]/admin/doctors/page.js
import Link from 'next/link';
import { prisma } from '../../../lib/prisma';

export default async function AdminDoctors({ params }) {
  const { lang } = params;
  const isArmenian = lang === 'hy';
  
  // Fetch doctors list
  const doctors = await prisma.doctor.findMany({
    orderBy: {
      name: 'asc',
    },
  });
  
  // Dictionary for translations
  const dictionary = {
    adminDoctors: {
      title: isArmenian ? 'Կառավարել Բժիշկներին' : 'Manage Doctors',
      addDoctor: isArmenian ? 'Ավելացնել Նոր Բժիշկ' : 'Add New Doctor',
      table: {
        name: isArmenian ? 'Անուն' : 'Name',
        specialty: isArmenian ? 'Մասնագիտություն' : 'Specialty',
        email: isArmenian ? 'Էլ. հասցե' : 'Email',
        actions: isArmenian ? 'Գործողություններ' : 'Actions',
      },
      actions: {
        view: isArmenian ? 'Դիտել' : 'View',
        edit: isArmenian ? 'Խմբագրել' : 'Edit',
        delete: isArmenian ? 'Ջնջել' : 'Delete',
        timeslots: isArmenian ? 'Ժամային Միջակայքեր' : 'Timeslots',
      },
      noDoctors: isArmenian ? 'Բժիշկներ չեն գտնվել' : 'No doctors found',
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{dictionary.adminDoctors.title}</h1>
        <Link 
          href={`/${lang}/admin/doctors/new`}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {dictionary.adminDoctors.addDoctor}
        </Link>
      </div>
      
      {/* Doctors Table */}
      {doctors.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">{dictionary.adminDoctors.table.name}</th>
                <th className="py-3 px-4 text-left">{dictionary.adminDoctors.table.specialty}</th>
                <th className="py-3 px-4 text-left">{dictionary.adminDoctors.table.email}</th>
                <th className="py-3 px-4 text-right">{dictionary.adminDoctors.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {doctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {isArmenian && doctor.nameHy ? doctor.nameHy : doctor.name}
                  </td>
                  <td className="py-3 px-4">
                    {isArmenian && doctor.specialtyHy ? doctor.specialtyHy : doctor.specialty}
                  </td>
                  <td className="py-3 px-4">{doctor.email}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Link 
                        href={`/${lang}/doctors/${doctor.id}`}
                        className="text-blue-600 hover:text-blue-800"
                        target="_blank"
                      >
                        {dictionary.adminDoctors.actions.view}
                      </Link>
                      <Link 
                        href={`/${lang}/admin/doctors/${doctor.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        {dictionary.adminDoctors.actions.edit}
                      </Link>
                      <Link 
                        href={`/${lang}/admin/doctors/${doctor.id}/timeslots`}
                        className="text-green-600 hover:text-green-800"
                      >
                        {dictionary.adminDoctors.actions.timeslots}
                      </Link>
                      <Link 
                        href={`/${lang}/admin/doctors/${doctor.id}/delete`}
                        className="text-red-600 hover:text-red-800"
                      >
                        {dictionary.adminDoctors.actions.delete}
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">{dictionary.adminDoctors.noDoctors}</p>
        </div>
      )}
    </div>
  );
}