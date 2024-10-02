import { Global, Module } from '@nestjs/common';
import { NodemailerService } from './nodemailer.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('nodemailer.host'),
          port: configService.get<number>('nodemailer.port'),
          secure: false,
          auth: {
            user: configService.get<string>('nodemailer.user'),
            pass: configService.get<string>('nodemailer.pass'),
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [NodemailerService],
  exports: [NodemailerService],
})
export class NodemailerModule {}
