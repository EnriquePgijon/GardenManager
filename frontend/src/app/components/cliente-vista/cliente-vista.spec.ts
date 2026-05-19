import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteVista } from './cliente-vista';

describe('ClienteVista', () => {
  let component: ClienteVista;
  let fixture: ComponentFixture<ClienteVista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteVista],
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteVista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
