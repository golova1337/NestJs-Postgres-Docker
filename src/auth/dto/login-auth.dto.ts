import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  Validate,
  ValidateIf,
} from 'class-validator';
import { LoginByEmailConstraint } from '../decorators/class-validator/login/loginByEmail';
import { Transform } from 'class-transformer';
import { LoginByPhoneConstraint } from '../decorators/class-validator/login/loginByPhone';
import { RegistrationMethod } from '../enums/registMethod-enum';
import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthDto {
  @ApiProperty({ required: false, example: 'john1995@gmail.com' })
  @ValidateIf((o) => !o.phone)
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Length(8, 32, {
    message: 'The length must be min 8, max 32',
  })
  @Validate(LoginByEmailConstraint)
  email: string;

  @ApiProperty({ required: false, example: '+380735433445' })
  @ValidateIf((o) => !o.email)
  @IsOptional()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('UA', {
    message: 'Phone number must be a valid Ukrainian phone number.',
  })
  @Matches(/^[0-9+]+$/, {
    message: 'Phone must contain only  numbers and plus',
  })
  @Validate(LoginByPhoneConstraint)
  phone: string;

  @ApiProperty({ required: true, example: 'Example12345!' })
  @IsDefined()
  @IsString()
  @Length(8, 32)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!/\_@#$%^&*()]).{8,}$/, {
    message:
      'must contain at least 1 uppercase letter, 1 number, and 1 symbol: ?=.[!/_@#$%^&()',
  })
  password: string;

  @ApiProperty({ required: true, example: 'email' })
  @IsEnum(RegistrationMethod)
  @IsDefined()
  @IsNotEmpty()
  registrationMethod: RegistrationMethod;
}
