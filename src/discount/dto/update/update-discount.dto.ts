import { PartialType } from '@nestjs/swagger';
import { CreateDiscountDto } from '../create/create-discount.dto';

export class UpdateDiscountDto extends PartialType(CreateDiscountDto) {}
