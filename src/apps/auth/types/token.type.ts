export type tokenType = 'access' | 'refresh' | 'reset' | 'onboard';

export type JwtPayload = {
  sub: string;
  type: tokenType;
};

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };

export type Tokens = {
  access_token: string;
  refresh_token: string;
};

export type TokenResponseLogin = {
  access_token: string;
  refresh_token: string;
};
