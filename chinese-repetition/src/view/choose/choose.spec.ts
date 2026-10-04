import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Choose } from './choose';

describe('Choose', () => {
  let component: Choose;
  let fixture: ComponentFixture<Choose>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Choose]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Choose);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
