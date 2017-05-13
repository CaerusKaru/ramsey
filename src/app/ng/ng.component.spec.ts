import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NGComponent } from './ng.component';

describe('NGComponent', () => {
  let component: NGComponent;
  let fixture: ComponentFixture<NGComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NGComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
