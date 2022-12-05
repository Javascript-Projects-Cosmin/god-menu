import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { reverse } from '@cloudinary/url-gen/actions/effect';
import { combineLatest, take } from 'rxjs';
import { SnackbarHelperService } from 'src/app/_helpers/snackbar.helper';
import { Dish } from 'src/app/_models/dish';
import { Ingredient } from 'src/app/_models/ingredient';
import { User } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { DishService } from 'src/app/_services/dish.service';
import { IngredientService } from 'src/app/_services/ingredient.service';
import { SidebarService } from 'src/app/_services/sidebar.service';

@Component({
  selector: 'app-dish-detail',
  templateUrl: './dish-detail.component.html',
  styleUrls: ['./dish-detail.component.scss']
})
export class DishDetailComponent implements OnInit {

  public dish: Dish | undefined = undefined;
  public dishId:string = "";
  public shownLikes: {userName: string, userId: string, userProfileImage: string}[] | undefined = undefined;
  public activeUser: User | undefined = undefined;
  public dishType: string = '';
  public ingredients: {ingredient: Ingredient; quantity: number}[] = [];
  public userComment: string = '';

  constructor(
    private dishService: DishService,
    private route: ActivatedRoute,
    private router: Router,
    private ingredientService: IngredientService,
    public authService: AuthService,
    private snackbar: SnackbarHelperService,
    public sidebarService: SidebarService,
  ) { }

  async ngOnInit() {
    this.route.queryParams.pipe(take(1)).subscribe(params => { this.dishType = params['type'];});
    if (['breakfast', 'snack', 'meal'].includes(this.dishType)){
      await this.initData();
      this.authService.getUserData.subscribe((data: User) => {
        if(data !== undefined){
          this.activeUser = data;
        } else {
          this.activeUser = undefined;
        }
      })
    }
  }

  private async initData() {
    this.route.params.pipe(take(1)).subscribe(params => {
      this.dishId = params['id'];
    })
    this.dish = this.dishService.getDishById(this.dishType, this.dishId);
    if(this.dish){
        if(this.dish.likes.length > 3){
          this.shownLikes = this.dish.likes.reverse().slice(0, 3);
        }
        if(this.dish.comments.length > 5){
          this.dish.comments = this.dish.comments.reverse().slice(0,5);
        } else {
          this.dish.comments = this.dish.comments.reverse();
        }
        if(this.dish && this.dish.ingredients){
          let searchIngredients: string[] = [];
          this.dish.ingredients.forEach((ing: {name: string, value: number}) => {
            searchIngredients.push(ing.name);
          });

          let searchlength = searchIngredients.length;
          let data = this.ingredientService.getIngredientsArray(searchIngredients);

          this.ingredients = [];
          if(data.length === searchlength){
            data.forEach((ing: Ingredient) => {
              let searchedEl = this.dish?.ingredients.find((el: {name: string, value: number}) => el.name === ing.name);
              if(searchedEl){
                this.ingredients.push({ingredient: ing, quantity: searchedEl.value});
              }
            })
          }
          // if(searchIngredients.length < 10){
          //   this.ingredientService.getIngredientsArray(searchIngredients).pipe(take(1)).subscribe((data: Ingredient[]) => {
          //     this.ingredients = [];
          //     if(data.length === searchlength){
          //       data.forEach((ing: Ingredient) => {
          //         let searchedEl = this.dish?.ingredients.find((el: {name: string, value: number}) => el.name === ing.name);
          //         if(searchedEl){
          //           this.ingredients.push({ingredient: ing, quantity: searchedEl.value});
          //         }
          //       })
          //     }
          //   })
          // } else if(searchIngredients.length >= 10 && searchIngredients.length < 20){
          //   let batches: string[][] = [];
          //   while(searchIngredients.length > 0){
          //     batches.push(searchIngredients.splice(0,9));
          //   }
          //   combineLatest([this.ingredientService.getIngredientsArray(batches[0]),this.ingredientService.getIngredientsArray(batches[1])]).pipe(take(1)).subscribe((data: any) => {
          //     let ingredients: Ingredient[] = [];
          //     this.ingredients = [];
          //     if(data[0].length + data[1].length === searchlength){
          //       data[0].forEach((ing: Ingredient) => {ingredients.push(ing)});
          //       data[1].forEach((ing: Ingredient) => {ingredients.push(ing)});
          //       ingredients.forEach((ing: Ingredient) => {
          //         let searchedEl = this.dish?.ingredients.find((el: {name: string, value: number}) => el.name === ing.name);
          //         if(searchedEl){
          //           this.ingredients.push({ingredient: ing, quantity: searchedEl.value});
          //         }
          //       })
          //     }
          //   })
          // } else if(searchIngredients.length >= 20 && searchIngredients.length < 30){
          //   let batches: string[][] = [];
          //   while(searchIngredients.length > 0){
          //     batches.push(searchIngredients.splice(0,9));
          //   }
          //   combineLatest([
          //     this.ingredientService.getIngredientsArray(batches[0]),
          //     this.ingredientService.getIngredientsArray(batches[1]),
          //     this.ingredientService.getIngredientsArray(batches[2]),]).pipe(take(1)).subscribe((data: any) => {
          //     let ingredients: Ingredient[] = [];
          //     this.ingredients = [];
          //     if(data[0].length + data[1].length + data[2].length === searchlength){
          //       data[0].forEach((ing: Ingredient) => {ingredients.push(ing)});
          //       data[1].forEach((ing: Ingredient) => {ingredients.push(ing)});
          //       data[2].forEach((ing: Ingredient) => {ingredients.push(ing)});
          //       ingredients.forEach((ing: Ingredient) => {
          //         let searchedEl = this.dish?.ingredients.find((el: {name: string, value: number}) => el.name === ing.name);
          //         if(searchedEl){
          //           this.ingredients.push({ingredient: ing, quantity: searchedEl.value});
          //         }
          //       })
          //     }
          //   })
          // }

        }
    }
    // await this.dishService
    //   .getDishById(this.dishType, this.dishId)
    //   .subscribe((dish: Dish[]) => {
    //     this.dish = dish[0];
    //     if(dish[0].likes.length > 3){
    //       this.shownLikes = dish[0].likes.reverse().slice(0, 3);
    //     }
    //     if(dish[0].comments.length > 5){
    //       this.dish.comments = this.dish.comments.reverse().slice(0,5);
    //     } else {
    //       this.dish.comments = this.dish.comments.reverse();
    //     }
    //     if(this.dish && this.dish.ingredients){
    //       let searchIngredients: string[] = [];
    //       this.dish.ingredients.forEach((ing: {name: string, value: number}) => {
    //         searchIngredients.push(ing.name);
    //       });

    //       let searchlength = searchIngredients.length;

    //       if(searchIngredients.length < 10){
    //         this.ingredientService.getIngredientsArray(searchIngredients).pipe(take(1)).subscribe((data: Ingredient[]) => {
    //           this.ingredients = [];
    //           if(data.length === searchlength){
    //             data.forEach((ing: Ingredient) => {
    //               let searchedEl = this.dish?.ingredients.find((el: {name: string, value: number}) => el.name === ing.name);
    //               if(searchedEl){
    //                 this.ingredients.push({ingredient: ing, quantity: searchedEl.value});
    //               }
    //             })
    //           }
    //         })
    //       } else if(searchIngredients.length >= 10 && searchIngredients.length < 20){
    //         let batches: string[][] = [];
    //         while(searchIngredients.length > 0){
    //           batches.push(searchIngredients.splice(0,9));
    //         }
    //         combineLatest([this.ingredientService.getIngredientsArray(batches[0]),this.ingredientService.getIngredientsArray(batches[1])]).pipe(take(1)).subscribe((data: any) => {
    //           let ingredients: Ingredient[] = [];
    //           this.ingredients = [];
    //           if(data[0].length + data[1].length === searchlength){
    //             data[0].forEach((ing: Ingredient) => {ingredients.push(ing)});
    //             data[1].forEach((ing: Ingredient) => {ingredients.push(ing)});
    //             ingredients.forEach((ing: Ingredient) => {
    //               let searchedEl = this.dish?.ingredients.find((el: {name: string, value: number}) => el.name === ing.name);
    //               if(searchedEl){
    //                 this.ingredients.push({ingredient: ing, quantity: searchedEl.value});
    //               }
    //             })
    //           }
    //         })
    //       } else if(searchIngredients.length >= 20 && searchIngredients.length < 30){
    //         let batches: string[][] = [];
    //         while(searchIngredients.length > 0){
    //           batches.push(searchIngredients.splice(0,9));
    //         }
    //         combineLatest([
    //           this.ingredientService.getIngredientsArray(batches[0]),
    //           this.ingredientService.getIngredientsArray(batches[1]),
    //           this.ingredientService.getIngredientsArray(batches[2]),]).pipe(take(1)).subscribe((data: any) => {
    //           let ingredients: Ingredient[] = [];
    //           this.ingredients = [];
    //           if(data[0].length + data[1].length + data[2].length === searchlength){
    //             data[0].forEach((ing: Ingredient) => {ingredients.push(ing)});
    //             data[1].forEach((ing: Ingredient) => {ingredients.push(ing)});
    //             data[2].forEach((ing: Ingredient) => {ingredients.push(ing)});
    //             ingredients.forEach((ing: Ingredient) => {
    //               let searchedEl = this.dish?.ingredients.find((el: {name: string, value: number}) => el.name === ing.name);
    //               if(searchedEl){
    //                 this.ingredients.push({ingredient: ing, quantity: searchedEl.value});
    //               }
    //             })
    //           }
    //         })
    //       }

    //     }
    //   });
  }

  public deleteDish() {
    if(this.activeUser){
      this.dishService.deleteDish(this.dishType , this.dishId, this.activeUser);
    }
  }

  public likeDish(){
    if(this.activeUser && this.activeUser.displayName && this.activeUser.uid && this.activeUser.profilePicturePath && this.dish){
      this.dishService.likeDish(this.dishType , this.dish, this.activeUser)
    }
  }

  public userLiked(): boolean{
    if(this.activeUser && this.dish){
      return this.dish.likes.find((like: {userName: string, userId: string, userProfileImage: string}) => like.userId === this.activeUser?.uid) !== undefined;
    }
    return false;
  }

  public userIsOwner(): boolean{
    if(this.activeUser && this.dish){
      return this.dish.creatorId === this.activeUser.uid;
    }
    return false;
  }

  public inUserFridge(ingredientName: string): number{
    if(this.activeUser && this.activeUser.fridge){
      let ingredient = this.activeUser.fridge.find((ing: {ingredient: string, quantity: number}) => ing.ingredient === ingredientName);
      if(ingredient !== undefined){
        return ingredient.quantity;
      }
      return 0;
    }
    return 0;
  }

  public addComment() {
    if(this.userComment === "" || !this.userComment || !this.activeUser){
      this.snackbar.createErrorNotification("Comment cannot be empty or invalid");
    } else {
      if(this.dish){
        this.dishService.commentDish(this.dishType, this.dish, this.userComment, this.activeUser, 'add');
      }
    }
  }

  public deleteComment(comm: string){
    if(this.dish && this.activeUser){
      this.dishService.commentDish(this.dishType, this.dish, comm, this.activeUser ,'delete')
    }
  }

  public calculateBar(dishValue: number, targetValue: number): number{
    const calculatedValue: number = (dishValue / targetValue) * 100;
    if(calculatedValue >= 100){
      return 100;
    } else {
      return Math.trunc(calculatedValue);
    }
  }
}
