import { ErrorResService } from '@/common/responses/error/error.service';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { config } from 'dotenv';

export type tokenType =
  | 'access'
  | 'refresh'
  | 'reset'
  | 'onboard'
  | 'magic_link';

export type JwtPayload = {
  sub: string;
  type: tokenType;
};
config({ path: process.cwd() + '/.env' });
const error = new ErrorResService();
const jwtCred = {
  access: {
    secret: process.env.JWT_AT_SECRET,
    exp: process.env.JWT_AT_EXP,
  },
  refresh: {
    secret: process.env.JWT_RT_SECRET,
    exp: process.env.JWT_RT_EXP,
  },
  reset: {
    secret: process.env.JWT_RESET_SECRET,
    exp: process.env.JWT_RESET_EXP,
  },
};

// Generate JWT
export const generateJwt = async (uuid: string, type: tokenType) => {
  const js = new JwtService();
  const jwtPayload: JwtPayload = {
    sub: uuid,
    type: type,
  };
  // console.log('test ', typeof jwtCred[type].exp);
  return await js.signAsync(jwtPayload, {
    secret: jwtCred[type].secret,
    expiresIn: jwtCred[type].exp,
  });
};

// Verify JWT Token
export const verifyJwt = async (
  token: string,
  jwtVerifyOptions: JwtVerifyOptions,
) => {
  try {
    const js = new JwtService();
    return await js.verifyAsync(token, jwtVerifyOptions);
  } catch (e) {
    return error.ExcUnauthorized('Unauthorized Invalid Token.');
  }
};
