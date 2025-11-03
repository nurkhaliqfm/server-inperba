import { z, ZodType } from 'zod';

export class OTPValidation {
  static readonly REQUEST: ZodType = z.object({
    phone: z
      .string({
        required_error: 'Phone number is required',
        invalid_type_error: 'Phone number must be a string',
      })
      .trim()
      .min(12, { message: 'Phone number is too short (min 11 digits)' })
      .max(14, { message: 'Phone number is too long (max 14 digits)' })
      .regex(/^628[0-9]{9,11}$/, {
        message: 'Phone number must start with 628 and be valid',
      }),
    identity: z.string({
      required_error: 'Identity is required',
      invalid_type_error: 'Identity must be a string',
    }),
  });

  static readonly VAIDATION: ZodType = z.intersection(
    OTPValidation.REQUEST,
    z.object({
      otp: z
        .string({
          required_error: 'OTP is required',
          invalid_type_error: 'OTP must be a string',
        })
        .regex(/^\d{6}$/, {
          message: 'OTP must be exactly 6 digits number',
        }),
    }),
  );
}
