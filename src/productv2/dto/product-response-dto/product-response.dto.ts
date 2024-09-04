export class UserResponseDto {
  id: string;
  email: string;
  phone: string;
  company: string;
  fullName: string;
}

export class DesignResponseDto {
  id: number;
  designName: string;
  urlImage: string;
}

export class PriceTierResponseDto {
  id: number;
  minQuantity: number;
  price: number;
}

export class ProductResponseDto {
  id: number;
  title: string;
  category: string;
  subCategory: string;
  provider: string;
  priceToBuy: number;
  desing: DesignResponseDto[];
  priceTiers: PriceTierResponseDto[];
  user: UserResponseDto;
}
