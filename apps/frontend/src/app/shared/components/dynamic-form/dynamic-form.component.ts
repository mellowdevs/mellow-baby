import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MellowInputComponent } from '../mellow-input/mellow-input.component';
import { FormItem } from '../../models/form-item.model';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MellowInputComponent, TranslocoModule],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',
})
export class DynamicFormComponent {
  /** The FormGroup instance passed from the parent component. */
  @Input() form!: FormGroup;

  /** The configuration array that defines the form's fields. */
  @Input() formItems: FormItem[] = [];

  /**
   * A helper method to get a form control from the form group and cast it to a FormControl.
   * This is used in the template to satisfy TypeScript's strict type checking.
   * @param controlName The name of the control to get.
   * @returns The control as a FormControl instance.
   */
  getFormControl(controlName: string): FormControl {
    return this.form.get(controlName) as FormControl;
  }
}
