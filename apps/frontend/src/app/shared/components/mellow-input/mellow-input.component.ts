import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

let nextId = 0; // A simple counter to ensure unique IDs

/**
 *A reusable custom form input component that encapsulates a label
 * and input elements
 * @class MellowInputComponent
 */
@Component({
  selector: 'app-mellow-input',
  imports: [CommonModule, FormsModule, InputTextModule, FloatLabelModule, TranslocoModule],
  templateUrl: './mellow-input.component.html',
  styleUrl: './mellow-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MellowInputComponent),
      multi: true,
    },
  ],
})
export class MellowInputComponent implements ControlValueAccessor {
  /** The unique ID for the input element. Auto-generated if not provided. */
  @Input() id: string = `mellow-input-${nextId++}`;
  /**
   *
   * The label field that will be shown on input field
   * @type {string}
   * @memberof MellowInputComponent
   */
  @Input() label: string = '';
  /**
   *
   * The type that will be used for input type
   * @type {string}
   * @memberof MellowInputComponent
   */
  @Input() type: string = 'text';

  protected value: string = '';
  protected isDisabled: boolean = false;
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  /**
   * Writes a new value to the element
   * Called by FormsAPI to update the view.
   * @param value - new value for the input
   */
  writeValue(value: string): void {
    this.value = value;
  }

  /**
   * Registers a callback function that is called when the control's value changes in the UI.
   * @param fn The callback function to register.
   */
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  /**
   * Registers a callback function that is called by the forms API on "touched" events.
   * @param fn The callback function to register.
   */
  registerOnTouched(fn: (value: string) => void): void {}

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.onTouched();
  }

  /**
   * Sets the disabled state of the control.
   * @param isDisabled Whether the control should be disabled.
   */
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
