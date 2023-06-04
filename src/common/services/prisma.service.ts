import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as pluralize from 'pluralize';

const softDeleteModels = [];

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger: Logger = new Logger(PrismaService.name);
  constructor() {
    super({
      // log: ['query', 'error', 'warn'],
    });

    this.loggerMiddleware();
    this.softDeletionMiddleware();
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  loggerMiddleware(): void {
    // Prisma Logger Middleware
    this.$use(async (params, next) => {
      const before = Date.now();
      const result = await next(params);
      const after = Date.now();
      this.logger.debug(
        `Query ${params.model}.${params.action} took ${after - before}ms`,
      );
      return result;
    });
    // End Prisma Logger Middleware
  }

  softDeletionMiddleware(): void {
    // Prisma Soft Delete Middleware
    this.$use(async (params, next) => {
      const deleted = null;
      if (softDeleteModels.includes(params.model)) {
        if (params.action === 'findUnique' || params.action === 'findFirst') {
          params.action = 'findFirst';
          params.args.where['deleted'] = deleted;
        }
        if (params.action === 'findMany') {
          if (params.args.where) {
            if (params.args.where.deleted == undefined) {
              params.args.where['deleted'] = deleted;
            }
          } else {
            params.args['where'] = { deleted };
          }
        }
      }
      return next(params);
    });

    this.$use(async (params, next) => {
      const deleted = null;
      if (softDeleteModels.includes(params.model)) {
        if (params.action == 'update') {
          params.action = 'updateMany';
          params.args.where['deleted'] = deleted;
        }
        if (params.action == 'updateMany') {
          if (params.args.where != undefined) {
            params.args.where['deleted'] = deleted;
          } else {
            params.args['where'] = { deleted };
          }
        }
      }
      return next(params);
    });

    this.$use(async (params, next) => {
      const deleted = Date.now();
      if (softDeleteModels.includes(params.model)) {
        if (params.action == 'delete') {
          params.action = 'update';
          params.args['data'] = { deleted };
        }
        if (params.action == 'deleteMany') {
          // Delete many queries
          params.action = 'updateMany';
          if (params.args.data != undefined) {
            params.args.data['deleted'] = deleted;
          } else {
            params.args['data'] = { deleted };
          }
        }
      }
      return next(params);
    });
    // End Prisma Soft Delete Middleware
  }

  async clearDatabase(): Promise<void> {
    const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_');

    for (const modelKey of models) {
      await this.$executeRaw`TRUNCATE TABLE "${pluralize.plural(
        modelKey,
      )}" CASCADE;`;
    }
  }
}
