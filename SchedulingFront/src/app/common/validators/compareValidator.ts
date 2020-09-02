import { FormGroup, FormControl, FormArray } from '@angular/forms';

export function isArrayEmpty(control: FormArray) {
    if (control.value.length < 1) {
        return {
            required: true
        };
    }
}

