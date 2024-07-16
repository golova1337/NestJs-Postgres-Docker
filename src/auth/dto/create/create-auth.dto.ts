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
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { SingInByPhoneConstraint } from 'src/auth/decorators/class-validator/singIn/singInByPhone';
import { SingInByEmailConstraint } from 'src/auth/decorators/class-validator/singIn/signInByEmail';
import { IsPasswordsMatchingConstraint } from 'src/auth/decorators/class-validator/singIn/isPasswordsMatching';
import { RegistrationMethod } from 'src/auth/enums/registMethod-enum';

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
  @ValidateIf((o) => !o.phone)
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
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @ValidateIf((o) => !o.email)
  @IsDefined()
  @IsString()
  @IsPhoneNumber('UA', {
    message: 'Phone number must be a valid Ukrainian phone number.',
  })
  @Matches(/^[0-9+]+$/, {
    message: 'Phone must contain only  numbers and plus',
  })
  @Validate(SingInByPhoneConstraint)
  phone?: string;

  @ApiProperty({ required: true, example: 'Example12345!' })
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  @Length(8, 32)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!/\_@#$%^&*()]).{8,}$/, {
    message:
      'Password must contain at least 1 uppercase letter, 1 number, and 1 symbol: ?=.[!/_@#$%^&()]',
  })
  password?: string;

  @ApiProperty({ required: true, example: 'Example12345!' })
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
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
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsDefined()
  @IsEnum(RegistrationMethod)
  @IsNotEmpty()
  registrationMethod: RegistrationMethod;
}
