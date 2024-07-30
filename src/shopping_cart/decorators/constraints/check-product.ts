import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ProductRepository } from 'src/product/repositories/product.repository';

@ValidatorConstraint({ async: true })
export class CheckProductConstraint implements ValidatorConstraintInterface {
  constructor(private readonly productRepository: ProductRepository) {}
  async validate(productId: number, args: ValidationArguments) {
    const product = await this.productRepository.findProductById(productId);

    if (!product) return false;
    if (product.inventory.quantity < args.object['quantity']) return false;
    return true;
  }
  defaultMessage(args: ValidationArguments) {
    return 'The product not found or The amount of product is not enough';
  }
}
export function CheckProduct(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: CheckProductConstraint,
    });
  };
}
