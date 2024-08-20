import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';
import { RepeatSendOtpByEmail } from '../../decorators/constraint/verify/repeat-code-email.constraint';
import { RepeatSendOtpByPhone } from '../../decorators/constraint/verify/repeat-code-phone.constraint';
import { RegistrationMethod } from '../../enums/registMethod-enum';

export class RepeatSendCode {
  @ApiProperty({ required: false, example: 'john1995@gmail.com' })
  @ValidateIf((o) => !o.phone)
  @RepeatSendOtpByEmail({ message: 'Bad Request' })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Length(8, 32, {
    message: 'The length must be min 8, max 32',
  })
  email: string;

  @ApiProperty({ required: false, example: '+380735433445' })
  @ValidateIf((o) => !o.email)
  @RepeatSendOtpByPhone({ message: 'Bad Request' })
  @IsDefined()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('UA', {
    message: 'Phone number must be a valid Ukrainian phone number.',
  })
  phone: string;

  @ApiProperty({ required: true, example: 'email' })
  @IsEnum(RegistrationMethod)
  @IsDefined()
  @IsNotEmpty()
  registrationMethod: RegistrationMethod;
}
