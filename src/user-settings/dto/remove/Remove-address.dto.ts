import { IsNumberString } from 'class-validator';

export class RemoveAddressesDto {
  @IsNumberString({ no_symbols: true }, { each: true })
  ids: string[];
}
