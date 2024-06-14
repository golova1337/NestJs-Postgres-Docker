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
import { RepeatSendCodeByPhoneConstraint } from '../decorators/class-validator/verify/repeatCode-phone';
import { RepeatSendCodeByEmailConstraint } from '../decorators/class-validator/verify/repeatCode-email';
import { ApiProperty } from '@nestjs/swagger';

export class RepeatSendCode {
  @ApiProperty({ required: false, example: 'john1995@gmail.com' })
  @ValidateIf((o) => !o.numbers)
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Length(8, 32, {
    message: 'The length must be min 8, max 32',
  })
  @Validate(RepeatSendCodeByEmailConstraint)
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
  @Validate(RepeatSendCodeByPhoneConstraint)
  numbers: string;

  @ApiProperty({ required: true, example: 'email' })
  @IsEnum(RegistrationMethod)
  @IsDefined()
  @IsNotEmpty()
  registrationMethod: RegistrationMethod;
}
