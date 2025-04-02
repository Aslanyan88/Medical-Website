// app/[lang]/about/page.js
import { getDictionary } from '../../lib/dictionary';

export default async function About({ params }) {
  const { lang = 'en' } = await params;
  const dictionary = await getDictionary(lang);
  const { about } = dictionary;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{about.title}</h1>
        <p className="text-xl text-gray-600">{about.subtitle}</p>
        <div className="w-24 h-1 bg-blue-600 mx-auto mt-6"></div>
      </div>

      {/* Introduction Section */}
      <div className="mb-16">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
            <span className="text-xl">1</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{about.introduction.title}</h2>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="prose max-w-none whitespace-pre-line">
            {about.introduction.content}
          </div>
        </div>
      </div>

      {/* Importance Section */}
      <div className="mb-16">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
            <span className="text-xl">2</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{about.importance.title}</h2>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="prose max-w-none whitespace-pre-line">
            {about.importance.content}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mb-16">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
            <span className="text-xl">3</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{about.benefits.title}</h2>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="prose max-w-none whitespace-pre-line">
            {about.benefits.content}
          </div>
        </div>
      </div>

      {/* Team or facility image */}
      <div className="bg-blue-50 p-6 rounded-lg text-center">
  <h3 className="text-xl font-bold text-gray-800 mb-4">
    {dictionary.about?.facilityTitle || "Our Facility"}
  </h3>
  
  <div className="aspect-video rounded-lg overflow-hidden">
    <video 
      src="/images/medicare.mp4"
      className="w-full h-full object-cover"
      autoPlay
      loop
      muted
      playsInline
    />
  </div>
</div>

    </div>
  );
}