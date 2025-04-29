// app/[lang]/admin/users/page.js
import Link from 'next/link';
import { prisma } from '../../../../lib/prisma';

export default async function AdminUsers({ params, searchParams }) {
  const { lang } = params;
  const isArmenian = lang === 'hy';
  
  // Get query parameters
  const page = Number(searchParams.page) || 1;
  const limit = 10;
  const search = searchParams.search || '';
  
  // Build search filter
  const searchFilter = search
    ? {
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};
  
  // Fetch users with pagination
  const users = await prisma.user.findMany({
    where: searchFilter,
    orderBy: {
      createdAt: 'desc',
    },
    skip: (page - 1) * limit,
    take: limit,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      isAdmin: true,
      createdAt: true,
      _count: {
        select: {
          appointments: true,
        },
      },
    },
  });
  
  // Get total count
  const totalCount = await prisma.user.count({
    where: searchFilter,
  });
  
  const totalPages = Math.ceil(totalCount / limit);
  
  // Dictionary for translations
  const dictionary = {
    adminUsers: {
      title: isArmenian ? 'Կառավարել Օգտատերերին' : 'Manage Users',
      search: isArmenian ? 'Որոնել...' : 'Search...',
      table: {
        name: isArmenian ? 'Անուն' : 'Name',
        email: isArmenian ? 'Էլ. հասցե' : 'Email',
        role: isArmenian ? 'Դեր' : 'Role',
        appointments: isArmenian ? 'Ժամադրություններ' : 'Appointments',
        joined: isArmenian ? 'Գրանցվել է' : 'Joined',
        actions: isArmenian ? 'Գործողություններ' : 'Actions',
      },
      roles: {
        admin: isArmenian ? 'Ադմինիստրատոր' : 'Admin',
        user: isArmenian ? 'Օգտատեր' : 'User',
      },
      actions: {
        viewAppointments: isArmenian ? 'Դիտել Ժամադրությունները' : 'View Appointments',
        edit: isArmenian ? 'Խմբագրել' : 'Edit',
        delete: isArmenian ? 'Ջնջել' : 'Delete',
      },
      pagination: {
        previous: isArmenian ? 'Նախորդ' : 'Previous',
        next: isArmenian ? 'Հաջորդ' : 'Next',
        of: isArmenian ? '-ից' : 'of',
      },
      noUsers: isArmenian ? 'Օգտատերեր չեն գտնվել' : 'No users found',
    },
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isArmenian ? 'hy-AM' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{dictionary.adminUsers.title}</h1>
      
      {/* Search */}
      <div className="mb-6">
        <form 
          action={`/${lang}/admin/users`} 
          method="GET" 
          className="flex items-center max-w-md"
        >
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder={dictionary.adminUsers.search}
            className="border border-gray-300 rounded-l-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          {/* Hidden input to reset page */}
          <input type="hidden" name="page" value="1" />
        </form>
      </div>
      
      {/* Users Table */}
      {users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">{dictionary.adminUsers.table.name}</th>
                <th className="py-3 px-4 text-left">{dictionary.adminUsers.table.email}</th>
                <th className="py-3 px-4 text-left">{dictionary.adminUsers.table.role}</th>
                <th className="py-3 px-4 text-left">{dictionary.adminUsers.table.appointments}</th>
                <th className="py-3 px-4 text-left">{dictionary.adminUsers.table.joined}</th>
                <th className="py-3 px-4 text-right">{dictionary.adminUsers.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="py-3 px-4">
                    {user.email}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.isAdmin ? dictionary.adminUsers.roles.admin : dictionary.adminUsers.roles.user}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {user._count.appointments}
                  </td>
                  <td className="py-3 px-4">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Link 
                        href={`/${lang}/admin/users/${user.id}/appointments`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {dictionary.adminUsers.actions.viewAppointments}
                      </Link>
                      {user.id !== 'admin_user_id' && (
                        <>
                          <Link 
                            href={`/${lang}/admin/users/${user.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            {dictionary.adminUsers.actions.edit}
                          </Link>
                          <Link 
                            href={`/${lang}/admin/users/${user.id}/delete`}
                            className="text-red-600 hover:text-red-800"
                          >
                            {dictionary.adminUsers.actions.delete}
                          </Link>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">{dictionary.adminUsers.noUsers}</p>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 0 && (
        <div className="mt-6 flex justify-between items-center">
          <div>
            <p className="text-gray-600">
              {page} {dictionary.adminUsers.pagination.of} {totalPages}
            </p>
          </div>
          <div className="flex space-x-2">
            <Link
              href={`/${lang}/admin/users?search=${search}&page=${page - 1}`}
              className={`px-4 py-2 rounded-md ${
                page <= 1 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {dictionary.adminUsers.pagination.previous}
            </Link>
            <Link
              href={`/${lang}/admin/users?search=${search}&page=${page + 1}`}
              className={`px-4 py-2 rounded-md ${
                page >= totalPages 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {dictionary.adminUsers.pagination.next}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}