import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBabiesComponent } from './manage-babies.component';

describe('ManageBabiesComponent', () => {
  let component: ManageBabiesComponent;
  let fixture: ComponentFixture<ManageBabiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageBabiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageBabiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
