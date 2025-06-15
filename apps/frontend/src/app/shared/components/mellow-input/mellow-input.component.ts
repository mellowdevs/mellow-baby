import { Component, Input } from '@angular/core';
import { CommonModule, KeyValuePipe, NgFor } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TranslocoModule } from '@ngneat/transloco';

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
  ],
  templateUrl: './mellow-input.component.html',
  styleUrl: './mellow-input.component.scss',
})
export class MellowInputComponent {
  // We now accept the FormControl instance directly as an input!
  @Input() control!: FormControl;

  @Input() id: string = '';
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() validationMessages: { [key: string]: string } = {};

  ngOnInit() {
    Object.keys(this.validationMessages).forEach((msg) => {
      console.log(msg);
      console.log(this.control, this.control.hasError(msg));
    });
  }
}
