
export type Food = {
  _id: string;
  foodName: string;
  price: number;
  image: string;
  ingredients: string; 
  categoryName?: string; 
};


export type CartItem = {
  foodId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  ingredients?: string[]; 
};


export type Category = {
  _id: string;
  categoryName: string;
};
