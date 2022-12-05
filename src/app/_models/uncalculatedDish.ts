export interface UncalculatedDish {
  name: string;
  description: string;
  creator: string;
  creatorId: string;
  tags: string[];
  imagePath: string;
  createdAt: string;
  link: string;
  instructions: string[];
  type: string;
  preptime: number;
  cooktime: number;
  ingredients: Map<string, number>;
}
