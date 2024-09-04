import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
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
  ValidateIf,
} from 'class-validator';
import { LoginByEmail } from 'src/auth/decorators/constraint/login/loginByEmail';
import { LoginByPhone } from 'src/auth/decorators/constraint/login/loginByPhone';
import { RegistrationMethod } from 'src/auth/enums/registMethod-enum';

export class LoginAuthDto {
  @ApiProperty({ required: false, example: 'john1995@gmail.com' })
  @ValidateIf((o) => !o.phone)
  @LoginByEmail({ message: 'Bad Request' })
  @Transform(({ value }) => value.trim())
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  @Length(8, 32, {
    message: 'The length must be min 8, max 32',
  })
  email: string;

  @ApiProperty({ required: false, example: '+380735433445' })
  @ValidateIf((o) => !o.email)
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsOptional()
  @IsPhoneNumber('UA', {
    message: 'Phone number must be a valid Ukrainian phone number.',
  })
  @LoginByPhone({ message: 'Bad Request' })
  phone: string;

  @ApiProperty({ required: true, example: 'Example12345!' })
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  @Length(8, 32)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!/\_@#$%^&*()]).{8,}$/, {
    message:
      'must contain at least 1 uppercase letter, 1 number, and 1 symbol: ?=.[!/_@#$%^&()',
  })
  password: string;

  @ApiProperty({ required: true, example: 'email' })
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsEnum(RegistrationMethod)
  @IsDefined()
  @IsNotEmpty()
  registrationMethod: RegistrationMethod;
}
