import { Component, Input } from '@angular/core';
import { CommonModule, KeyValuePipe, NgFor } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TranslocoModule } from '@ngneat/transloco';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-mellow-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    FloatLabelModule,
    TranslocoModule,
    NgFor,
    KeyValuePipe,
    PasswordModule,
  ],
  templateUrl: './mellow-input.component.html',
  styleUrl: './mellow-input.component.scss',
})
export class MellowInputComponent {
  // We now accept the FormControl instance directly as an input!
  @Input() control!: FormControl;
  @Input() controlName: string = '';
  @Input() fg!: FormGroup;

  @Input() id: string = '';
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() component?: string = '';
  @Input() validationMessages: { [key: string]: string } = {};

  ngOnInit() {
    this.fg = new FormGroup({ [this.controlName]: new FormControl('') });
  }
}
