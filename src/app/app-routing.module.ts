import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';
import { SignInComponent } from './login/sign-in/sign-in.component';
import { SignUpComponent } from './login/sign-up/sign-up.component';
import { VerifyMailComponent } from './login/verify-mail/verify-mail.component';
import { DishDetailComponent } from './main/dishes/dish-detail/dish-detail.component';
import { DishesComponent } from './main/dishes/dishes.component';
import { FridgeComponent } from './main/fridge/fridge.component';
import { PlannerComponent } from './main/planner/planner.component';
import { ProfileComponent } from './main/profile/profile.component';
import { StatsComponent } from './main/stats/stats.component';
import { AfterAuthGuard } from './_guards/after-auth.guard';
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'breakfasts'},
  { path: 'sign-in',             component: SignInComponent, canActivate: [AfterAuthGuard] },
  { path: 'register-user',       component: SignUpComponent, canActivate: [AfterAuthGuard] },
  { path: 'forgot-password',     component: ForgotPasswordComponent, canActivate: [AfterAuthGuard] },
  { path: 'verify-mail-address', component: VerifyMailComponent, canActivate: [AfterAuthGuard] },
  { path: 'profile',             component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'meals',               component: DishesComponent},
  { path: 'breakfasts',          component: DishesComponent},
  { path: 'snacks',              component: DishesComponent},
  { path: 'meals/:id',               component: DishDetailComponent},
  { path: 'breakfasts/:id',          component: DishDetailComponent},
  { path: 'snacks/:id',              component: DishDetailComponent},
  { path: 'fridge',              component: FridgeComponent, canActivate: [AuthGuard] },
  { path: 'stats',               component: StatsComponent, canActivate: [AuthGuard] },
  { path: 'planner',             component: PlannerComponent, canActivate: [AuthGuard] },
  { path: '**',                  redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AfterAuthGuard]
})
export class AppRoutingModule { }
