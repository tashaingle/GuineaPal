export const calculateAge = (birthDate: string): { years: number; months: number; weeks: number } | null => {
  if (!birthDate || !isValidDate(birthDate)) {
    return null;
  }

  const birth = new Date(birthDate);
  const today = new Date();

  // Calculate total difference in milliseconds
  const diffTime = Math.abs(today.getTime() - birth.getTime());
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Calculate years
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();

  // Adjust years and months if birth month hasn't occurred this year
  if (months < 0) {
    years--;
    months += 12;
  }

  // Adjust for day of month
  if (today.getDate() < birth.getDate()) {
    months--;
    if (months < 0) {
      years--;
      months += 12;
    }
  }

  // Calculate remaining weeks
  const daysInCurrentMonth = today.getDate() - birth.getDate();
  const weeks = Math.floor((daysInCurrentMonth + (months === 0 ? totalDays : 0)) / 7);

  return { years, months, weeks };
};

export const formatAge = (age: { years: number; months: number; weeks: number } | null): string => {
  if (!age) return 'Unknown age';

  const { years, months, weeks } = age;

  // For very young guinea pigs (less than 1 month)
  if (years === 0 && months === 0) {
    return `${weeks} week${weeks !== 1 ? 's' : ''} old`;
  }

  // For young guinea pigs (less than 3 months)
  if (years === 0 && months < 3) {
    const monthText = months > 0 ? `${months} month${months !== 1 ? 's' : ''}` : '';
    const weekText = weeks > 0 ? `${weeks} week${weeks !== 1 ? 's' : ''}` : '';
    
    if (monthText && weekText) {
      return `${monthText}, ${weekText} old`;
    }
    return `${monthText || weekText} old`;
  }

  // For older guinea pigs
  const yearText = years > 0 ? `${years} year${years !== 1 ? 's' : ''}` : '';
  const monthText = months > 0 ? `${months} month${months !== 1 ? 's' : ''}` : '';

  if (yearText && monthText) {
    return `${yearText}, ${monthText} old`;
  }
  
  return `${yearText || monthText} old`;
};

export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

export const getAgeColor = (age: { years: number; months: number; weeks: number } | null): string => {
  if (!age) return '#9E9E9E'; // Gray for unknown age

  const { years, months } = age;
  const totalMonths = (years * 12) + months;

  // Color scheme based on guinea pig life stages
  if (totalMonths < 1) return '#4CAF50'; // Green for babies (< 1 month)
  if (totalMonths < 6) return '#8BC34A'; // Light green for young (1-6 months)
  if (totalMonths < 12) return '#FFA726'; // Orange for adolescent (6-12 months)
  if (totalMonths < 36) return '#FF7043'; // Deep orange for adult (1-3 years)
  return '#795548'; // Brown for senior (3+ years)
};

export const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    
    if (years > 0) {
        return `${years} year${years === 1 ? '' : 's'} ago`;
    } else if (months > 0) {
        return `${months} month${months === 1 ? '' : 's'} ago`;
    } else if (days > 0) {
        return `${days} day${days === 1 ? '' : 's'} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    } else {
        return 'just now';
    }
}; 