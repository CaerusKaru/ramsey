import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MTFComponent } from './mtf.component';

describe('MTFComponent', () => {
  let component: MTFComponent;
  let fixture: ComponentFixture<MTFComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MTFComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MTFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
