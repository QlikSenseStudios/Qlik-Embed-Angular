import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnTheFlyComponent } from './on-the-fly.component';

describe('OnTheFlyComponent', () => {
  let component: OnTheFlyComponent;
  let fixture: ComponentFixture<OnTheFlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnTheFlyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OnTheFlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
