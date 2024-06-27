import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  Validate,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { RegistrationMethod } from '../enums/registMethod-enum';
import { RepeatSendOtpByPhoneConstraint } from '../decorators/class-validator/verify/repeatCode-phone';
import { RepeatSendOtpByEmailConstraint } from '../decorators/class-validator/verify/repeatCode-email';
import { ApiProperty } from '@nestjs/swagger';

export class RepeatSendCode {
  @ApiProperty({ required: false, example: 'john1995@gmail.com' })
  @ValidateIf((o) => !o.phone)
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Length(8, 32, {
    message: 'The length must be min 8, max 32',
  })
  @Validate(RepeatSendOtpByEmailConstraint)
  email: string;

  @ApiProperty({ required: false, example: '+380735433445' })
  @ValidateIf((o) => !o.email)
  @IsDefined()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('UA', {
    message: 'Phone number must be a valid Ukrainian phone number.',
  })
  @Validate(RepeatSendOtpByPhoneConstraint)
  phone: string;

  @ApiProperty({ required: true, example: 'email' })
  @IsEnum(RegistrationMethod)
  @IsDefined()
  @IsNotEmpty()
  registrationMethod: RegistrationMethod;
}
