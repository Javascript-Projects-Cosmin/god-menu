import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AuthService } from 'src/app/_services/auth.service';
import { IngredientService } from 'src/app/_services/ingredient.service';

@Component({
  selector: 'app-fridge-dialog',
  templateUrl: './fridge-dialog.component.html',
  styleUrls: ['./fridge-dialog.component.scss']
})
export class FridgeDialogComponent implements OnInit {

  public dropdownList: {item_id: number, item_text: string}[] = [];
  public moreDetailList: {item_id: number, conversionType: string ,quantity: number, type: string, conversion: number}[] = [];
  public selectedItems: {item_id: number, item_text: string}[] = [];
  public selectedDetails: {item_id: number, conversionType: string ,quantity: number, type: string, conversion: number}[] = [];
  public dropdownSettings: IDropdownSettings = {};

  constructor(
    public dialogRef: MatDialogRef<FridgeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {mode: string},
    public ingredientService: IngredientService,
    public authService: AuthService,
  ) { }

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
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    let data: {ingredient: string; quantity: number}[] = [];
    for(let i = 0; i < this.selectedItems.length; i++){
      if(this.selectedDetails[i].type === 'g' && this.selectedDetails[i].quantity > 0){
        data.push({ingredient: this.selectedItems[i].item_text, quantity: Number(this.selectedDetails[i].quantity)});
      } else if(this.selectedDetails[i].type === 'piece' && this.selectedDetails[i].quantity > 0){
        data.push({ingredient: this.selectedItems[i].item_text, quantity: Number(this.selectedDetails[i].quantity) * Number(this.selectedDetails[i].conversion)});
      }
    }
    if(this.data.mode === 'add'){
      this.authService.AddToUserFridge(data);
    } else if(this.data.mode === 'remove'){
      this.authService.RemoveFromUserFridge(data);
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
}
