import { useState } from 'react';
import { calculateInsuranceCoverage } from '../lib/utils';

const PaymentForm = ({ dictionary, lang }) => {
  const { payments } = dictionary;
  
  const [amount, setAmount] = useState('150');
  const [formData, setFormData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
  });
  const [success, setSuccess] = useState(false);

  // Calculate insurance coverage
  const coverage = calculateInsuranceCoverage(Number(amount));
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, you would process the payment here
    console.log('Payment data:', {
      amount,
      coverage,
      ...formData,
    });
    
    // Show success message
    setSuccess(true);
    
    // Reset form after submission
    setTimeout(() => {
      setFormData({
        cardholderName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        billingAddress: '',
      });
      setSuccess(false);
    }, 3000);
  };
  
  return (
    <div className="card">
      <h3 className="text-lg font-bold mb-4">{payments.makePayment}</h3>
      
      {success ? (
        <div className="bg-success-color text-white p-4 rounded">
          {dictionary.common.success}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="amount" className="form-label">
              {payments.paymentAmount}
            </label>
            <div className="flex items-center">
              <span className="mr-2">$</span>
              <input
                type="number"
                id="amount"
                className="form-input"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>
          
          {/* Insurance Coverage */}
          <div className="bg-gray-100 p-4 rounded mb-4">
            <p>
              <strong>{payments.insurancePlans}:</strong> ${coverage.covered.toFixed(2)}
            </p>
            <p>
              <strong>{lang === 'hy' ? 'Վճարման ենթակա գումար' : 'Your Responsibility'}:</strong> ${coverage.patientResponsibility.toFixed(2)}
            </p>
          </div>
          
          <h4 className="text-md font-bold mt-4 mb-2">{payments.cardInformation}</h4>
          
          <div className="form-group">
            <label htmlFor="cardholderName" className="form-label">
              {payments.cardholderName}
            </label>
            <input
              type="text"
              id="cardholderName"
              name="cardholderName"
              className="form-input"
              value={formData.cardholderName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="cardNumber" className="form-label">
              {payments.cardNumber}
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              className="form-input"
              placeholder="XXXX XXXX XXXX XXXX"
              value={formData.cardNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="expiryDate" className="form-label">
                {payments.expiryDate}
              </label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                className="form-input"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="cvv" className="form-label">
                {payments.cvv}
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                className="form-input"
                placeholder="123"
                value={formData.cvv}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="billingAddress" className="form-label">
              {payments.billingAddress}
            </label>
            <input
              type="text"
              id="billingAddress"
              name="billingAddress"
              className="form-input"
              value={formData.billingAddress}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <button type="submit" className="button button-primary mt-4">
            {payments.processPayment}
          </button>
        </form>
      )}
    </div>
  );
};

export default PaymentForm;