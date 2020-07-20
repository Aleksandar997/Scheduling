import { ErrorStateMatcher } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';

export class ErrorStateMatcherAdapter implements ErrorStateMatcher {
    private isSubmitted = false;
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        return !!(control && control.invalid && (
            (this.isSubmitted && !control.dirty && !control.touched) || (!this.isSubmitted && control.dirty && control.touched))
        );
    }
    submit() {
        this.isSubmitted = true;
    }
}
