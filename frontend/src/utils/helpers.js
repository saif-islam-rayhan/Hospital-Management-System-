// Format date to readable string
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format time to readable string
export const formatTime = (timeString) => {
  if (!timeString) return '-';
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
};

// Format date and time together
export const formatDateTime = (dateString, timeString) => {
  return `${formatDate(dateString)} at ${formatTime(timeString)}`;
};

// Get status color
export const getStatusColor = (status) => {
  switch (status) {
    case 'Scheduled':
      return 'status-scheduled';
    case 'Confirmed':
      return 'status-confirmed';
    case 'Completed':
      return 'status-completed';
    case 'Cancelled':
      return 'status-cancelled';
    case 'Active':
      return 'status-completed';
    case 'Inactive':
      return 'status-cancelled';
    default:
      return 'status-scheduled';
  }
};

// Calculate age from date of birth
export const calculateAge = (dob) => {
  if (!dob) return null;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number
export const isValidPhone = (phone) => {
  const phoneRegex = /^(?:\+88|01)?\d{11}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Debounce function for search
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Get initial from name
export const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};