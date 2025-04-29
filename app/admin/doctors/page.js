// app/[lang]/admin/doctors/page.js
import Link from 'next/link';
import { prisma } from '../../lib/prisma';

export default async function AdminDoctors({ params, searchParams }) {
  const { lang } = params;
  const isArmenian = lang === 'hy';
  
  // Search and filters
  const search = searchParams.search || '';
  const specialty = searchParams.specialty || '';
  const page = Number(searchParams.page) || 1;
  const limit = 10;
  
  // Build search filter
  const searchFilter = search 
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { nameHy: { contains: search, mode: 'insensitive' } },
          { specialty: { contains: search, mode: 'insensitive' } },
          { specialtyHy: { contains: search, mode: 'insensitive' } },
        ]
      } 
    : {};
  
  // Build specialty filter
  const specialtyFilter = specialty 
    ? { specialty: { contains: specialty, mode: 'insensitive' } } 
    : {};
  
  // Fetch doctors with pagination
  const doctors = await prisma.doctor.findMany({
    where: {
      ...searchFilter,
      ...specialtyFilter
    },
    orderBy: {
      name: 'asc'
    },
    skip: (page - 1) * limit,
    take: limit
  });
  
  // Get total count for pagination
  const totalCount = await prisma.doctor.count({
    where: {
      ...searchFilter,
      ...specialtyFilter
    }
  });
  
  const totalPages = Math.ceil(totalCount / limit);
  
  // Get all unique specialties for the filter
  const specialties = await prisma.doctor.findMany({
    select: {
      specialty: true
    },
    distinct: ['specialty']
  });
  
  // Dictionary for translations
  const dictionary = {
    adminDoctors: {
      title: isArmenian ? 'Կառավարել Բժիշկներին' : 'Manage Doctors',
      addDoctor: isArmenian ? 'Ավելացնել Նոր Բժիշկ' : 'Add New Doctor',
      search: isArmenian ? 'Որոնել...' : 'Search...',
      specialty: isArmenian ? 'Մասնագիտություն' : 'Specialty',
      allSpecialties: isArmenian ? 'Բոլոր Մասնագիտությունները' : 'All Specialties',
      table: {
        name: isArmenian ? 'Անուն' : 'Name',
        specialty: isArmenian ? 'Մասնագիտություն' : 'Specialty',
        email: isArmenian ? 'Էլ. հասցե' : 'Email',
        experience: isArmenian ? 'Փորձ' : 'Experience',
        actions: isArmenian ? 'Գործողություններ' : 'Actions'
      },
      actions: {
        view: isArmenian ? 'Դիտել' : 'View',
        edit: isArmenian ? 'Խմբագրել' : 'Edit',
        timeslots: isArmenian ? 'Ժամային Միջակայքեր' : 'Timeslots',
        delete: isArmenian ? 'Ջնջել' : 'Delete'
      },
      pagination: {
        previous: isArmenian ? 'Նախորդ' : 'Previous',
        next: isArmenian ? 'Հաջորդ' : 'Next',
        of: isArmenian ? '-ից' : 'of'
      },
      noDoctors: isArmenian ? 'Բժիշկներ չեն գտնվել' : 'No doctors found'
    }
  };
  
  // app/[lang]/admin/doctors/page.js (continued)
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
      
      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <form 
          action={`/${lang}/admin/doctors`} 
          method="GET" 
          className="flex items-center"
        >
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder={dictionary.adminDoctors.search}
            className="border border-gray-300 rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          {/* Hidden inputs to preserve other query params */}
          <input type="hidden" name="specialty" value={specialty} />
          <input type="hidden" name="page" value="1" />
        </form>
        
        <div>
          <select
            name="specialty"
            defaultValue={specialty}
            onChange={(e) => {
              const url = new URL(window.location.href);
              url.searchParams.set('specialty', e.target.value);
              url.searchParams.set('page', '1');
              window.location.href = url.toString();
            }}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{dictionary.adminDoctors.allSpecialties}</option>
            {specialties.map(({ specialty }) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>
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
                <th className="py-3 px-4 text-left">{dictionary.adminDoctors.table.experience}</th>
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
                  <td className="py-3 px-4">
                    {doctor.email}
                  </td>
                  <td className="py-3 px-4">
                    {doctor.experience} {isArmenian ? 'տարի' : 'years'}
                  </td>
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
      
      {/* Pagination */}
      {totalPages > 0 && (
        <div className="mt-6 flex justify-between items-center">
          <div>
            <p className="text-gray-600">
              {page} {dictionary.adminDoctors.pagination.of} {totalPages}
            </p>
          </div>
          <div className="flex space-x-2">
            <Link
              href={`/${lang}/admin/doctors?search=${search}&specialty=${specialty}&page=${page - 1}`}
              className={`px-4 py-2 rounded-md ${
                page <= 1 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {dictionary.adminDoctors.pagination.previous}
            </Link>
            <Link
              href={`/${lang}/admin/doctors?search=${search}&specialty=${specialty}&page=${page + 1}`}
              className={`px-4 py-2 rounded-md ${
                page >= totalPages 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {dictionary.adminDoctors.pagination.next}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}