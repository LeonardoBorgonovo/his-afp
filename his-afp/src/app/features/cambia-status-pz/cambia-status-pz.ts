import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { SelectModule } from 'primeng/select';

interface Status {
  label: string;
  value: string; 
}

@Component({
  selector: 'his-cambia-status-pz',
  imports: [SelectModule, FormsModule],
  templateUrl: './cambia-status-pz.html',
  styleUrl: './cambia-status-pz.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CambiaStatusPz {
  constructor(public config: DynamicDialogConfig) {}

  status: Status[] = [
    { label: 'In Attesa', value: 'ATT' },
    { label: 'In Visita', value: 'VIS' },
    { label: 'Osservazione Breve Intensiva', value: 'OBI'},
    { label: 'Ricovero', value: 'RIC' },
    { label: 'Dimesso', value: 'DIM' },
  ];

  selectedStatus: string | undefined;
}
