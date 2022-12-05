import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';
import { Ingredient } from 'src/app/_models/ingredient';
import { defaultProperties, Properties } from 'src/app/_models/properties';
import { User } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { IngredientService } from 'src/app/_services/ingredient.service';
import { FridgeDialogComponent } from './fridge-dialog/fridge-dialog.component';

@Component({
  selector: 'app-fridge',
  templateUrl: './fridge.component.html',
  styleUrls: ['./fridge.component.scss']
})
export class FridgeComponent implements OnInit {

  public isSmallScreen: boolean = false;
  public activeUser: User | undefined = undefined;
  public typeChosen: string = 'animal';
  public ingredients: Ingredient[] = [];
  public userFrigeMap: Map<string, number> = new Map<string, number>();

  public fridgeRow = [
    {name: 'Animal', image: '../../../assets/ingredientTypes/animal.png', size: 2, type: 'animal'},
    {name: 'Fruits', image: '../../../assets/ingredientTypes/fruits.png', size: 2, type: 'fruit'},
    {name: 'Drinks', image: '../../../assets/ingredientTypes/drinks.png', size: 2, type: 'drink'},
    {name: 'Nuts', image: '../../../assets/ingredientTypes/nuts.png', size: 2, type: 'nut'},
    {name: 'Vegetables', image: '../../../assets/ingredientTypes/vegetables.png', size: 3, type: 'vegetable'},
    {name: 'Sweets/Sugars', image: '../../../assets/ingredientTypes/sweets.png', size: 3, type: 'sweet'},
    {name: 'Premades/Supps.', image: '../../../assets/ingredientTypes/supplements.png', size: 4, type: 'premade'},
    {name: 'Carbs/Bakery', image: '../../../assets/ingredientTypes/carbs.png', size: 4, type: 'carb'},
    {name: 'Condiments/Sauces', image: '../../../assets/ingredientTypes/condiments.png', size: 4, type: 'condiment'},
    {name: 'Lactates/Replacers', image: '../../../assets/ingredientTypes/lactates.png', size: 4, type: 'lactate'},
  ]

  constructor(
    private ingredientService: IngredientService,
    private breakpointObserver: BreakpointObserver,
    public authService: AuthService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    ) { }

  ngOnInit(): void {
    this.isSmallScreen = this.breakpointObserver.isMatched('(max-width: 767px)');
    this.breakpointObserver.observe('(max-width: 767px)').subscribe((result) => {
      this.isSmallScreen = result.matches;
    });
    //this.addIngredient();
    this.initData();
    this.ingredientService.getIngredientNames();
    this.authService.getUserData.subscribe((data: User) => {
      if(data !== undefined){
        this.activeUser = data;
        data.fridge.forEach((ing: {ingredient: string; quantity: number}) => {
          this.userFrigeMap.set(ing.ingredient, ing.quantity);
        })
      } else {
        this.activeUser = undefined;
        this.userFrigeMap.clear();
      }
    })
  }

  initData(): void {
    this.ingredients = this.ingredientService.getIngredientsByType(this.typeChosen);
  }

  setIngredientType(type: string){
    this.typeChosen = type;
    this.initData();
  }

  addIngredient(): void{
    const newProp: Properties = {
      enough: 0,
        price: 0,
        calories: 0,
        totalFatG: 0,
        carbsG: 0,
        fiberG: 0,
        sugarsG: 0,
        proteinG: 0,
        cholesterolMG: 0,
        phosphorusMG: 0,
        sodiumMG: 0,
        calciumMG: 0,
        magnesiumMG: 0,
        potassiumMG: 0,
        ironMG: 0,
        zincMG: 0,
        AMCG: 0,
        CMG: 0,
        B1MG: 0,
        B2MG: 0,
        B3MG: 0,
        B6MG: 0,
        B9MCG: 0,
        B12MCG: 0,
        DMCG: 0,
        EMG: 0,
       KMCG: 0,
    }
    const newIngredient: Ingredient = {
      name: "Red Pepper",
        type: "vegetable",
        imagePath: "redpepper.jpg",
        conversionType: "1 cup",
        conversion: 150,
        properties: newProp
    }
    this.ingredientService.addIngredient(newIngredient);
  }

  ToNumber(possibleNum: any): Number {
    return Number(possibleNum);
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(FridgeDialogComponent, {
      width: '80%',
      panelClass: 'dialog-box',
      data: { mode: 'add' },
    });
  }

  openRemoveDialog(): void {
    const dialogRef = this.dialog.open(FridgeDialogComponent, {
      width: '80%',
      panelClass: 'dialog-box',
      data: { mode: 'remove' },
    });
  }

}
