import * as bcrypt from 'bcrypt';

// For Hashing Password with Argon2
export const hashPassword = async (password: string): Promise<string> => {
  const saltOrRounds = await bcrypt.genSalt();
  return await bcrypt.hash(password, saltOrRounds);
};

// For Verifying Password with Argon2
export const verifyPassword = async (
  hashPassword: string,
  password: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashPassword);
};

// Internal use Function
const regEx = (pattern: RegExp, str: string): boolean => pattern.test(str);
const passwordReturn = (isOk: boolean, msg: string) => {
  return { isOk, msg };
};

interface IPasswordValidation {
  isOk: boolean;
  msg: string;
}

// Password Validator
export const validatePassword = (password: string): IPasswordValidation => {
  if (password.length < 6) {
    return passwordReturn(
      false,
      'Password length must be greater than 12 character.',
    );
  }
  if (password.length > 128) {
    return passwordReturn(
      false,
      'Password length must be less than 128 character.',
    );
  }
  switch (false) {
    case regEx(/[A-Z]+/g, password):
      return passwordReturn(
        false,
        'Password must contain at least one uppercase letter.',
      );
    case regEx(/[a-z]+/g, password):
      return passwordReturn(
        false,
        'Password must contain at least one lowercase letter.',
      );
    case regEx(/\d+/g, password):
      return passwordReturn(
        false,
        'Password must contain at least one number.',
      );
    case regEx(/[!@#~$%^&*()+|_]{1}/g, password):
      return passwordReturn(
        false,
        'Password must contain at least one special character.',
      );
    default:
      return passwordReturn(true, 'Everything all right.');
  }
};

export const isValidEmailRegex = (email: string): boolean => {
  const regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
  return regexEmail.test(email);
};

//  This method will be used to Generate random number
export const generateOtp = () => {
  const val = Math.floor(1000 + Math.random() * 9000);
  return val;
};

/* Get Date of Birth Year */
export const getYearFromDOB = (year: string) => {
  return parseInt(year.split('-')[0]);
};

/* Generate Password */
export const randomPassword = (length: 8 | 12 | 16 | 20 | 24) => {
  const small = 'abcdefghijklmnopqrstuvwxyz';
  const caps = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nums = '0123456789';
  const symbols = '@$!%&';

  let password = '';
  const passLength = Math.floor(length / 4);
  for (let i = 0; i < passLength; i++) {
    password += small.charAt(Math.floor(Math.random() * small.length));
    password += caps.charAt(Math.floor(Math.random() * caps.length));
    password += nums.charAt(Math.floor(Math.random() * nums.length));
    password += symbols.charAt(Math.floor(Math.random() * symbols.length));
  }

  return password;
};
