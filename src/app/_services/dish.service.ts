import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, combineLatest, forkJoin, map, Observable, pipe, take } from 'rxjs';
import { Dish, DishExport } from '../_models/dish';
import { Ingredient } from '../_models/ingredient';
import { UncalculatedDish } from '../_models/uncalculatedDish';
import { IngredientService } from './ingredient.service';
import { defaultProperties, Properties, propertiesKeys } from '../_models/properties';
import { SnackbarHelperService } from '../_helpers/snackbar.helper';
import { AuthService } from './auth.service';
import { User } from '../_models/user';
import { Router } from '@angular/router';
import { DishPagedResult } from '../main/dishes/dishes.component';

export function dynamicSort(property: string) {
  var sortOrder = 1;
  if(property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
  }
  let type = 'main';
  if(property !== 'name'){
    type = 'sub';
  }

  if(type === 'main'){
    return function (a: any,b: any) {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  } else {
    return function (a: any,b: any) {
      var result = (a.properties[property] > b.properties[property]) ? -1 : (a.properties[property] < b.properties[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }

}

@Injectable({
  providedIn: 'root'
})
export class DishService implements OnInit{

  private breakfastStore: Dish[] = [];
  public _breakfasts = new BehaviorSubject<Dish[]>([]);
  public _pagedBreakfasts = new BehaviorSubject<DishPagedResult>({});
  private mealStore: Dish[] = [];
  public _meals = new BehaviorSubject<Dish[]>([]);
  public _pagedMeals = new BehaviorSubject<DishPagedResult>({});
  private snackStore: Dish[] = [];
  public _snacks = new BehaviorSubject<Dish[]>([]);
  public _pagedSnacks= new BehaviorSubject<DishPagedResult>({});

  constructor(private router: Router ,private store: AngularFirestore, private authService: AuthService, private snackbar: SnackbarHelperService, private ingredientService: IngredientService) {}

  ngOnInit(): void {

  }

  public loadAll() {
    return combineLatest([
      this.store.collection<Dish>('breakfast', ref => ref.orderBy('name')).valueChanges(),
      this.store.collection<Dish>('meal', ref => ref.orderBy('name')).valueChanges(),
      this.store.collection<Dish>('snack', ref => ref.orderBy('name')).valueChanges()])
      .subscribe((data: [Dish[], Dish[], Dish[]]) => {
        this.breakfastStore = data[0];
        this.mealStore = data[1];
        this.snackStore = data[2];
      });
  }

  public load(): Promise<any> {
    return new Promise((resolve, reject) => {
      combineLatest([
        this.store.collection<Dish>('breakfast', ref => ref.orderBy('name')).valueChanges(),
        this.store.collection<Dish>('meal', ref => ref.orderBy('name')).valueChanges(),
        this.store.collection<Dish>('snack', ref => ref.orderBy('name')).valueChanges()])
        .subscribe((data: [Dish[], Dish[], Dish[]]) => {
          this.breakfastStore = data[0];
          this.mealStore = data[1];
          this.snackStore = data[2];
          resolve(true);
        });
  });
}

  getDishes(dishType: string ,orderBy: string, filter: string): Observable<Dish[]> {
    if(dishType === 'breakfast'){
      this._breakfasts.next(this.breakfastStore);
      return this._breakfasts.asObservable();
    } else if(dishType === 'snack'){
      this._snacks.next(this.snackStore);
      return this._snacks.asObservable();
    } else {
      this._meals.next(this.mealStore);
      return this._meals.asObservable();
    }
  }

  getDishesPaged (dishType: string ,skip: number, take: number, orderBy: string, filter: string): Observable<DishPagedResult> {

      if(dishType === 'breakfast'){
        this._pagedBreakfasts.next({
          entities: this.breakfastStore.sort(dynamicSort(orderBy)).slice(skip),
          totalEntities: this.breakfastStore.length,
          skip: skip,
          take: take,
          page: (skip + take) / take,
          maxPages: Math.ceil((this.breakfastStore.length / take))
        })
        return this._pagedBreakfasts.asObservable();
      } else if(dishType === 'snack'){
        this._pagedSnacks.next({
          entities: this.snackStore.sort(dynamicSort(orderBy)).slice(skip),
          totalEntities: this.snackStore.length,
          skip: skip,
          take: take,
          page: (skip + take) / take,
          maxPages: Math.ceil((this.snackStore.length / take))
        })
        return this._pagedSnacks.asObservable();
      } else {
        this._pagedMeals.next({
          entities: this.mealStore.sort(dynamicSort(orderBy)).slice(skip, skip + take),
          totalEntities: this.mealStore.length,
          skip: skip,
          take: take,
          page: (skip + take) / take,
          maxPages: Math.ceil((this.mealStore.length / take))
        })
        return this._pagedMeals.asObservable();
      }

  }

  getDishesAllTypes(): Observable<[Dish[], Dish[], Dish[]]> {
    return combineLatest([this.getDishes('breakfast', 'name', ''), this.getDishes('meal', 'name', ''), this.getDishes('snack', 'name', '')]);
  }

  createOrUpdateDish(dishType: string ,prepDish: UncalculatedDish, mode: string, user: User): void {

    let searchIngredients: string[] = [];
    const ingredientMap: Map<string, number> = prepDish.ingredients;
    let dishToUpdateId: string = "";

    let exportIngredients: {name: string; value: number}[] = [];
    let likes: {userName: string, userId: string, userProfileImage: string}[] = [];
    let comments: {user: string; comment: string; userImage: string; userId: string; date: string}[] = [];

    if(mode === 'update'){
      const dishToUpdate = this.getDish(dishType, prepDish.name);
      if(dishToUpdate){
        dishToUpdateId = dishToUpdate.dishId;
        likes = dishToUpdate.likes;
        comments = dishToUpdate.comments;
      }
    }

    for (let [name, value] of ingredientMap) {
      searchIngredients.push(name);
      exportIngredients.push({name: name, value: value});
    }

    let searchlength = searchIngredients.length;
    let ingredients = this.ingredientService.getIngredientsArray(searchIngredients);

    if(ingredients.length === searchlength){
      this.handleIngredients(dishType, prepDish, mode, user, ingredients, ingredientMap, dishToUpdateId, comments, likes, exportIngredients);
    }
  }

  private handleIngredients(
    dishType: string ,prepDish: UncalculatedDish, mode: string, user: User, ingredients: Ingredient[],
    ingredientMap: Map<string, number>, dishToUpdateId: string, comments: {user: string; comment: string; userImage: string; userId: string; date: string}[],
    likes: {userName: string, userId: string, userProfileImage: string}[], exportIngredients: {name: string; value: number}[]){

    let properties: Properties = JSON.parse(JSON.stringify(defaultProperties));
    let keys = propertiesKeys;

    if(ingredients && ingredients.length > 0){
      ingredients.forEach((ingredient: Ingredient) => {
        keys.forEach((key: string) => {
          const quantity = ingredientMap.get(ingredient.name)
          if(quantity !== undefined){
            properties[key as keyof Properties] += ingredient.properties[key as keyof Properties] * quantity / 100;
          }
        });
      })

      if(mode === 'add'){
        this.store.collection<DishExport>(dishType).add({...prepDish, ingredients: exportIngredients ,likes: likes, comments: comments, properties: properties, dishId: ""}).then((result: any) => {
          this.store.collection<DishExport>(dishType).doc(result.id).update({...prepDish, ingredients: exportIngredients ,likes: likes, comments: comments, properties: properties, dishId: result.id});
          if(dishType === 'breakfast'){
            this.breakfastStore.push({...prepDish, ingredients: exportIngredients ,likes: likes, comments: comments, properties: properties, dishId: result.id})
            this._breakfasts.next(this.breakfastStore);
          } else if(dishType === 'snack'){
            this.snackStore.push({...prepDish, ingredients: exportIngredients ,likes: likes, comments: comments, properties: properties, dishId: result.id})
            this._snacks.next(this.snackStore);
          } else {
            this.mealStore.push({...prepDish, ingredients: exportIngredients ,likes: likes, comments: comments, properties: properties, dishId: result.id})
            this._meals.next(this.mealStore);
          }
          this.snackbar.createSuccessNotification("Dish created")
          this.authService.UserCreatedADish(user, result.id, prepDish.name, prepDish.imagePath)
        }).catch((e: any) => {
          this.snackbar.createErrorNotification("Error creating dish, check console");
          console.log(e);
        });
      } else if(mode === 'update' && dishToUpdateId){
        this.store.collection<DishExport>(dishType).doc(dishToUpdateId).update({...prepDish, ingredients: exportIngredients ,likes: likes, comments: comments, properties: properties}).then((result: any) => {
          this.snackbar.createSuccessNotification("Dish updated")
        }).catch((e: any) => {
          this.snackbar.createErrorNotification("Error updating dish, check console");
          console.log(e);
        });;
      }
    }
  }

  getDish(dishType: string ,dishName: string): Dish | undefined {

    if(dishType === 'breakfast'){
      return this.breakfastStore.find((d: Dish) => d.name === dishName);
    } else if(dishType === 'snack'){
      return this.snackStore.find((d: Dish) => d.name === dishName);
    } else {
      return this.mealStore.find((d: Dish) => d.name === dishName);
    }
  }

  getDishById(dishType: string ,dishId: string): Dish | undefined {
    if(dishType === 'breakfast'){
      return this.breakfastStore.find((d: Dish) => d.dishId === dishId);
    } else if(dishType === 'snack'){
      return this.snackStore.find((d: Dish) => d.dishId === dishId);
    } else {
      return this.mealStore.find((d: Dish) => d.dishId === dishId);
    }
  }

  deleteDish(dishType: string ,dishId: string, user: User): void{
    this.store.collection(dishType).doc(dishId).delete().then(() => {
      this.snackbar.createSuccessNotification("Deleted the dish");
      if(dishType === 'breakfast'){
        let index = this.breakfastStore.findIndex((d: Dish) => d.dishId === dishId);
        if(index !== -1){
          this.breakfastStore.splice(index, 1);
          this._breakfasts.next(this.breakfastStore);
        }
      } else if(dishType === 'snack'){
        let index = this.snackStore.findIndex((d: Dish) => d.dishId === dishId);
        if(index !== -1){
          this.snackStore.splice(index, 1);
          this._snacks.next(this.snackStore);
        }
      } else {
        let index = this.mealStore.findIndex((d: Dish) => d.dishId === dishId);
        if(index !== -1){
          this.mealStore.splice(index, 1);
          this._meals.next(this.mealStore);
        }
      }
      this.router.navigateByUrl(`/${dishType}s?type=${dishType}`);
    }).catch((e: any) => {
      this.snackbar.createErrorNotification("Failed deleting the dish, check console");
      console.log(e);
    });
    this.authService.UserDeletedADish(user, dishId);
  }

  likeDish(dishType: string ,dish: Dish, user: User): void{
    let likes: {userName: string, userId: string, userProfileImage: string}[] = [];
    if(dish && dish.dishId){
      likes = dish.likes;
      const likeIndex = likes.findIndex((like: {userName: string, userId: string, userProfileImage: string}) => like.userId === user.uid);
      if(likeIndex !== -1){
        likes.splice(likeIndex, 1);
        this.authService.UserUnlikedADish(user, dishType, dish.dishId);
      } else {
        likes.push({userName: user.displayName, userId: user.uid, userProfileImage: user.profilePicturePath});
        this.authService.UserLikedADish(user, dishType, dish.dishId, dish.name, dish.imagePath);
      }
      this.store.collection<DishExport>(dishType).doc(dish.dishId).update({...dish, likes: likes})
    }
  }
  commentDish(dishType: string ,dish: Dish, comment: string, user: User ,mode: string): void{
    let comments: {user: string; comment: string; userImage: string; userId: string; date: string}[] = [];
    if(dish.dishId && dish){
      comments = dish.comments;
      if(mode === 'delete'){
        let commentToDeleteIndex = comments.findIndex((commentEntry: {user: string; comment: string; userImage: string; userId: string; date: string}) =>
          commentEntry.user === user.displayName && commentEntry.comment === comment && commentEntry.userId === user.uid)
        if(commentToDeleteIndex !== -1){
          comments.splice(commentToDeleteIndex, 1);
          this.authService.UserDeletedAComment(user, dish.dishId, dish.name, comment);
        }
      } else if(mode === 'add'){
        const date = new Date();
        comments.push({user: user.displayName, comment: comment, userImage: user.profilePicturePath, userId: user.uid, date: date.toLocaleDateString()});
        this.authService.UserAddedAComment(user, dish.dishId, dish.name, comment, dishType);
      }
      this.store.collection<DishExport>(dishType).doc(dish.dishId).update({...dish, comments: comments})
    }

  }
}
