'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { getDictionary } from '../../lib/dictionary';
import { appointments } from '../../lib/mockData';
import { formatDate } from '../../lib/utils';
import AppointmentForm from '../../components/AppointmentForm';

// Create a client component that uses search params
function AppointmentContent({ lang, dictionary }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  // Fetch appointments data
  useEffect(() => {
    // In a real app, you would fetch from your API
    // For now, use mock data
    setUpcomingAppointments(appointments);
  }, []);

  const { appointments: appointmentsDict } = dictionary;

  // Handle appointment cancellation
  const handleCancelAppointment = (appointmentId) => {
    // In a real app, you would call your API
    console.log(`Cancelling appointment ${appointmentId}`);
    
    // Update local state
    setUpcomingAppointments(
      upcomingAppointments.filter((apt) => apt.id !== appointmentId)
    );
  };

  return (
    <>
      {/* Appointment Form */}
      <AppointmentForm dictionary={dictionary} lang={lang} />

      {/* Upcoming Appointments */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">{appointmentsDict.upcomingTitle}</h2>
        
        {upcomingAppointments.length === 0 ? (
          <p>{appointmentsDict.noAppointments}</p>
        ) : (
          <div className="grid gap-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="card">
                <div className="flex justify-between">
                  <div>
                    <p>
                      <strong>{formatDate(appointment.date)}</strong> at{' '}
                      {appointment.time}
                    </p>
                    <p>{appointment.reason}</p>
                  </div>
                  <div>
                    <button
                      className="button button-secondary mr-2"
                      onClick={() => handleCancelAppointment(appointment.id)}
                    >
                      {appointmentsDict.cancel}
                    </button>
                    <button
                      className="button button-primary"
                      onClick={() => 
                        router.push(`/${lang}/appointments?edit=${appointment.id}`)
                      }
                    >
                      {appointmentsDict.reschedule}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// Main page component
export default function Appointments({ params: { lang } }) {
  const [dictionary, setDictionary] = useState(null);

  // Fetch dictionary data
  useEffect(() => {
    const loadDictionary = async () => {
      const dict = await getDictionary(lang);
      setDictionary(dict);
    };
    
    loadDictionary();
  }, [lang]);

  if (!dictionary) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="section">
        <h1 className="text-3xl font-bold mb-2">{dictionary.appointments.title}</h1>
        <p className="text-xl text-gray-600 mb-8">{dictionary.appointments.subtitle}</p>
        
        <Suspense fallback={<div>Loading appointments...</div>}>
          <AppointmentContent lang={lang} dictionary={dictionary} />
        </Suspense>
      </div>
    </div>
  );
}