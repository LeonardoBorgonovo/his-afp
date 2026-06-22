import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Personale } from './Personale.model';
import { Router } from '@angular/router';
import { debounceTime, of } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class PersonaleManager {
  timer_id = signal<number>(-1);
  #http = inject(HttpClient);
  readonly #router = inject(Router);
  #listaPS = signal<Personale[]>([
    {
      id: '1',
      anagrafica: { nome: 'Mario', cognome: 'Rossi', dataNascita: '1990-01-01', codiceFiscale: 'RSSMRA90A01H501W', sesso: 'M' },
      registrazione: { username: 'mario.rossi', password: 'password123', occupazione: 'Med' }
    }
  ]);






  public checkUsernameExists(username: string) {
    const listaPS = this.#listaPS();
    const exists = listaPS.some(dipendente => 
      dipendente.registrazione.username.toLowerCase() === username.toLowerCase()
    );
    
    return of(exists);
  }
}