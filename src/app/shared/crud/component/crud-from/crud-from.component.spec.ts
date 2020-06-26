import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudFromComponent } from './crud-from.component';

describe('CrudFromComponent', () => {
  let component: CrudFromComponent;
  let fixture: ComponentFixture<CrudFromComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CrudFromComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudFromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
