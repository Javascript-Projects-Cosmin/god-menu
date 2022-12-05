import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannerDialogComponent } from './planner-dialog.component';

describe('PlannerDialogComponent', () => {
  let component: PlannerDialogComponent;
  let fixture: ComponentFixture<PlannerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlannerDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlannerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
