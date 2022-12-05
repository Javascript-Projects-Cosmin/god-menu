import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FridgeDialogComponent } from './fridge-dialog.component';

describe('FridgeDialogComponent', () => {
  let component: FridgeDialogComponent;
  let fixture: ComponentFixture<FridgeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FridgeDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FridgeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
