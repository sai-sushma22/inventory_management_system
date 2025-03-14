import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GadgetCreateComponent } from './gadget-create.component';

describe('GadgetCreateComponent', () => {
  let component: GadgetCreateComponent;
  let fixture: ComponentFixture<GadgetCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GadgetCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GadgetCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
