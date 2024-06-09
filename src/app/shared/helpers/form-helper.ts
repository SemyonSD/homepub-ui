import {FormGroup} from "@angular/forms";

type ErrorMessage = {[key: string]: string}


export const ERRORS_MESSAGES: ErrorMessage = {
  required: 'Field is required'
}

export class FormHelper {
  private form: FormGroup;

  constructor(form: FormGroup) {
    this.form = form;
  }

  public getErrorsMessages(controlName?: string): string[] {
    if (controlName) {
      const errors = Object.keys(this.form.get(controlName)?.errors || {}).map(errorKey => ERRORS_MESSAGES[errorKey] || 'Unknown error')
      if (this.form.get(controlName)?.touched) {
        return errors;
      }
    }
    return Object.keys(this.form.errors || {}).map(errorKey => ERRORS_MESSAGES[errorKey] || 'Unknown error')
  }
}
