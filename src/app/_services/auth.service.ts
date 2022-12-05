import { Injectable, NgZone } from '@angular/core';
import { User } from '../_models/user';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { defaultNecessities, Necessities } from '../_models/necessities';
import { Observable, take, of, BehaviorSubject} from 'rxjs';
import { SnackbarHelperService } from '../_helpers/snackbar.helper';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any = undefined; // Save logged in user data
  public getUserData = new BehaviorSubject<any>(this.userData);
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public snackbar: SnackbarHelperService,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user !== null) {
        this.afs.collection<User>('users', ref => ref.where('uid', '==' ,user.uid)).valueChanges({ idField: 'docId' }).pipe(take(1)).subscribe((data: User[]) =>{
          this.snackbar.createSuccessNotification("User logged in from firebase");
          this.userData = data[0];
          this.getUserData.next(this.userData);
          if(this.router.url === '/sign-in' || this.router.url === '/'){
            this.router.navigate(['/profile'])
          }
          localStorage.setItem('user', JSON.stringify(this.userData));
          JSON.parse(localStorage.getItem('user')!);
        });
      } else {
        this.snackbar.createSuccessNotification("User logged out");
        localStorage.setItem('user', 'null');
        this.userData = undefined;
        this.getUserData.next(this.userData);
        this.router.navigate(['/sign-in'])
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        if(result.user){
          //this.SetUserData('sign-in' ,result.user);
          this.snackbar.createSuccessNotification("Successful login");
          this.afAuth.authState.subscribe((user) => {
            if (user) {
              this.router.navigate(['profile']);
            }
          });
        }
      })
      .catch((error) => {
        this.snackbar.createErrorNotification("Something went wrong with the login, check console");
        console.log(error);
      });
  }
  // Sign up with email/password
  SignUp(email: string, password: string, activity: number, age: number, gender: string,
    height: number, name: string, weight: number, profilePicturePath: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        if(result.user !== null && result.user !== undefined && result.user.email){
          /* Call the SendVerificaitonMail() function when new user sign
          up and returns promise */
          this.SendVerificationMail();
          /* Calculate profile to create it */
          const calculatedNec: Necessities = this.CalculateNec(gender, age, activity, weight, height);

          let user: User = {
            uid: result.user.uid,
            email: result.user.email,
            photoURL: result.user.photoURL ? result.user.photoURL : '',
            emailVerified: result.user.emailVerified,
            displayName: name,
            fridge: [],
            age: age,
            weight: weight,
            height: height,
            activity: activity,
            gender: gender,
            profilePicturePath: profilePicturePath,
            favoriteBreakfasts: [],
            favoriteMeals: [],
            favoriteSnacks: [],
            createdDishes: [],
            comments: [],
            necessities: calculatedNec
          }
          this.SetUserData('sign-up' ,user);
        }
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }
  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-mail-address']);
      });
  }
  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        this.snackbar.createSuccessNotification('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        this.snackbar.createErrorNotification("Something went wrong with the mail, check console")
        console.log(error);
      });
  }
  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null;
    //return user !== null && user.emailVerified !== false ? true : false;
  }
  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {
      this.router.navigate(['profile']);
      this.snackbar.createSuccessNotification("Successful Google Login, please refresh");
      //window.location.reload();
    }).catch((e) => {
      this.snackbar.createErrorNotification("Error on OAuth, check console");
      console.log(e);
    });
  }
  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.SetUserData('oauth' ,result.user);
        this.router.navigate(['profile']);
      })
      .catch((error) => {
        window.alert(error);
      });
  }
  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(mode: string ,user: any) {
    if(mode === 'sign-up'){
      this.afs.collection<User>('users').add({...user, activity: Number(user.activity)});
      return;
    } else if(mode === 'oauth'){
      this.afs.collection<User>('users', ref => ref.where('uid', '==' ,user.uid)).valueChanges({ idField: 'docId' }).pipe(take(1)).subscribe((data: User[]) =>{
       if(data.length === 0){
        //No user found already through OAuth
        const userData: User = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          fridge: [],
          age: 18,
          weight: 80,
          height: 180,
          activity: 2,
          gender: 'Man',
          // profilePicturePath: 'https://firebasestorage.googleapis.com/v0/b/godmenu-db556.appspot.com/o/god-diet%2Fdummy.png?alt=media&token=7c14b981-0418-4c19-8c40-676f7f6ef2f9',
          profilePicturePath: user.photoURL,
          favoriteBreakfasts: [],
          favoriteMeals: [],
          favoriteSnacks: [],
          createdDishes: [],
          comments: [],
          necessities: this.CalculateNec('Man',18,2,80,180),
        };
        this.afs.collection<User>('users').add({...userData});
       }
      });


    };
    return;
  }
  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      this.snackbar.createSuccessNotification("Logged out successfully");
      localStorage.removeItem('user');
      this.userData = undefined;
      this.getUserData.next(this.userData);
      this.router.navigate(['sign-in']);
    }).catch((e) => {
      this.snackbar.createErrorNotification("Failed to log out, check console");
      console.log(e);
    });
  }

  CalculateNec(gender: string, age: number, activity: number, weight: number, height: number): Necessities {
    let necessities: Necessities = JSON.parse(JSON.stringify(defaultNecessities));

    necessities.AMax = 1500;
    necessities.B12Min = 1.5;
    necessities.B1Max = 100;
    necessities.B3Max = 500;
    necessities.B9Min = 200;
    necessities.B9Max = 1000;
    necessities.CMin = 40;
    necessities.DMin = 10;
    necessities.DMax = 100;
    necessities.EMax = 540;
    necessities.KMax = 1000;
    necessities.calciumMin = 700;
    necessities.calciumMax = 1500;
    necessities.ironMax = 20;
    necessities.fibersMax = 55;
    necessities.cholesterolMin = 0;
    necessities.cholesterolMax = 300;
    necessities.magnesiumMax = 1000;
    necessities.phosphorusMin = 700;
    necessities.phosphorusMax = 4000;
    necessities.potassiumMin = 4700;
    necessities.potassiumMax = 20000;
    necessities.sodiumMax = 2400;
    necessities.sodiumMin = 0;
    necessities.sugarsMin = 0;
    necessities.zincMax = 50;
    necessities.B6Max = 100;

    if(gender === 'Man'){
      necessities.AMin = 700;
      necessities.B1Min = 1;
      necessities.B2Min = 1.3;
      necessities.B3Min = 16.5;
      necessities.B6Min = 1.4;
      necessities.EMin = 4;
      necessities.ironMin = 8.7;
      necessities.fibersMin = 30;
      necessities.magnesiumMin = 400;
      necessities.sugarsMax = 37.5;
      necessities.zincMin = 11;

      necessities.caloriesMaintain = 66 + (13.7 * weight) + (5 * height) - (6.8 * age);
    } else if(gender === 'Woman'){
      necessities.AMin = 600;
      necessities.B1Min = 0.8;
      necessities.B2Min = 1.1;
      necessities.B3Min = 13.2;
      necessities.B6Min = 1.2;
      necessities.EMin = 3;
      necessities.ironMin = 14.8;
      necessities.fibersMin = 25;
      necessities.magnesiumMin = 310;
      necessities.sugarsMax = 25;
      necessities.zincMin = 8;

      necessities.caloriesMaintain = 655 + (9.6 * weight) + (1.8 * height) - (4.7 * age);
    }

    if(activity === 1){
      necessities.caloriesMaintain = necessities.caloriesMaintain * 1.2;
    } else if(activity === 2){
      necessities.caloriesMaintain = necessities.caloriesMaintain * 1.375;
    } else if(activity === 3){
      necessities.caloriesMaintain = necessities.caloriesMaintain * 1.55;
    } else if(activity === 4){
      necessities.caloriesMaintain = necessities.caloriesMaintain * 1.725;
    } else if(activity === 5){
      necessities.caloriesMaintain = necessities.caloriesMaintain * 1.9;
    }

    necessities.KMin = weight;
    necessities.caloriesMidGain = necessities.caloriesMaintain * 1.07;
    necessities.caloriesGain = necessities.caloriesMaintain * 1.15;
    necessities.caloriesExtremeGain = necessities.caloriesMaintain * 1.31;
    necessities.caloriesMidLoss = necessities.caloriesMaintain * 0.92;
    necessities.caloriesLoss = necessities.caloriesMaintain * 0.84;
    necessities.caloriesExtremeLoss = necessities.caloriesMaintain * 0.68;

    necessities.carbsLow = (necessities.caloriesMaintain / 2000) * 100 + 40;
    necessities.carbsHigh= (necessities.caloriesMaintain / 2000) * 300 + 40;

    necessities.fatsMaintain = necessities.caloriesMaintain / 40;
    necessities.fatsLoss = necessities.caloriesLoss / 40;
    necessities.fatsGain = necessities.caloriesGain / 40;

    necessities.proteinsMaintain = weight * 1.8;
    necessities.proteinsGainMin = weight * 2.0;
    necessities.proteinsGainMax = weight * 2.2;

    return necessities;
  }

  UpdateUser(userInput: User) : void{
    const updateNec = this.CalculateNec(userInput.gender, userInput.age, userInput.activity, userInput.weight, userInput.height);
    this.afs.collection<User>('users').doc(userInput.docId).update({...userInput, necessities: updateNec}).then(() => {
      this.snackbar.createSuccessNotification("User updated successfully");
    }).catch((e) => {
      this.snackbar.createErrorNotification("User upload failed, check console");
      console.log(e);
    });
  }

  UserCreatedADish(user: User, dishId: string, dishName: string, dishImage: string){
    let createdDishes: {dishId: string; dishName: string; dishImage: string}[] = user.createdDishes;
    createdDishes.push({dishId: dishId, dishName: dishName, dishImage: dishImage});
    this.afs.collection<User>('users').doc(user.docId).update({...user, createdDishes: createdDishes}).then(() => {
    }).catch((e) => {
      this.snackbar.createErrorNotification("Adding to created used dishes failed, check console");
      console.log(e);
    });
  }

  UserDeletedADish(user: User, dishId: string){
    let createdDishes: {dishId: string; dishName: string; dishImage: string}[] = user.createdDishes;
    const foundDish = createdDishes.findIndex((dish: {dishId: string; dishName: string; dishImage: string}) => dish.dishId = dishId);
    if(foundDish !== -1){
      createdDishes.splice(foundDish, 1);
    }
    this.afs.collection<User>('users').doc(user.docId).update({...user, createdDishes: createdDishes}).then(() => {
    }).catch((e) => {
      this.snackbar.createErrorNotification("Removing from created used dishes failed, check console");
      console.log(e);
    });
  }

  UserLikedADish(user: User, dishType: string, dishId: string, dishName: string, dishImage: string){
    if(dishType === 'breakfast'){
      let favorites = user.favoriteBreakfasts;
      favorites.push({dishId: dishId, dishName: dishName, dishImage: dishImage});
      this.afs.collection<User>('users').doc(user.docId).update({...user, favoriteBreakfasts: favorites})
      .then(() => {})
      .catch((e: any) => {
        this.snackbar.createErrorNotification("Failed to like the dish, check console");
      console.log(e);
      });
    } else if(dishType === 'meal'){
      let favorites = user.favoriteMeals;
      favorites.push({dishId: dishId, dishName: dishName, dishImage: dishImage});
      this.afs.collection<User>('users').doc(user.docId).update({...user, favoriteMeals: favorites})
      .then(() => {})
      .catch((e: any) => {
        this.snackbar.createErrorNotification("Failed to like the dish, check console");
      console.log(e);
      });
    } else if(dishType === 'snack'){
      let favorites = user.favoriteSnacks;
      favorites.push({dishId: dishId, dishName: dishName, dishImage: dishImage});
      this.afs.collection<User>('users').doc(user.docId).update({...user, favoriteSnacks: favorites})
      .then(() => {})
      .catch((e: any) => {
        this.snackbar.createErrorNotification("Failed to like the dish, check console");
      console.log(e);
      });
    }
  }

  UserUnlikedADish(user: User, dishType: string, dishId: string){
    if(dishType === 'breakfast'){
      let favorites = user.favoriteBreakfasts;
      const foundDish = favorites.findIndex((dish: {dishId: string, dishName: string, dishImage: string}) => dish.dishId === dishId)
      if(foundDish !== -1){
        favorites.splice(foundDish, 1);
        this.afs.collection<User>('users').doc(user.docId).update({...user, favoriteBreakfasts: favorites})
        .then(() => {})
        .catch((e: any) => {
          this.snackbar.createErrorNotification("Failed to like the dish, check console");
          console.log(e);
        });
      }
    } else if(dishType === 'meal'){
      let favorites = user.favoriteMeals;
      const foundDish = favorites.findIndex((dish: {dishId: string, dishName: string, dishImage: string}) => dish.dishId === dishId)
      if(foundDish !== -1){
        favorites.splice(foundDish, 1);
        this.afs.collection<User>('users').doc(user.docId).update({...user, favoriteMeals: favorites})
        .then(() => {})
        .catch((e: any) => {
          this.snackbar.createErrorNotification("Failed to like the dish, check console");
          console.log(e);
        });
      }
    } else if(dishType === 'snack'){
      let favorites = user.favoriteSnacks;
      const foundDish = favorites.findIndex((dish: {dishId: string, dishName: string, dishImage: string}) => dish.dishId === dishId)
      if(foundDish !== -1){
        favorites.splice(foundDish, 1);
        this.afs.collection<User>('users').doc(user.docId).update({...user, favoriteSnacks: favorites})
        .then(() => {})
        .catch((e: any) => {
          this.snackbar.createErrorNotification("Failed to like the dish, check console");
          console.log(e);
        });
      }
    }
  }

  UserAddedAComment(user: User, dishId: string, dishName: string, comment: string, dishType: string){
    let comments = user.comments;
    let date = new Date();
    comments.push({dishId: dishId, dishName: dishName, comment: comment, date: date.toLocaleDateString(), dishType: dishType});
    this.afs.collection<User>('users').doc(user.docId).update({...user, comments: comments})
    .then(() => {})
    .catch((e: any) => {
      this.snackbar.createErrorNotification("Failed to comment, check console");
    console.log(e);
    });
  }

  UserDeletedAComment(user: User, dishId: string, dishName: string, comm: string){
    let comments = user.comments;
    const foundComment = comments.findIndex((comment: {dishId: string, dishName: string, comment: string, date: string, dishType: string}) => comment.dishId === dishId && comment.dishName === dishName && comment.comment === comm);
    if(foundComment !== -1){
      comments.splice(foundComment, 1);
    }
    this.afs.collection<User>('users').doc(user.docId).update({...user, comments: comments})
    .then(() => {})
    .catch((e: any) => {
      this.snackbar.createErrorNotification("Failed to delete comment, check console");
    console.log(e);
    });
  }

  AddToUserFridge(ingredients: {ingredient: string; quantity: number}[]){
    if(this.userData){
      ingredients.forEach((ingredient: {ingredient: string; quantity: number}) => {
        const foundIngredient = this.userData.fridge.findIndex((ing: {ingredient: string; quantity: number}) => ing.ingredient === ingredient.ingredient)
        if(foundIngredient !== -1){
          this.userData.fridge[foundIngredient].quantity += ingredient.quantity;
        } else {
          this.userData.fridge.push(ingredient)
        }
      })
      this.getUserData.next(this.userData);
      this.afs.collection<User>('users').doc(this.userData.docId).update({...this.userData}).then(() => {
        this.snackbar.createSuccessNotification("Fridge updated successfully");
      }).catch((e) => {
        this.snackbar.createErrorNotification("Fridge update failed, check console");
        console.log(e);
      });
    }
  }
  RemoveFromUserFridge(ingredients: {ingredient: string; quantity: number}[]){
    if(this.userData){
      ingredients.forEach((ingredient: {ingredient: string; quantity: number}) => {
        const foundIngredient = this.userData.fridge.findIndex((ing: {ingredient: string; quantity: number}) => ing.ingredient === ingredient.ingredient)
        if(foundIngredient !== -1){
          this.userData.fridge[foundIngredient].quantity -= ingredient.quantity;
          if(this.userData.fridge[foundIngredient].quantity <= 0){
            this.userData.fridge.splice(foundIngredient, 1);
          }
        }
      })
      this.getUserData.next(this.userData);
      this.afs.collection<User>('users').doc(this.userData.docId).update({...this.userData}).then(() => {
        this.snackbar.createSuccessNotification("Fridge updated successfully");
      }).catch((e) => {
        this.snackbar.createErrorNotification("Fridge update failed, check console");
        console.log(e);
      });
    }
  }
}
