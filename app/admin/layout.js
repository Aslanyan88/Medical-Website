// app/[lang]/admin/layout.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import AdminSidebar from '../../../components/AdminSidebar';

export default async function AdminLayout({ children, params }) {
  const { lang } = params;
  
  // Check if user is authenticated and is an admin
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user.isAdmin) {
    redirect(`/${lang}/login?message=adminAccessRequired`);
  }
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar lang={lang} />
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}