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
import { SingInByEmailConstraint } from '../decorators/class-validator/singIn/signInByEmail';
import { IsPasswordsMatchingConstraint } from '../decorators/class-validator/singIn/isPasswordsMatching';
import { Transform } from 'class-transformer';
import { RegistrationMethod } from '../enums/registMethod-enum';
import { SingInByPhoneConstraint } from '../decorators/class-validator/singIn/singInByPhone';
import { ApiProperty } from '@nestjs/swagger';

export class SingInAuthDto {
  @ApiProperty({ required: false, example: 'John' })
  @IsOptional()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @Length(2, 32)
  name?: string;

  @ApiProperty({ required: false, example: 'Cena' })
  @IsOptional()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @Length(2, 32)
  lastname?: string;

  @ApiProperty({ required: false, example: 'john1995@gmail.com' })
  @ValidateIf((o) => !o.numbers)
  @IsDefined()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Length(8, 32, {
    message: 'The length must be min 8, max 32',
  })
  @Validate(SingInByEmailConstraint)
  email: string;

  @ApiProperty({ required: false, example: '+380735433445' })
  @ApiProperty({ required: false })
  @ValidateIf((o) => !o.email)
  @IsDefined()
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('UA', {
    message: 'Phone number must be a valid Ukrainian phone number.',
  })
  @Validate(SingInByPhoneConstraint)
  numbers: string;

  @ApiProperty({ required: true, example: 'Example12345!' })
  @IsDefined()
  @IsString()
  @Length(8, 32)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!/\_@#$%^&*()]).{8,}$/, {
    message:
      'Password must contain at least 1 uppercase letter, 1 number, and 1 symbol: ?=.[!/_@#$%^&()]',
  })
  password: string;

  @ApiProperty({ required: true, example: 'Example12345!' })
  @IsDefined()
  @IsString()
  @Length(8, 32)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!/\_@#$%^&*()]).{8,}$/, {
    message:
      'Password repeat must contain at least 1 uppercase letter, 1 number, and 1 symbol: ?=.[!/_@#$%^&()]',
  })
  @Validate(IsPasswordsMatchingConstraint)
  passwordRepeat: string;

  @ApiProperty({ required: true, example: 'email' })
  @IsDefined()
  @IsEnum(RegistrationMethod)
  @IsNotEmpty()
  registrationMethod: RegistrationMethod;
}
