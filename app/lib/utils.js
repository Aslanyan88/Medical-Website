export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  export const generateTimeSlots = (startHour = 9, endHour = 17, intervalMinutes = 30) => {
    const slots = [];
    const start = new Date();
    start.setHours(startHour, 0, 0, 0);
    
    const end = new Date();
    end.setHours(endHour, 0, 0, 0);
    
    const interval = intervalMinutes * 60 * 1000;
    
    let current = start;
    while (current < end) {
      slots.push(new Date(current));
      current = new Date(current.getTime() + interval);
    }
    
    return slots;
  };
  
  export const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };
  
  export const generateAppointmentId = () => {
    return Math.random().toString(36).substring(2, 10);
  };
  
  export const calculateInsuranceCoverage = (amount, coveragePercent = 80) => {
    return {
      covered: (amount * coveragePercent) / 100,
      patientResponsibility: amount - (amount * coveragePercent) / 100,
    };
  };