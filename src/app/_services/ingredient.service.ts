import { O } from '@angular/cdk/keycodes';
import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { BehaviorSubject, combineLatest, forkJoin, Observable, of, take } from 'rxjs';
import { SnackbarHelperService } from '../_helpers/snackbar.helper';
import { Dish } from '../_models/dish';
import { Ingredient } from '../_models/ingredient';
import { UncalculatedDish } from '../_models/uncalculatedDish';

@Injectable({
  providedIn: 'root'
})
export class IngredientService implements OnInit{

  public stringIngredients: string = "";
  public stringConversions: string = "";
  public stringConversionsType: string = "";

  private dataStore: Ingredient[] = [];
  public _ingredients = new BehaviorSubject<Ingredient[]>([]);

  constructor(private store: AngularFirestore, private snackbar: SnackbarHelperService) {}

  ngOnInit(): void {

  }

  private loadAll() {
    return this.store.collection<Ingredient>('ingredient').valueChanges().subscribe((data: Ingredient[]) => {
      this.dataStore = data;
      this._ingredients.next(this.dataStore);
    })
  }

  public load(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.store.collection<Ingredient>('ingredient').valueChanges().subscribe((data: Ingredient[]) => {
        this.dataStore = data;
        this._ingredients.next(this.dataStore);
        resolve(true);
      })
    });
  }

  getIngredients(): Observable<Ingredient[]> {
    return this._ingredients.asObservable();
  }

  getIngredientsByType(type: string): Ingredient[] {
    return this.dataStore.filter(i => i.type === type);
  }

  getIngredientNames(): void {
    if(this.stringIngredients === "" && this.stringConversions === ""){
      this.store.collection<Ingredient>('ingredient').valueChanges().pipe(take(1)).subscribe((data: Ingredient[]) => {
        let names: string = data[0].name;
        let conversions: string = `${data[0].conversion}`;
        let conversionTypes: string = data[0].conversionType;
        for(let i = 1; i < data.length; i++){
          names = names + "," + data[i].name;
          conversions = conversions + "," + `${data[i].conversion}`;
          conversionTypes = conversionTypes + "," + data[i].conversionType;
        }
        this.stringIngredients = names;
        this.stringConversions = conversions;
        this.stringConversionsType = conversionTypes;
      })
    }
  }

  addIngredient(ingredient: Ingredient): void {
    this.store.collection<Ingredient>('ingredient').add({...ingredient}).then(() => {
      this.dataStore.push(ingredient);
      this.snackbar.createSuccessNotification("Created ingredient")
    }).catch((e) => {
      this.snackbar.createErrorNotification("Error creating ingredient, check console");
      console.log(e);
    });
  }

  getIngredientsArray(searchArray: string[]): Ingredient[] {
    let ingredients: Ingredient[] = [];
    searchArray.forEach((si: string) => {
      let ing = this.getIngredient(si);
      if(ing){
        ingredients.push(ing);
      }
    })
    return ingredients;
  }

  getIngredientsBySearch(searchQuery: string): Ingredient[] {
    return this.dataStore.filter((i: Ingredient) => searchQuery.includes(i.name));
  }

  getIngredient(ingredientName: string ): Ingredient | undefined {
    return this.dataStore.find((i: Ingredient) => i.name === ingredientName);
  }
}
