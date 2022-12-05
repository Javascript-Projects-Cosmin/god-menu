import { Necessities } from "./necessities";

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
  fridge: {
    ingredient: string;
    quantity: number;
  }[];
  age: number;
  weight: number;
  height: number;
  activity: number;
  gender: string;
  necessities: Necessities,
  favoriteBreakfasts: {dishId: string; dishName: string; dishImage: string;}[];
  favoriteMeals: {dishId: string; dishName: string; dishImage: string;}[];
  favoriteSnacks: {dishId: string; dishName: string; dishImage: string;}[];
  createdDishes: {dishId: string; dishName: string; dishImage: string;}[];
  comments: {dishId: string, dishName: string, comment: string, date: string, dishType: string}[];
  profilePicturePath: string;
  docId?: string;
}
