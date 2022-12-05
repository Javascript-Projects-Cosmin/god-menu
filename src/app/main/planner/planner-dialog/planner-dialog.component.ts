import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Properties } from 'src/app/_models/properties';
import { User } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { SelectInterfaceFull } from '../planner.component';

@Component({
  selector: 'app-planner-dialog',
  templateUrl: './planner-dialog.component.html',
  styleUrls: ['./planner-dialog.component.scss']
})
export class PlannerDialogComponent implements OnInit {
  public activeUser: User | undefined = undefined;
  @ViewChild('invoice') invoiceElement!: ElementRef;
  public ingredientArray: {name: string, value: number}[] = [];

  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<PlannerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { properties: Properties; ingredients: Map<string, number>, dishes: SelectInterfaceFull }
  ) {}

  public weekDays = [
    {name: 'monday',bf: 'mondaybreakfastFull' as keyof SelectInterfaceFull, mf: 'mondaymealFull' as keyof SelectInterfaceFull, sf: 'mondaysnackFull' as keyof SelectInterfaceFull,},
    {name: 'tuesday',bf: 'tuesdaybreakfastFull' as keyof SelectInterfaceFull, mf: 'tuesdaymealFull' as keyof SelectInterfaceFull, sf: 'tuesdaysnackFull' as keyof SelectInterfaceFull,},
    {name: 'wednesday',bf: 'wednesdaybreakfastFull' as keyof SelectInterfaceFull, mf: 'wednesdaymealFull' as keyof SelectInterfaceFull, sf: 'wednesdaysnackFull' as keyof SelectInterfaceFull,},
    {name: 'thursday',bf: 'thursdaybreakfastFull' as keyof SelectInterfaceFull, mf: 'thursdaymealFull' as keyof SelectInterfaceFull, sf: 'thursdaysnackFull' as keyof SelectInterfaceFull,},
    {name: 'friday',bf: 'fridaybreakfastFull' as keyof SelectInterfaceFull, mf: 'fridaymealFull' as keyof SelectInterfaceFull, sf: 'fridaysnackFull' as keyof SelectInterfaceFull,},
    {name: 'saturday',bf: 'saturdaybreakfastFull' as keyof SelectInterfaceFull, mf: 'saturdaymealFull' as keyof SelectInterfaceFull, sf: 'saturdaysnackFull' as keyof SelectInterfaceFull,},
    {name: 'sunday',bf: 'sundaybreakfastFull' as keyof SelectInterfaceFull, mf: 'sundaymealFull' as keyof SelectInterfaceFull, sf: 'sundaysnackFull' as keyof SelectInterfaceFull,}
  ];

  ngOnInit(): void {
    this.authService.getUserData.subscribe((data: User) => {
      this.activeUser = data;
    })
    if(this.data.ingredients){
      for (const [key, value] of this.data.ingredients) {
        this.ingredientArray.push({name: key, value: Number(value)});
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getResults(){
    html2canvas(this.invoiceElement.nativeElement, { scale: 3 }).then((canvas) => {
      const imageGeneratedFromTemplate = canvas.toDataURL('image/png');
      const fileWidth = 200;
      const generatedImageHeight = (canvas.height * fileWidth) / canvas.width;
      let PDF = new jsPDF('p', 'mm', 'a4',);
      PDF.addImage(imageGeneratedFromTemplate, 'PNG', 0, 5, fileWidth, generatedImageHeight,);
      PDF.html(this.invoiceElement.nativeElement.innerHTML)
      PDF.save('summary.pdf');
    });
  }

  public calculateBar(dishValue: number, targetValue: number): number{
    const calculatedValue: number = (dishValue / targetValue) * 100;
    if(calculatedValue >= 100){
      return 100;
    } else {
      return Math.trunc(calculatedValue);
    }
  }

  public trunc(value: number, decs: number = 0): number{
    if(decs === 0){
      return Math.trunc(value)
    } else {
      return (Math.trunc(value * Math.pow(10, decs))) / Math.pow(10, decs)
    }
  }


}
