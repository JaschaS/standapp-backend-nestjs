import { NestFactory } from '@nestjs/core';
import { MemberModule } from './member.module';

async function bootstrap() {
  const app = await NestFactory.create(MemberModule);
  app.enableCors();
  await app.listen(8082);
}
bootstrap();
