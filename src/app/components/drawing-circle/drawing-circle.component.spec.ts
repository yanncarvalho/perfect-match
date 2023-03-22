import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingCircleComponent } from './drawing-circle.component';

describe('DrawingCircleComponent', () => {
  let component: DrawingCircleComponent;
  let fixture: ComponentFixture<DrawingCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DrawingCircleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DrawingCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
