import { registerAs } from '@nestjs/config';

export default registerAs('pagination', () => ({
  default_page_size: 20,
  default_page_number: 1,
  max_page_size: 100,
}));
