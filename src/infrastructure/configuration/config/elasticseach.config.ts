import { registerAs } from '@nestjs/config';

export default registerAs('elasticsearch', () => ({
  node: process.env.ELASTICSEARCH_HOST,
}));
