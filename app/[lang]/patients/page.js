'use client';

import { useEffect, useState } from 'react';
import { getDictionary } from '../../lib/dictionary';
import { patients } from '../../lib/mockData';
import { formatDate } from '../../lib/utils';
import PatientForm from '../../components/';

export default function Patients({ params: { lang } }) {
  const [dictionary, setDictionary] = useState(null);
  const [patientData, setPatientData] = useState(null);

  // Get patient data - in a real app this would come from your API
  // For now, just use the first patient from mockData
  useEffect(() => {
    setPatientData(patients[0]);
  }, []);

  // Fetch dictionary data
  useEffect(() => {
    const loadDictionary = async () => {
      const dict = await getDictionary(lang);
      setDictionary(dict);
    };
    
    loadDictionary();
  }, [lang]);

  if (!dictionary || !patientData) {
    return <div>Loading...</div>;
  }

  const { patients: patientsDict } = dictionary;

  return (
    <div className="container">
      <div className="section">
        <h1 className="text-3xl font-bold mb-2">{patientsDict.title}</h1>
        <p className="text-xl text-gray-600 mb-8">{patientsDict.subtitle}</p>

        {/* Patient Profile */}
        <PatientForm dictionary={dictionary} lang={lang} patientId={patientData.id} />
        
        {/* Medical Records */}
        <div className="card mt-8">
          <h3 className="text-lg font-bold mb-4">{patientsDict.medicalRecords.title}</h3>
          
          {patientData.medicalHistory.length === 0 ? (
            <p>{patientsDict.medicalRecords.noRecords}</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">{patientsDict.medicalRecords.date}</th>
                  <th className="text-left">{patientsDict.medicalRecords.diagnosis}</th>
                  <th className="text-left">{patientsDict.medicalRecords.treatment}</th>
                </tr>
              </thead>
              <tbody>
                {patientData.medicalHistory.map((record, index) => (
                  <tr key={index}>
                    <td>{formatDate(record.date)}</td>
                    <td>{record.diagnosis}</td>
                    <td>{record.treatment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Insurance Information */}
        <div className="card mt-8">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-bold">{patientsDict.insurance.title}</h3>
            <button className="button button-secondary">
              {patientsDict.insurance.update}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-bold">{patientsDict.insurance.provider}</p>
              <p>{patientData.insurance}</p>
            </div>
            
            <div>
              <p className="font-bold">{patientsDict.insurance.id}</p>
              <p>{patientData.insuranceId}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}