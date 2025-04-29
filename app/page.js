import { redirect } from 'next/navigation';

// Default language redirect
export default function Home() {
  // Redirect to English by default
  redirect('/en');
}