import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { ProductRepository } from 'src/product/repositories/product.repository';

@ValidatorConstraint({ async: true })
export class ProductExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly productRepository: ProductRepository) {}
  async validate(id: number, args: ValidationArguments) {
    const product = await this.productRepository.findProductById(id);
    if (!product) return false;

    return true;
  }
}

export function ProductExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ProductExistsConstraint,
    });
  };
}
