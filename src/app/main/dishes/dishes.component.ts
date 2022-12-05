import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { startWith, switchMap, take } from 'rxjs';
import { Dish } from 'src/app/_models/dish';
import { UncalculatedDish } from 'src/app/_models/uncalculatedDish';
import { User } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { DishService } from 'src/app/_services/dish.service';
import { IngredientService } from 'src/app/_services/ingredient.service';
import { AddDishDialogComponent } from './add-dish-dialog/add-dish-dialog.component';

export interface DishPagedResult {
  entities?: Array<Dish> | null;
  totalEntities?: number;
  skip?: number;
  take?: number;
  readonly page?: number;
  readonly maxPages?: number;
}


@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.scss']
})
export class DishesComponent implements OnInit, AfterViewInit {

  public dishes: Dish[] = [];
  public activeUser: User | undefined = undefined;

  public orderBy: string = 'name';
  public filter: string = '';
  public dishType: string = '';

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  private skip = 0;
  private take = 6;
  public lengthOfPage!: number | undefined;
  public paginationResult: DishPagedResult = {};

  constructor(
    private dishService: DishService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private ingredientService: IngredientService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
    ) { }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel="Page size";
  }

  ngAfterViewInit(): void {
    this.route.queryParams.pipe(take(1)).subscribe(params => { this.dishType = params['type'];});
    if (['breakfast', 'snack', 'meal'].includes(this.dishType)){
      this.ingredientService.getIngredientNames();
      this.authService.getUserData.subscribe((data: User) => {
        if(data !== undefined){
          this.activeUser = data;
        } else {
          this.activeUser = undefined;
        }
      })
      this.initData();
    } else {
      if(this.router.url === '/breakfasts' || this.router.url === '/meals' ||this.router.url === '/snacks'){
        this.dishType = this.router.url.slice(1).slice(0, this.router.url.length - 2);
        this.ingredientService.getIngredientNames();
        this.authService.getUserData.subscribe((data: User) => {
          if(data !== undefined){
            this.activeUser = data;
          } else {
            this.activeUser = undefined;
          }
        })
        this.initData();
      }
    }
  }

  private initData() {

    this.paginator.page.pipe(
      startWith({}),
      switchMap(() => {
        this.skip = this.paginator.pageSize * this.paginator.pageIndex;
        this.take = this.paginator.pageSize;
        return this.dishService.getDishesPaged(this.dishType, this.skip, this.take, this.orderBy, this.filter);
      }),
    ).subscribe((res: DishPagedResult) => {
      if (res !== null && res !== undefined)
      {
        this.paginationResult = res;
        if (this.paginationResult.entities && this.paginationResult.entities.length > 0)
        {
          this.dishes = this.paginationResult.entities;
          this.lengthOfPage = this.paginationResult.totalEntities;
        }
      }
      this.cdr.detectChanges();
    })
  }

  public likeDish(dish: Dish){
    if(this.activeUser && this.activeUser.displayName && this.activeUser.uid && this.activeUser.profilePicturePath ){
      this.dishService.likeDish(this.dishType , dish, this.activeUser)
    }
  }

  public userLiked(dish: Dish): boolean{
    return dish.likes.find((like: {userName: string, userId: string, userProfileImage: string}) => like.userId === this.activeUser?.uid) !== undefined;
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddDishDialogComponent, {
      width: '80%',
      height: '90%',
      panelClass: 'dialog-box',
      data: { dishType: this.dishType, user: this.activeUser},
    });
    dialogRef.afterClosed().subscribe((data: any) => {
      this.initData();
    });
  }

  onSortChange(): void {
    this.initData();
  }
}
