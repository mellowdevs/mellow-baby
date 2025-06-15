export interface FormItem {
  controlName: string;
  label: string;
  type: 'text' | 'password' | 'email' | 'number' | 'textarea';
  id?: string;
  validationMessages?: { [key: string]: string };
  component?: 'input' | 'password';
}
