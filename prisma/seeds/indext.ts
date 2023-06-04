import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import rolesSeed from './roles.seed';

const prisma = new PrismaClient();
const logger = new Logger('PrismaSeeder');

const main = async (): Promise<void> => {
  await Promise.all([await rolesSeed(prisma)]);
};

main()
  .catch((e) => logger.error(e))
  .finally(async () => await prisma.$disconnect());
