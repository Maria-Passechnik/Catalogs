import { Global, Module } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { logger } from 'src/config/logger.config';

@Global()
@Module({
  providers: [
    {
      provide: WINSTON_MODULE_PROVIDER,
      useValue: logger,
    },
  ],
  exports: [WINSTON_MODULE_PROVIDER],
})
export class LoggerModule {}
