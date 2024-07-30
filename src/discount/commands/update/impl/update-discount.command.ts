import { UpdateDiscountDto } from 'src/discount/dto/update-discount.dto';

export class UpdateDiscountCommand {
  constructor(
    public readonly id: number,
    public readonly updateDiscountDto: UpdateDiscountDto,
  ) {}
}
