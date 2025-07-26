import * as speakeasy from 'speakeasy';

export function generateOTP(): { otp: string; token: string } {
  const secret = speakeasy.generateSecret({ length: 20 });
  console.log(secret);
  const otp = speakeasy.totp({
    secret: secret.base32,
    encoding: 'base32',
  });

  return {
    otp: otp,
    token: secret.base32,
  };
}

export function validateOTP({
  otp,
  token,
}: {
  otp: string;
  token: string;
}): boolean {
  return speakeasy.totp.verify({
    secret: token,
    encoding: 'base32',
    token: otp,
    window: 2,
  });
}
