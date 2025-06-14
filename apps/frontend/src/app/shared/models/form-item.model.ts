// apps/frontend/src/app/shared/models/form-item.model.ts
export interface FormItem {
  controlName: string;
  label: string;
  type: 'text' | 'password' | 'email' | 'number' | 'textarea';
  id?: string;
}
