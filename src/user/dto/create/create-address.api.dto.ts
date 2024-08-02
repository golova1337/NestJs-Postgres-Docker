import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressAnswerDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the address',
  })
  id: number;

  @ApiProperty({ example: 1, description: 'The unique identifier of the user' })
  userId: number;

  @ApiProperty({ example: 'Ukrain', description: 'The country of the address' })
  country: string;

  @ApiProperty({
    example: 'Zaporizhzhia',
    description: 'The city of the address',
  })
  city: string;

  @ApiProperty({
    example: 'Soborny Avenue',
    description: 'The street of the address',
  })
  street: string;

  @ApiProperty({
    example: '69061',
    description: 'The postal code of the address',
  })
  postal_code: string;

  @ApiProperty({
    example: '12G',
    description: 'The house number of the address',
  })
  house: string;

  @ApiProperty({
    example: null,
    description: 'The apartment number of the address',
    nullable: true,
  })
  apartment?: string;

  @ApiProperty({
    example: null,
    description: 'The phone number associated with the address',
    nullable: true,
  })
  phone?: string;

  @ApiProperty({
    example: '2024-07-08T12:08:34.658Z',
    description: 'The date and time the address was last updated',
  })
  updatedAt: string;

  @ApiProperty({
    example: '2024-07-08T12:08:34.658Z',
    description: 'The date and time the address was created',
  })
  createdAt: string;
}
