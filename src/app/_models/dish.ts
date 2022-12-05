import { Properties } from "./properties";

export interface Dish {
  name: string;
  dishId: string;
  description: string;
  creator: string;
  creatorId: string;
  tags: string[];
  imagePath: string;
  likes: {userName: string, userId: string, userProfileImage: string}[]; // Empty at creation ref: see UncalculatedDish model
  comments: {user: string; comment: string; userImage: string; userId: string; date: string}[]; // Empty at creation ref: see UncalculatedDish model
  createdAt: string;
  link: string;
  instructions: string[];
  type: string;
  preptime: number;
  cooktime: number;
  properties: Properties; // Calculated at creation ref: see UncalculatedDish model
  ingredients: {name: string, value: number}[];
  docId?: string;
}

export interface DishExport {
  name: string;
  dishId: string;
  description: string;
  creator: string;
  creatorId: string;
  tags: string[];
  imagePath: string;
  likes: {userName: string, userId: string, userProfileImage: string}[]; // Empty at creation ref: see UncalculatedDish model
  comments: {user: string; comment: string; userImage: string; userId: string; date: string}[]; // Empty at creation ref: see UncalculatedDish model
  createdAt: string;
  link: string;
  instructions: string[];
  type: string;
  preptime: number;
  cooktime: number;
  properties: Properties; // Calculated at creation ref: see UncalculatedDish model
  ingredients: {name: string, value: number}[];
}
