'use client';

import { useEffect, useState } from 'react';
import { getDictionary } from '../../lib/dictionary';
import { insurancePlans } from '../../lib/mockData';
import PaymentForm from '../../components/PaymentForm';

export default function Payments({ params: { lang } }) {
  const [dictionary, setDictionary] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(350);
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      date: '2023-06-15',
      description: 'General Consultation',
      amount: 150,
      status: 'Paid',
    },
    {
      id: 2,
      date: '2023-05-20',
      description: 'Blood Test',
      amount: 200,
      status: 'Paid',
    },
  ]);

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

  const { payments } = dictionary;
  const isArmenian = lang === 'hy';

  return (
    <div className="container">
      <div className="section">
        <h1 className="text-3xl font-bold mb-2">{payments.title}</h1>
        <p className="text-xl text-gray-600 mb-8">{payments.subtitle}</p>

        {/* Current Balance */}
        <div className="card mb-8">
          <h3 className="text-lg font-bold mb-2">{payments.currentBalance}</h3>
          <p className="text-3xl font-bold text-primary-color">${currentBalance}</p>
        </div>

        {/* Payment Form */}
        <PaymentForm dictionary={dictionary} lang={lang} />

        {/* Insurance Plans */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">{payments.insurancePlans}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {insurancePlans.map((plan) => (
              <div key={plan.id} className="card">
                <h3 className="text-xl font-bold mb-2">
                  {isArmenian ? plan.nameHy : plan.name}
                </h3>
                <p className="mb-4">
                  {isArmenian ? plan.descriptionHy : plan.description}
                </p>
                
                <div className="mb-4">
                  <p>
                    <strong>{payments.coveragePercent}:</strong> {plan.coverage}%
                  </p>
                  <p>
                    <strong>{payments.monthlyPremium}:</strong> ${plan.monthlyPremium}
                  </p>
                  <p>
                    <strong>{payments.annualDeductible}:</strong> ${plan.annualDeductible}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button className="button button-secondary">
                    {payments.learnMore}
                  </button>
                  <button className="button button-primary">
                    {payments.apply}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">{payments.recentTransactions}</h2>
          
          {transactions.length === 0 ? (
            <p>{payments.noTransactions}</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">{payments.date}</th>
                  <th className="text-left">{payments.description}</th>
                  <th className="text-right">{payments.amount}</th>
                  <th className="text-right">{payments.status}</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.date}</td>
                    <td>{transaction.description}</td>
                    <td className="text-right">${transaction.amount}</td>
                    <td className="text-right">{transaction.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}