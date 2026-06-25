import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserRole } from './Personale.model';
import { catchError, map, Observable, of } from 'rxjs';
import { APIResponse } from '../models/APIResponse.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PersonaleManager {
  #http = inject(HttpClient);


  #listaPS = signal<User[]>([]);
  readonly listaPS = this.#listaPS.asReadonly();

  //Recupera lo staff dal DB
  public fetchStaff() {
    this.#http.get<APIResponse<User[]>>(`api/users`).subscribe({
      next: (res) => {
        this.#listaPS.set(res.data);
      },
      error: (err) => {
        console.error('Errore durante il fetch dello staff:', err);
      },
    });
  }

  // Aggiunge un nuovo operatore sanitario
  public addNewOperator(nuovoUtente: User) {
    this.#http
      .post<APIResponse<User>>(`api/users`, nuovoUtente)
      .subscribe({
        next: (res) => {
          this.#listaPS.update((lista) => [...lista, res.data]);
        },
        error: (err) => {
          console.error("Errore durante la creazione dell'operatore: ", err);
        },
      });
  }

  // Aggiorna un ruolo di Utente
  public modifyOperator(id: number, nuovoRuolo: UserRole) {
    this.#http
      .patch<APIResponse<User>>(`api/users/${id}/editrole`, { role: nuovoRuolo })
      .subscribe({
        next: (res) => {
          this.#listaPS.update((lista) =>
          lista.map((u) => (u.id === id ? { ...u, role: res.data.role} : u))
          );
        },
        error: (err) => {
          console.error("Errore durante la modifica del ruolo dell'operatore: ", err);
        },
      });
  }



  public checkUsernameExists(username: string): Observable<boolean> {
    if (!username.trim()) return of(false);

    return this.#http
      .get<APIResponse<{ available: boolean}>>(`api/users/check/${username}`)
      .pipe(
        map((res) => {
          return res.data ? !res.data.available : false;
        }),
        catchError(() => of(false))
      );
  }
}