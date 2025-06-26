import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinhaLista } from './minha-lista';

describe('MinhaLista', () => {
  let component: MinhaLista;
  let fixture: ComponentFixture<MinhaLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinhaLista]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinhaLista);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
