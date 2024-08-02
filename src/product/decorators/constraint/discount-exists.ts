import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { DiscountRepository } from 'src/discount/repositories/discount.repository';

@ValidatorConstraint({ async: true })
export class DiscountExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly discountRepository: DiscountRepository) {}
  async validate(discountId: number, args: ValidationArguments) {
    const discount = await this.discountRepository.findOne(discountId);

    if (!discount) return false;
    return true;
  }
}

export function DiscountExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: DiscountExistsConstraint,
    });
  };
}
