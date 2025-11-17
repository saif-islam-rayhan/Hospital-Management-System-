// Format date to YYYY-MM-DD
const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

// Format time to HH:MM
const formatTime = (time) => {
  if (typeof time === 'string') return time;
  
  const date = new Date(time);
  return date.toTimeString().slice(0, 5);
};

// Generate random password
const generatePassword = (length = 8) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// Calculate age from birth date
const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (Bangladeshi format)
const isValidPhone = (phone) => {
  const phoneRegex = /^(?:\+88|01)?\d{11}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

module.exports = {
  formatDate,
  formatTime,
  generatePassword,
  calculateAge,
  isValidEmail,
  isValidPhone
};