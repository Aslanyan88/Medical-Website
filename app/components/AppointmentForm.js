import { useState, useEffect } from 'react';
import { doctors } from '../lib/doctors';
import { generateTimeSlots, formatTime, generateAppointmentId } from '../lib/utils';

const AppointmentForm = ({ 
  dictionary, 
  lang, 
  preselectedDoctor = null 
}) => {
  const { appointments } = dictionary;
  const isArmenian = lang === 'hy';
  
  const [selectedDoctor, setSelectedDoctor] = useState(
    preselectedDoctor ? preselectedDoctor.id.toString() : ''
  );
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    reason: '',
    insuranceProvider: '',
    insuranceId: '',
  });
  const [success, setSuccess] = useState(false);
  
  // Update selected doctor if preselectedDoctor changes
  useEffect(() => {
    if (preselectedDoctor) {
      setSelectedDoctor(preselectedDoctor.id.toString());
    }
  }, [preselectedDoctor]);

  // Generate available times
  const timeSlots = generateTimeSlots();
  
  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, you would send this data to your backend
    console.log({
      id: generateAppointmentId(),
      doctorId: selectedDoctor,
      date: selectedDate,
      time: selectedTime,
      ...formData,
    });
    
    // Show success message
    setSuccess(true);
    
    // Reset form after submission
    setTimeout(() => {
      setSelectedDoctor(preselectedDoctor ? preselectedDoctor.id.toString() : '');
      setSelectedDate('');
      setSelectedTime('');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        reason: '',
        insuranceProvider: '',
        insuranceId: '',
      });
      setSuccess(false);
    }, 3000);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {success ? (
        <div className="bg-green-500 text-white p-4 rounded">
          {appointments.success}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Doctor Selection */}
          <div className="form-group">
            <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 mb-2">
              {appointments.selectDoctor}
            </label>
            <select
              id="doctor"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              required
            >
              <option value="">-- {appointments.selectDoctor} --</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {isArmenian ? doctor.nameHy : doctor.name} ({isArmenian ? doctor.specialtyHy : doctor.specialty})
                </option>
              ))}
            </select>
          </div>
          
          {/* Date Selection */}
          <div className="form-group">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              {appointments.selectDate}
            </label>
            <input
              type="date"
              id="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={today}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
          </div>
          
          {/* Time Selection */}
          <div className="form-group">
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
              {appointments.selectTime}
            </label>
            <select
              id="time"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              required
            >
              <option value="">-- {appointments.selectTime} --</option>
              {timeSlots.map((slot, index) => (
                <option key={index} value={slot.toISOString()}>
                  {formatTime(slot)}
                </option>
              ))}
            </select>
          </div>
          
          <h3 className="text-lg font-bold mt-6 mb-4">{appointments.yourInformation}</h3>
          
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                {appointments.firstName}
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                {appointments.lastName}
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {appointments.email}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                {appointments.phone}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              {appointments.reason}
            </label>
            <textarea
              id="reason"
              name="reason"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              value={formData.reason}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          
          <h3 className="text-lg font-bold mt-6 mb-4">{appointments.insuranceInfo}</h3>
          
          {/* Insurance Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="insuranceProvider" className="block text-sm font-medium text-gray-700 mb-2">
                {appointments.insuranceProvider}
              </label>
              <input
                type="text"
                id="insuranceProvider"
                name="insuranceProvider"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.insuranceProvider}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="insuranceId" className="block text-sm font-medium text-gray-700 mb-2">
                {appointments.insuranceId}
              </label>
              <input
                type="text"
                id="insuranceId"
                name="insuranceId"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.insuranceId}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {appointments.submit}
          </button>
        </form>
      )}
    </div>
  );
};

export default AppointmentForm;