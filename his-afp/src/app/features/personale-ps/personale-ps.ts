import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { PersonaleManager } from '../../core/Personale/personale-manager';
import { catchError, debounceTime, first, map, of, switchMap } from 'rxjs';
import { User } from '../../core/Personale/Personale.model';

@Component({
  selector: 'his-personale-ps',
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    MessageModule,
    ReactiveFormsModule,
    SelectModule,
  ],
  templateUrl: './personale-ps.html',
  styleUrl: './personale-ps.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalePs implements OnInit {
  readonly personaleManager = inject(PersonaleManager);
  readonly maxDate = new Date();
  isDialogVisible = signal<boolean>(false);
  operatoreInModifica = signal<User | null>(null);

  // Richiami gli elementi nel DB
  ngOnInit(): void {
    this.personaleManager.fetchStaff();
  }

  //Funzione per aprire il dialog di inserimento di un nuovo operatore
  apriPerNuovo() {
    this.personale.reset();
    this.operatoreInModifica.set(null);
    this.isDialogVisible.set(true);
  }

  //Funzione per aprire il dialog di modifica di un operatore
  apriPerModifica(operatore: User) {
    this.operatoreInModifica.set(operatore);
    this.personale.patchValue(operatore);
    this.isDialogVisible.set(true);
  }

  onSubmit() {
    if (this.personale.invalid) {
      return; // Se ci sono errori si ferma
    }

    const datiForm = this.personale.getRawValue() as User;

    if (this.operatoreInModifica() === null) {
      // Modalità NUOVO
      this.personaleManager.addNewOperator(datiForm);
    } else {
      // Modalità MODIFICA
      const idDaModificare = this.operatoreInModifica()!.id;
      this.personaleManager.modifyOperator(idDaModificare, datiForm.role);
    }
    // Reset del popup
    this.isDialogVisible.set(false);
    this.personale.reset();
    this.operatoreInModifica.set(null);
  }

  // Funzione di controllo esistenza username
  checkUsernameExists = (control: AbstractControl) => {
    const username = control.value;

    if(!username || username.trim()) {
      return of(null);
    }

    const check = of(username).pipe(
      debounceTime(300), 
      switchMap(nome => this.personaleManager.checkUsernameExists(nome)), 
      map(esiste => esiste ? { usernameDuplicato: true } : null), 
      first(), 
      catchError(() => of(null)) );

    return check;
  };

  checkFormControl(controlName: string): boolean {
    const control = this.personale.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  checkFormControlError(controlName: string, errorName: string): any {
    return this.personale.get(controlName)?.getError(errorName);
  }

  readonly staffOption = [
    { code: 'DOC', desc: 'Medico' },
    { code: 'INF', desc: 'Infermiere' },
    { code: 'AMM', desc: 'Amministrativo' }
  ]

  readonly #fb = inject(FormBuilder);
  personale = this.#fb.group({
    username: ['', [Validators.required], [(control) => this.checkUsernameExists(control)]],
    password: ['', [Validators.required]],
    role: ['', [Validators.required]]
  });
}