import { JwtPayload } from 'src/common/strategies/accessToken.strategy';

export class ReceivingAndCheckingJwtQuery {
  constructor(public readonly user: JwtPayload) {}
}
