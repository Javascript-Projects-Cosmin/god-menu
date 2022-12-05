import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { UncalculatedDish } from 'src/app/_models/uncalculatedDish';
import { AuthService } from 'src/app/_services/auth.service';
import { IngredientService } from 'src/app/_services/ingredient.service';
import { FridgeDialogComponent } from '../../fridge/fridge-dialog/fridge-dialog.component';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { SnackbarHelperService } from 'src/app/_helpers/snackbar.helper';
import { FirestoreUploadService } from 'src/app/_services/firestore-upload.service';
import { DishService } from 'src/app/_services/dish.service';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-add-dish-dialog',
  templateUrl: './add-dish-dialog.component.html',
  styleUrls: ['./add-dish-dialog.component.scss']
})
export class AddDishDialogComponent implements OnInit {

  public dropdownList: {item_id: number, item_text: string}[] = [];
  public moreDetailList: {item_id: number, conversionType: string ,quantity: number, type: string, conversion: number}[] = [];
  public selectedItems: {item_id: number, item_text: string}[] = [];
  public selectedDetails: {item_id: number, conversionType: string ,quantity: number, type: string, conversion: number}[] = [];
  public dropdownSettings: IDropdownSettings = {};

  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl('');
  filteredTags!: Observable<string[]>;
  allTags: string[] = ['simple', 'fast', 'family-friendly', 'protein-based', 'energized', 'no-carb', 'diet-friendly', 'high-calories'];
  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;

  public makeADish: UncalculatedDish = {
    name: "",
    description: "",
    creator: this.data.user.displayName,
    creatorId: this.data.user.uid,
    tags: [],
    imagePath: "",
    createdAt: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric' }),
    link: "",
    instructions: [""],
    type: this.data.dishType,
    preptime: 0,
    cooktime: 0,
    ingredients: new Map<string, number>,
  }

  constructor(
    public dialogRef: MatDialogRef<FridgeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {dishType: string, user: User},
    public ingredientService: IngredientService,
    public authService: AuthService,
    private dishService: DishService,
    private fireHost: FirestoreUploadService,
    private cdr: ChangeDetectorRef,
    private snackbar: SnackbarHelperService
  ) {
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => (tag ? this._filter(tag) : this.allTags.slice())),
    );
   }

  ngOnInit(): void {
    if(this.ingredientService.stringIngredients !== "" && this.ingredientService.stringConversions !== "" && this.dropdownList.length === 0){
      const ingredientNames = this.ingredientService.stringIngredients.split(",");
      const ingredientConversions = this.ingredientService.stringConversions.split(",");
      const ingredientConversionsTypes = this.ingredientService.stringConversionsType.split(",");
      for(let i = 0; i < ingredientNames.length; i++){
        this.dropdownList.push({item_id:i,  item_text:ingredientNames[i]});
        this.moreDetailList.push({item_id:i, conversionType: ingredientConversionsTypes[i] ,quantity: 0 ,type:'g', conversion: Number(ingredientConversions[i])});
      }
    }
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      enableCheckAll: false,
      itemsShowLimit: 7,
      allowSearchFilter: true
    };
    this.fireHost.dishImageRef.subscribe((data: string) => {
      this.makeADish.imagePath = data;
      this.cdr.detectChanges();
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if(this.data.user){
      if(this.makeADish.name === ""){
        this.snackbar.createErrorNotification("Dish name cannot be empty");
      } else if(this.makeADish.imagePath === ""){
        this.snackbar.createErrorNotification("Dish image cannot be empty");
      } else if(this.makeADish.preptime === 0 && this.makeADish.cooktime === 0){
        this.snackbar.createErrorNotification("Dish cannot have any prep or cooktime") }
        else{
        for(let i = 0; i < this.selectedItems.length; i++){
          if(this.selectedDetails[i].type === 'g' && this.selectedDetails[i].quantity > 0){
            this.makeADish.ingredients.set(this.selectedItems[i].item_text, Number(this.selectedDetails[i].quantity))
          } else if(this.selectedDetails[i].type === 'piece' && this.selectedDetails[i].quantity > 0){
            this.makeADish.ingredients.set(this.selectedItems[i].item_text, Number(this.selectedDetails[i].quantity) * Number(this.selectedDetails[i].conversion))
          }
        }
        if(this.makeADish.ingredients.size === 0){
          this.snackbar.createErrorNotification("Dish must contain at least one ingredient");
        } else {
          this.dishService.createOrUpdateDish(this.data.dishType, this.makeADish, 'add', this.data.user);
          this.dialogRef.close();
        }
      }
    }
  }

  onSelect(event: any){
    this.selectedDetails.push(this.moreDetailList[event.item_id]);
  }

  onDeselect(event: any){
    let itemToRemove = this.selectedDetails.findIndex((item: any) => item.item_id === event.item_id);
    if(itemToRemove !== -1){
      this.selectedDetails.splice(itemToRemove, 1);
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.makeADish.tags.push(value);
    }
    event.chipInput!.clear();
    this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.makeADish.tags.indexOf(tag);
    if (index >= 0) {
      this.makeADish.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.makeADish.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allTags.filter(tag => tag.toLowerCase().includes(filterValue));
  }

  addInstruction(){
    this.makeADish.instructions.push("");
  }

  deleteInstruction(index: number){
    this.makeADish.instructions.splice(index, 1);
  }


  onFileSelected(event: any){
    const file:File = event.target.files[0];
    if (file) {
      this.fireHost.uploadImage(file, 'dish');
    }
  }


}
