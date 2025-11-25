const EIGHT_HOURS = 8 * 60 * 60 * 1000;

export const isTokenExpired = (): boolean => {
  const timestamp = localStorage.getItem('loginTimestamp');
  if (!timestamp) {
    return true;
  }

  const loginTime = parseInt(timestamp, 10);
  const now = new Date().getTime();

  return now - loginTime > EIGHT_HOURS;
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('loginTimestamp');
};
