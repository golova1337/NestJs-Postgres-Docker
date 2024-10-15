import { LoginByEmailConstraint } from './login/loginByEmail';
import { LoginByPhoneConstraint } from './login/loginByPhone';
import { IsPasswordsMatchingConstraint } from './singIn/isPasswordsMatching';
import { SingInByEmailConstraint } from './singIn/signInByEmail';
import { SingInByPhoneConstraint } from './singIn/singInByPhone';
import { RepeatSendOtpByEmailConstraint } from './verify/repeat-code-email.constraint';
import { RepeatSendOtpByPhoneConstraint } from './verify/repeat-code-phone.constraint';

export const Constraint = [
  SingInByEmailConstraint,
  SingInByPhoneConstraint,

  LoginByEmailConstraint,
  LoginByPhoneConstraint,

  IsPasswordsMatchingConstraint,

  RepeatSendOtpByPhoneConstraint,
  RepeatSendOtpByEmailConstraint,
];
