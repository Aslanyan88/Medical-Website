import Link from 'next/link';

export default function DoctorCard({ doctor, dictionary, lang }) {
  const { doctors } = dictionary;
  const isArmenian = lang === 'hy';

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full transition-transform duration-200 hover:scale-[1.02]">
      {/* Image container with fixed aspect ratio */}
      <div className="relative aspect-square w-full bg-gray-100">
        <img
          src={doctor.image}
          alt={isArmenian ? doctor.nameHy : doctor.name}
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="lazy"
        />
      </div>

      {/* Content container with fixed height and flex layout */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Name and Specialty (fixed height) */}
        <div className="mb-3 h-[4.5rem]">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
            {isArmenian ? doctor.nameHy : doctor.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {isArmenian ? doctor.specialtyHy : doctor.specialty}
          </p>
        </div>

        {/* Experience and Languages (fixed height) */}
        <div className="text-sm text-gray-700 space-y-2 h-[4rem]">
          <p>
            <span className="font-semibold">{doctors.experience}:</span>{' '}
            {doctor.experience} {isArmenian ? 'տարի' : 'years'}
          </p>
          <p>
            <span className="font-semibold">{doctors.languages}:</span>{' '}
            {isArmenian
              ? doctor.languagesHy.join(', ')
              : doctor.languages.join(', ')}
          </p>
        </div>

        {/* Availability (fixed height) */}
        <div className="mt-2 text-sm h-[6rem] overflow-auto">
          {doctor.availability && (
            <>
              <p className="font-semibold mb-2">{doctors.availability}:</p>
              <ul className="space-y-1.5">
                {(isArmenian ? doctor.availabilityHy : doctor.availability).map(
                  (slot, index) => (
                    <li key={index} className="flex justify-between text-gray-600">
                      <span>{slot.day}</span>
                      <span className="font-medium text-gray-700">{slot.hours}</span>
                    </li>
                  )
                )}
              </ul>
            </>
          )}
        </div>

        {/* Buttons (fixed position at bottom) */}
        <div className="mt-auto flex flex-col gap-2">
          <Link
            href={`/${lang}/doctors/${doctor.id}`}
            className="w-full text-center px-4 py-2.5 text-sm font-medium border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            {doctors.viewProfile}
          </Link>
          <Link
            href={`/${lang}/appointments?doctor=${doctor.id}`}
            className="w-full text-center px-4 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {doctors.bookAppointment}
          </Link>
        </div>
      </div>
    </div>
  );
}