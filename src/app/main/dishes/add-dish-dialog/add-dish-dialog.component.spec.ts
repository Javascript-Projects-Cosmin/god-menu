import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDishDialogComponent } from './add-dish-dialog.component';

describe('AddDishDialogComponent', () => {
  let component: AddDishDialogComponent;
  let fixture: ComponentFixture<AddDishDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDishDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDishDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
