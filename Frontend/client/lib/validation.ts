export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;
  
  const validDomains = [
    'gmail.com',
    'hotmail.com',
    'outlook.com',
    'yahoo.com',
    'icloud.com',
    'live.com',
    'msn.com',
  ];
  
  const domain = email.split('@')[1]?.toLowerCase();
  return validDomains.includes(domain);
};

export const validatePhone = (phone: string): boolean => {
  // เบอร์ไทย: 10 หลัก เริ่มต้นด้วย 0
  const phoneRegex = /^0\d{9}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password: string): boolean => {
  if (password.length < 8) return false;
  
  // ต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว
  if (!/[A-Z]/.test(password)) return false;
  
  // ต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว
  if (!/[a-z]/.test(password)) return false;
  
  // ต้องมีตัวเลขอย่างน้อย 1 ตัว
  if (!/\d/.test(password)) return false;
  
  return true;
};

export const validateUsername = (username: string): boolean => {
  // อย่างน้อย 4 ตัวอักษร, ใช้ได้แค่ a-z, A-Z, 0-9, _, -
  const usernameRegex = /^[a-zA-Z0-9_-]{4,}$/;
  return usernameRegex.test(username);
};

export const getEmailError = (email: string): string => {
  if (!email.trim()) return "Email is required";
  if (!email.includes('@')) return "Email must contain @";
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Invalid email format";
  
  const validDomains = [
    'gmail.com',
    'hotmail.com',
    'outlook.com',
    'yahoo.com',
    'icloud.com',
    'live.com',
    'msn.com',
  ];
  
  const domain = email.split('@')[1]?.toLowerCase();
  if (!validDomains.includes(domain)) {
    return `Email must use: ${validDomains.join(', ')}`;
  }
  
  return "";
};

export const getPhoneError = (phone: string): string => {
  if (!phone.trim()) return "Phone number is required";
  if (!/^\d+$/.test(phone)) return "Phone must contain only numbers";
  if (phone.length !== 10) return "Phone must be 10 digits";
  if (!phone.startsWith('0')) return "Phone must start with 0";
  return "";
};

export const getPasswordError = (password: string): string => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password)) return "Password must contain uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must contain lowercase letter";
  if (!/\d/.test(password)) return "Password must contain number";
  return "";
};

export const getUsernameError = (username: string): string => {
  if (!username.trim()) return "Username is required";
  if (username.length < 4) return "Username must be at least 4 characters";
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) return "Username can only contain letters, numbers, _ and -";
  return "";
};