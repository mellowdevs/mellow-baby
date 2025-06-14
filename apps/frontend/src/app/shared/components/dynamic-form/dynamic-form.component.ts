import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MellowInputComponent } from '../mellow-input/mellow-input.component';
import { FormItem } from '../../models/form-item.model';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MellowInputComponent],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',
})
export class DynamicFormComponent {
  /** The FormGroup instance passed from the parent component. */
  @Input() form!: FormGroup;

  /** The configuration array that defines the form's fields. */
  @Input() formItems: FormItem[] = [];
}
