import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MaterialModule } from "../material.module";
import { LoadingComponent } from './loading/loading.component';
import { NotificationComponent } from './notification/notification.component';
import { SearchComponent } from './search/search.component';

@NgModule({
  declarations: [
    LoadingComponent,
    NotificationComponent,
    SearchComponent,
  ],
  exports: [
    LoadingComponent,
    NotificationComponent,
    SearchComponent,
  ],
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
  ],
  providers: [],
})
export class ComponentsModule { }
