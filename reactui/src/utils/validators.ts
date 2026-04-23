export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUsername = (username: string): boolean => {
  return (
    username.length >= 3 &&
    username.length <= 50 &&
    /^[a-zA-Z0-9_]+$/.test(username)
  );
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

export const passwordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};
