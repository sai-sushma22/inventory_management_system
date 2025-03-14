import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GadgetListComponent } from './gadget-list.component';

describe('GadgetListComponent', () => {
  let component: GadgetListComponent;
  let fixture: ComponentFixture<GadgetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GadgetListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GadgetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
