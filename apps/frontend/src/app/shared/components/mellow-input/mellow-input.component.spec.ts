import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MellowInputComponent } from './mellow-input.component';

describe('MellowInputComponent', () => {
  let component: MellowInputComponent;
  let fixture: ComponentFixture<MellowInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MellowInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MellowInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
