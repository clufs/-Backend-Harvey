export interface Design {
  talle: string;
  color: string;
  imageUrl: string;
  sizes: {
    [size: string]: number;
  };
}

export interface ModalTShirt {
  price: number;
  sell: number;
  designs: Design[];
}
