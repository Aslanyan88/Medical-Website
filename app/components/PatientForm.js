import { useState } from 'react';
import { patients } from '../lib/mockData';

const PatientForm = ({ dictionary, lang, patientId = 1 }) => {
  const { patients: patientsDict } = dictionary;
  const patient = patients.find((p) => p.id === patientId) || patients[0];
  
  const [formData, setFormData] = useState({
    firstName: patient.firstName,
    lastName: patient.lastName,
    dateOfBirth: patient.dateOfBirth,
    email: patient.email,
    phone: patient.phone,
    address: patient.address,
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, you would send this data to your backend
    console.log('Updated patient data:', formData);
    
    // Show success message
    setSuccess(true);
    
    // Turn off editing mode
    setIsEditing(false);
    
    // Reset success message after a delay
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };
  
  return (
    <div className="card">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-bold">{patientsDict.profile.title}</h3>
        {!isEditing && (
          <button
            className="button button-secondary"
            onClick={() => setIsEditing(true)}
          >
            {patientsDict.profile.update}
          </button>
        )}
      </div>
      
      {success && (
        <div className="bg-success-color text-white p-4 rounded mb-4">
          {dictionary.common.success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">{patientsDict.profile.firstName}</label>
            {isEditing ? (
              <input
                type="text"
                name="firstName"
                className="form-input"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            ) : (
              <p>{formData.firstName}</p>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">{patientsDict.profile.lastName}</label>
            {isEditing ? (
              <input
                type="text"
                name="lastName"
                className="form-input"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            ) : (
              <p>{formData.lastName}</p>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">{patientsDict.profile.dateOfBirth}</label>
            {isEditing ? (
              <input
                type="date"
                name="dateOfBirth"
                className="form-input"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
              />
            ) : (
              <p>{formData.dateOfBirth}</p>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">{patientsDict.profile.email}</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            ) : (
              <p>{formData.email}</p>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">{patientsDict.profile.phone}</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            ) : (
              <p>{formData.phone}</p>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">{patientsDict.profile.address}</label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                className="form-input"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            ) : (
              <p>{formData.address}</p>
            )}
          </div>
        </div>
        
        {isEditing && (
          <div className="flex gap-2 mt-4">
            <button type="submit" className="button button-primary">
              {dictionary.common.save}
            </button>
            <button
              type="button"
              className="button button-secondary"
              onClick={() => setIsEditing(false)}
            >
              {dictionary.common.cancel}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PatientForm;