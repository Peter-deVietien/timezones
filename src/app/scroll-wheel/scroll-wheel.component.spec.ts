import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollWheelComponent } from './scroll-wheel.component';

describe('ScrollWheelComponent', () => {
  let component: ScrollWheelComponent;
  let fixture: ComponentFixture<ScrollWheelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScrollWheelComponent]
    });
    fixture = TestBed.createComponent(ScrollWheelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
