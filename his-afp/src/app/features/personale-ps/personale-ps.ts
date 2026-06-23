import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { Fieldset } from 'primeng/fieldset';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { PersonaleManager } from '../../core/Personale/personale-manager';
import { debounceTime, first, map, of, switchMap } from 'rxjs';

@Component({
  selector: 'his-personale-ps',
  imports: [
    Button,
    DatePicker,
    Fieldset,
    FormsModule,
    InputText,
    Message,
    ReactiveFormsModule,
    Select,
    Textarea,
  ],
  templateUrl: './personale-ps.html',
  styleUrl: './personale-ps.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalePs {
  readonly #personaleManager = inject(PersonaleManager);
  readonly maxDate = new Date();

  // Funzione di controllo esistenza username
  checkUsernameExists = (control: AbstractControl) => {
    const username = control.value;

    if(!username){
      return of(null)
    }

    const check = of(username).pipe(debounceTime(300), switchMap(nome => this.#personaleManager.checkUsernameExists(nome)), map(esiste => esiste ? { usernameDuplicato: true } : null), first() );

    return check;
  };

  readonly sexOption = [
    {
      code: 'M',
      desc: 'Maschio',
    },
    {
      code: 'F',
      desc: 'Femmina',
    },
  ];
  readonly staffOption = [
    {
      code: 'Med',
      desc: 'Medico',
    },
    {
      code: 'Inf',
      desc: 'Infermiere',
    },
    {
      code: 'Amm',
      desc: 'Amministrazione',
    },
  ]

  readonly #fb = inject(FormBuilder);
  personale = this.#fb.group({
    anagrafica: this.#fb.group({
      nome:['', [Validators.required]],
      cognome: ['', [Validators.required]],
      dataNascita: ['', [Validators.required]],
      codiceFiscale: [
        '',
        [Validators.required, Validators.pattern('[A-Z]{6}\\d{2}[A-Z]\\d{2}[A-Z]\\d{3}[A-Z]')],
      ],
      sesso: ['', [Validators.required]],
    }),
    registrazione: this.#fb.group({
      username: [
        '', 
        [Validators.required],
        [this.checkUsernameExists]
      ],
      password: ['', Validators.required],
      occupazione: ['', [Validators.required]]
    })
  });
}