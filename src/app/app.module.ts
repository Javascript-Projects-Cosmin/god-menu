import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FridgeDialogComponent } from './main/fridge/fridge-dialog/fridge-dialog.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { MaterialModule } from './material.module';
import { StatsComponent } from './main/stats/stats.component';
import { PlannerComponent } from './main/planner/planner.component';
import { FridgeComponent } from './main/fridge/fridge.component';
import { ProfileComponent } from './main/profile/profile.component';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NetworkInterceptor } from './_interceptors/network.interceptor';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { providePerformance,getPerformance } from '@angular/fire/performance';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { DishesComponent } from './main/dishes/dishes.component';
import { SignInComponent } from './login/sign-in/sign-in.component';
import { SignUpComponent } from './login/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';
import { VerifyMailComponent } from './login/verify-mail/verify-mail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { LimitcharsPipe } from './_pipes/limitchars.pipe';
import { AddDishDialogComponent } from './main/dishes/add-dish-dialog/add-dish-dialog.component';
import { CloudinaryModule } from '@cloudinary/ng';
import { DishDetailComponent } from './main/dishes/dish-detail/dish-detail.component';
import { PlannerDialogComponent } from './main/planner/planner-dialog/planner-dialog.component';
import { IonicGestureConfig } from './_directives/tap-gestures.directive';
import { DishService } from './_services/dish.service';
import { IngredientService } from './_services/ingredient.service';

export function init_app(dishService: DishService) {
  return () => dishService.load();
}
export function init_ingredients(ingService: IngredientService) {
  return () => ingService.load();
}

@NgModule({
  declarations: [
    AppComponent,
    DishesComponent,
    FridgeDialogComponent,
    StatsComponent,
    PlannerComponent,
    FridgeComponent,
    ProfileComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyMailComponent,
    LimitcharsPipe,
    AddDishDialogComponent,
    DishDetailComponent,
    PlannerDialogComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CloudinaryModule,
    MaterialModule,
    HammerModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    NgMultiSelectDropDownModule.forRoot(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    providePerformance(() => getPerformance()),
    provideStorage(() => getStorage()),
  ],
  providers: [{ provide: FIREBASE_OPTIONS, useValue: environment.firebase }, {provide: HTTP_INTERCEPTORS, useClass: NetworkInterceptor, multi: true}, ScreenTrackingService,UserTrackingService,
    // {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: IonicGestureConfig
  },
  { provide: APP_INITIALIZER, useFactory: init_app, deps: [DishService], multi: true },
  { provide: APP_INITIALIZER, useFactory: init_ingredients, deps: [IngredientService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
