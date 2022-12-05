import { Properties } from "./properties";

export interface Ingredient {
  name: string;
  imagePath: string;
  type: string;
  properties: Properties;
  conversion: number;
  conversionType: string;
}
