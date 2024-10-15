import { registerAs } from '@nestjs/config';

export default registerAs('stripe', () => ({
  sk_test: process.env.SK_TEST,
  whsec: process.env.WHSEC,
}));
