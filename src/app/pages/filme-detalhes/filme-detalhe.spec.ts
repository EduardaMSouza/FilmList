import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmeDetalhes } from './filme-detalhe';

describe('FilmeDetalhes', () => {
  let component: FilmeDetalhes;
  let fixture: ComponentFixture<FilmeDetalhes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilmeDetalhes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilmeDetalhes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
