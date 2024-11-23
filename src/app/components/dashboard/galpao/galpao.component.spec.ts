import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalpaoComponent } from './galpao.component';

describe('GalpaoComponent', () => {
  let component: GalpaoComponent;
  let fixture: ComponentFixture<GalpaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GalpaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalpaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
