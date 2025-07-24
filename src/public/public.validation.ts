import { z, ZodType } from 'zod';

export class CounterValidation {
  static readonly VISITOR: ZodType = z.object({
    key: z.literal(process.env.COUNTER_KEY),
    user_agent: z.string(),
    ip_address: z.string(),
    url: z.literal('/api/public/counter'),
  });
}
