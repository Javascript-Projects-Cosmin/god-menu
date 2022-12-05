import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SnackbarHelperService } from 'src/app/_helpers/snackbar.helper';
import { Dish } from 'src/app/_models/dish';
import { defaultProperties, Properties, propertiesKeys } from 'src/app/_models/properties';
import { AuthService } from 'src/app/_services/auth.service';
import { DishService } from 'src/app/_services/dish.service';
import { PlannerDialogComponent } from './planner-dialog/planner-dialog.component';

export interface SelectItem {
  item_id: string,
  item_text: string
}

export interface FullItem {
  item_id: string,
  item_text: string,
  item_picture: string,
  item_quantity: string,
  item_previous_quantity: string,
  item_properties: Properties,
  item_ingredients: {name: string, value: number}[],
}

export interface SelectInterface {
  "mondaybreakfast": SelectItem[],
  "mondaymeal": SelectItem[],
  "mondaysnack": SelectItem[],

  "tuesdaybreakfast": SelectItem[],
  "tuesdaymeal": SelectItem[],
  "tuesdaysnack": SelectItem[],

  "wednesdaybreakfast": SelectItem[],
  "wednesdaymeal": SelectItem[],
  "wednesdaysnack": SelectItem[],

  "thursdaybreakfast": SelectItem[],
  "thursdaymeal": SelectItem[],
  "thursdaysnack": SelectItem[],

  "fridaybreakfast": SelectItem[],
  "fridaymeal": SelectItem[],
  "fridaysnack": SelectItem[],

  "saturdaybreakfast": SelectItem[],
  "saturdaymeal": SelectItem[],
  "saturdaysnack": SelectItem[],

  "sundaybreakfast": SelectItem[],
  "sundaymeal": SelectItem[],
  "sundaysnack": SelectItem[],
}
export interface SelectInterfaceFull {

  "mondaybreakfastFull": FullItem[],
  "mondaymealFull": FullItem[],
  "mondaysnackFull": FullItem[],

  "tuesdaybreakfastFull": FullItem[],
  "tuesdaymealFull": FullItem[],
  "tuesdaysnackFull": FullItem[],

  "wednesdaybreakfastFull": FullItem[],
  "wednesdaymealFull": FullItem[],
  "wednesdaysnackFull": FullItem[],

  "thursdaybreakfastFull": FullItem[],
  "thursdaymealFull": FullItem[],
  "thursdaysnackFull": FullItem[],

  "fridaybreakfastFull": FullItem[],
  "fridaymealFull": FullItem[],
  "fridaysnackFull": FullItem[],

  "saturdaybreakfastFull": FullItem[],
  "saturdaymealFull": FullItem[],
  "saturdaysnackFull": FullItem[],

  "sundaybreakfastFull": FullItem[],
  "sundaymealFull": FullItem[],
  "sundaysnackFull": FullItem[],
}


@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.scss']
})
export class PlannerComponent implements OnInit {

  constructor(
    private dishService: DishService,
    private dialog: MatDialog,
  ) { }

  public breakfasts: Dish[] = [];
  public meals: Dish[] = [];
  public snacks: Dish[] = [];

  public breakfastList: SelectItem[] = [];
  public mealList: SelectItem[] = [];
  public snackList: SelectItem[] = [];

  public selectObject: SelectInterface = {
    "mondaybreakfast": [],
    "mondaymeal": [],
    "mondaysnack": [],

    "tuesdaybreakfast": [],
    "tuesdaymeal": [],
    "tuesdaysnack": [],

    "wednesdaybreakfast": [],
    "wednesdaymeal": [],
    "wednesdaysnack": [],

    "thursdaybreakfast": [],
    "thursdaymeal": [],
    "thursdaysnack": [],

    "fridaybreakfast": [],
    "fridaymeal": [],
    "fridaysnack": [],

    "saturdaybreakfast": [],
    "saturdaymeal": [],
    "saturdaysnack": [],

    "sundaybreakfast": [],
    "sundaymeal": [],
    "sundaysnack": [],
  }
  public selectObjectFull: SelectInterfaceFull = {
    "mondaybreakfastFull": [],
    "mondaymealFull": [],
    "mondaysnackFull": [],

    "tuesdaybreakfastFull": [],
    "tuesdaymealFull": [],
    "tuesdaysnackFull": [],

    "wednesdaybreakfastFull": [],
    "wednesdaymealFull": [],
    "wednesdaysnackFull": [],

    "thursdaybreakfastFull": [],
    "thursdaymealFull": [],
    "thursdaysnackFull": [],

    "fridaybreakfastFull": [],
    "fridaymealFull": [],
    "fridaysnackFull": [],

    "saturdaybreakfastFull": [],
    "saturdaymealFull": [],
    "saturdaysnackFull": [],

    "sundaybreakfastFull": [],
    "sundaymealFull": [],
    "sundaysnackFull": [],
  }
  public weekDays = [
    {
      name: 'monday',
      b: 'mondaybreakfast' as keyof SelectInterface, m: 'mondaymeal' as keyof SelectInterface, s: 'mondaysnack' as keyof SelectInterface,
      bf: 'mondaybreakfastFull' as keyof SelectInterfaceFull, mf: 'mondaymealFull' as keyof SelectInterfaceFull, sf: 'mondaysnackFull' as keyof SelectInterfaceFull,
    },
    {
      name: 'tuesday',
      b: 'tuesdaybreakfast' as keyof SelectInterface, m: 'tuesdaymeal' as keyof SelectInterface, s: 'tuesdaysnack' as keyof SelectInterface,
      bf: 'tuesdaybreakfastFull' as keyof SelectInterfaceFull, mf: 'tuesdaymealFull' as keyof SelectInterfaceFull, sf: 'tuesdaysnackFull' as keyof SelectInterfaceFull,
    },
    {
      name: 'wednesday',
      b: 'wednesdaybreakfast' as keyof SelectInterface, m: 'wednesdaymeal' as keyof SelectInterface, s: 'wednesdaysnack' as keyof SelectInterface,
      bf: 'wednesdaybreakfastFull' as keyof SelectInterfaceFull, mf: 'wednesdaymealFull' as keyof SelectInterfaceFull, sf: 'wednesdaysnackFull' as keyof SelectInterfaceFull,
    },
    {
      name: 'thursday',
      b: 'thursdaybreakfast' as keyof SelectInterface, m: 'thursdaymeal' as keyof SelectInterface, s: 'thursdaysnack' as keyof SelectInterface,
      bf: 'thursdaybreakfastFull' as keyof SelectInterfaceFull, mf: 'thursdaymealFull' as keyof SelectInterfaceFull, sf: 'thursdaysnackFull' as keyof SelectInterfaceFull,
    },
    {
      name: 'friday',
      b: 'fridaybreakfast' as keyof SelectInterface, m: 'fridaymeal' as keyof SelectInterface, s: 'fridaysnack' as keyof SelectInterface,
      bf: 'fridaybreakfastFull' as keyof SelectInterfaceFull, mf: 'fridaymealFull' as keyof SelectInterfaceFull, sf: 'fridaysnackFull' as keyof SelectInterfaceFull,
    },
    {
      name: 'saturday',
      b: 'saturdaybreakfast' as keyof SelectInterface, m: 'saturdaymeal' as keyof SelectInterface, s: 'saturdaysnack' as keyof SelectInterface,
      bf: 'saturdaybreakfastFull' as keyof SelectInterfaceFull, mf: 'saturdaymealFull' as keyof SelectInterfaceFull, sf: 'saturdaysnackFull' as keyof SelectInterfaceFull,
    },
    {
      name: 'sunday',
      b: 'sundaybreakfast' as keyof SelectInterface, m: 'sundaymeal' as keyof SelectInterface, s: 'sundaysnack' as keyof SelectInterface,
      bf: 'sundaybreakfastFull' as keyof SelectInterfaceFull, mf: 'sundaymealFull' as keyof SelectInterfaceFull, sf: 'sundaysnackFull' as keyof SelectInterfaceFull,
    }
  ];

  public properties: Properties = JSON.parse(JSON.stringify(defaultProperties));
  public ingredients: Map<string,number> = new Map();

  public dropdownSettings: IDropdownSettings = {};

  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      enableCheckAll: false,
      itemsShowLimit: 7,
      allowSearchFilter: true
    };

    this.dishService.getDishesAllTypes().subscribe((data: [Dish[], Dish[], Dish[]]) => {
      this.breakfasts = data[0];
      this.meals = data[1];
      this.snacks = data[2];

      this.breakfastList = [];
      this.mealList = [];
      this.snackList = [];
      this.breakfasts.forEach((brk: Dish) => {
        this.breakfastList.push({item_id: brk.dishId, item_text: brk.name})
      })
      this.meals.forEach((ml: Dish) => {
        this.mealList.push({item_id: ml.dishId, item_text: ml.name})
      })
      this.snacks.forEach((snk: Dish) => {
        this.snackList.push({item_id: snk.dishId, item_text: snk.name})
      })
    })
  }

  onSelect(event: any, day: string, type: string){
    let foundDish: Dish | undefined = undefined;
    if(type === 'breakfast'){
      foundDish = this.breakfasts.find((dish: Dish) => dish.dishId === event.item_id)
    } else if(type === 'meal'){
      foundDish = this.meals.find((dish: Dish) => dish.dishId === event.item_id)
    } else if(type === 'snack'){
      foundDish = this.snacks.find((dish: Dish) => dish.dishId === event.item_id)
    }
    if(foundDish !== undefined){
      const propertyKeys = propertiesKeys;
      propertyKeys.forEach((key: string) => {
        if(foundDish){
          if(['potassiumMG','ironMG','phosphorusMG', 'magnesiumMG', 'enough', 'cholesterolMG', 'calories','CMG', 'calciumMG'].includes(key)){
            this.properties[key as keyof Properties] += Math.trunc(foundDish.properties[key as keyof Properties]);
          }
          if(['totalFatG', 'sodiumMG', 'sugarsG', 'proteinG', 'price', 'carbsG', 'KMCG',  'B9MCG', 'AMCG'].includes(key)){
            this.properties[key as keyof Properties] += Math.trunc(foundDish.properties[key as keyof Properties] * 10) / 10;
          }
          if(['zincMG', 'fiberG', 'EMG', 'DMCG', 'B6MG'].includes(key)){
            this.properties[key as keyof Properties] += Math.trunc(foundDish.properties[key as keyof Properties] * 100) / 100;
          }
          if(['B12MCG', 'B3MG', 'B2MG', 'B1MG'].includes(key)){
            this.properties[key as keyof Properties] += Math.trunc(foundDish.properties[key as keyof Properties] * 1000) / 1000;
          }
        }
      });
      foundDish.ingredients.forEach((ing: {name: string, value: number}) => {
        let foundIng = this.ingredients.get(ing.name);
        if(foundIng !== undefined){
          this.ingredients.set(ing.name, foundIng + ing.value);
        } else {
          this.ingredients.set(ing.name, ing.value);
        }
      })

      let key: string = `${day}${type}Full`;
      this.selectObjectFull[key as keyof SelectInterfaceFull].push({item_id: event.item_id, item_text: event.item_text,
        item_picture: foundDish.imagePath, item_quantity: "1", item_previous_quantity: "1",
        item_properties: foundDish.properties, item_ingredients: foundDish.ingredients})
    }
  }
  onDeselect(event: any, day: string, type: string){
    let key: string = `${day}${type}Full`;
    const foundDish = this.selectObjectFull[key as keyof SelectInterfaceFull].findIndex((dish: any) => dish.item_id === event.item_id);
    if(foundDish !== -1){
      // let dish: Dish | undefined = undefined;
      // if(type === 'breakfast'){
      //   dish = this.breakfasts.find((dish: Dish) => dish.dishId === event.item_id)
      // } else if(type === 'meal'){
      //   dish = this.meals.find((dish: Dish) => dish.dishId === event.item_id)
      // } else if(type === 'snack'){
      //   dish = this.snacks.find((dish: Dish) => dish.dishId === event.item_id)
      // }
      const dish = this.selectObjectFull[key as keyof SelectInterfaceFull][foundDish];
      if(dish !== undefined){
        const propertyKeys = propertiesKeys;
        propertyKeys.forEach((key: string) => {
          if(dish){
            if(['potassiumMG','ironMG', 'phosphorusMG', 'magnesiumMG', 'enough', 'cholesterolMG','CMG', 'calories', 'calciumMG'].includes(key)){
              let value = this.properties[key as keyof Properties];
              value -= Math.trunc(dish.item_properties[key as keyof Properties]) * Number(dish.item_quantity);
              if(value < 1){
                value = 0;
              }
              this.properties[key as keyof Properties] = value;
            }
            if(['totalFatG', 'sodiumMG', 'sugarsG', 'proteinG', 'price', 'carbsG', 'KMCG', 'B9MCG', 'AMCG'].includes(key)){
              let value = this.properties[key as keyof Properties];
              value -= (Math.trunc(dish.item_properties[key as keyof Properties] * 10) / 10) * Number(dish.item_quantity);
              if(value < 1){
                value = 0;
              }
              this.properties[key as keyof Properties] = value;
            }
            if(['zincMG', 'fiberG', 'EMG', 'DMCG', 'B6MG'].includes(key)){
              let value = this.properties[key as keyof Properties];
              value -= (Math.trunc(dish.item_properties[key as keyof Properties] * 100) / 100) * Number(dish.item_quantity);
              if(value < 0.1){
                value = 0;
              }
              this.properties[key as keyof Properties] = value;
            }
            if(['B12MCG', 'B3MG', 'B2MG', 'B1MG'].includes(key)){
              let value = this.properties[key as keyof Properties];
              value -= (Math.trunc(dish.item_properties[key as keyof Properties] * 1000) / 1000) * Number(dish.item_quantity);
              if(value < 0.01){
                value = 0;
              }
              this.properties[key as keyof Properties] = value;
            }
          }
        });
        dish.item_ingredients.forEach((ing: {name: string, value: number}) => {
          let foundIng = this.ingredients.get(ing.name);
          if(foundIng !== undefined && foundIng - ing.value * Number(dish.item_quantity) > 0){
            this.ingredients.set(ing.name, foundIng - ing.value * Number(dish.item_quantity));
          } else {
            this.ingredients.delete(ing.name);
          }
        })
        this.selectObjectFull[key as keyof SelectInterfaceFull].splice(foundDish, 1);
      }
    }
  }

  public openSummaryDialog() {
    const dialogRef = this.dialog.open(PlannerDialogComponent, {
      panelClass: 'black-dialog-box',
      width: '96%',
      data: {properties: this.properties, ingredients: this.ingredients, dishes: this.selectObjectFull }
    });
  }

  public onQtyChange(
    id: string, dayId: string,
    prop: Properties, ings:{name: string, value: number}[], prevQty: string
    ){
      let foundDish = this.selectObjectFull[dayId as keyof SelectInterfaceFull].findIndex((dish: FullItem) => dish.item_id === id);
      if(foundDish !== -1){
        const qty = this.selectObjectFull[dayId as keyof SelectInterfaceFull][foundDish].item_quantity;
        const propertyKeys = propertiesKeys;
        propertyKeys.forEach((key: string) => {
          if(['potassiumMG','ironMG','phosphorusMG', 'magnesiumMG', 'enough', 'cholesterolMG', 'calories','CMG', 'calciumMG'].includes(key)){
            this.properties[key as keyof Properties] -= Math.trunc(prop[key as keyof Properties]) * Number(prevQty);
            this.properties[key as keyof Properties] += Math.trunc(prop[key as keyof Properties]) * Number(qty);
          }
          if(['totalFatG', 'sodiumMG', 'sugarsG', 'proteinG', 'price', 'carbsG', 'KMCG',  'B9MCG', 'AMCG'].includes(key)){
            this.properties[key as keyof Properties] -= (Math.trunc(prop[key as keyof Properties] * 10) / 10) * Number(prevQty);
            this.properties[key as keyof Properties] += (Math.trunc(prop[key as keyof Properties] * 10) / 10) * Number(qty);
          }
          if(['zincMG', 'fiberG', 'EMG', 'DMCG', 'B6MG'].includes(key)){
            this.properties[key as keyof Properties] -= (Math.trunc(prop[key as keyof Properties] * 100) / 100) * Number(prevQty);
            this.properties[key as keyof Properties] += (Math.trunc(prop[key as keyof Properties] * 100) / 100) * Number(qty);
          }
          if(['B12MCG', 'B3MG', 'B2MG', 'B1MG'].includes(key)){
            this.properties[key as keyof Properties] -= (Math.trunc(prop[key as keyof Properties] * 1000) / 1000) * Number(prevQty);
            this.properties[key as keyof Properties] += (Math.trunc(prop[key as keyof Properties] * 1000) / 1000) * Number(qty);
          }
        });
        ings.forEach((ing: {name: string, value: number}) => {
          let foundIng = this.ingredients.get(ing.name);
          if(foundIng !== undefined){
            this.ingredients.set(ing.name, foundIng - ing.value * Number(prevQty) + ing.value * Number(qty));
          } else {
            this.ingredients.delete(ing.name);
          }
        })

        this.selectObjectFull[dayId as keyof SelectInterfaceFull][foundDish].item_previous_quantity = qty;
      }
  }
}
