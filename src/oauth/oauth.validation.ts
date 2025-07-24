import { z, ZodType } from 'zod';

export class OauthValidation {
  static readonly OAUTH: ZodType = z.object({
    grant_type: z.literal(process.env.GRANT_TYPE),
    username: z.string().min(1).max(100),
    password: z.string().min(1).max(100),
    id_client: z.literal(process.env.CLIENT_ID),
    client_secret: z.literal(process.env.CLIENT_SECRET),
    user_agent: z.string(),
    ip_address: z.string(),
  });
}
