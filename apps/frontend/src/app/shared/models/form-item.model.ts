export interface FormItem {
  controlName: string;
  label: string;
  type: 'text' | 'password' | 'email' | 'number' | 'textarea';
  id?: string;
}
