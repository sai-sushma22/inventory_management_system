import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GadgetDetailComponent } from './gadget-detail.component';

describe('GadgetDetailComponent', () => {
  let component: GadgetDetailComponent;
  let fixture: ComponentFixture<GadgetDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GadgetDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GadgetDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
