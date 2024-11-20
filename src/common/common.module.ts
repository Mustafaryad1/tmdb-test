import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [],
  exports: [],
})
export class CommonModule {}
