import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingCircleComponent as CircleDrawingComponent } from './circle-drawing.component';

describe('CircleDrawingComponent', () => {
  let component: CircleDrawingComponent;
  let fixture: ComponentFixture<CircleDrawingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CircleDrawingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CircleDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
