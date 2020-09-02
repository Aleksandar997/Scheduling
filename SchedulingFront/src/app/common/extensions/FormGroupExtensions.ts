import { FormGroup, FormControl, FormArray, AbstractControl } from '@angular/forms';

declare module '@angular/forms' {
    interface FormGroup {
        getControls: (control: string) => FormControl | FormGroup | FormArray;
        getServerError: (control: string) => any;
        hasError: (control: string, errorType?: string) => any;
        addServerErrors: (errors) => void;
    }
    // interface AbstractControl {
    //     private setServerError: (msg: string) => void;
    // }
}

FormGroup.prototype.getControls = function(control: string) {
    const controls = control.split('.');
    const formControl = controls.shift();
    if (controls.length > 0) {
        return this.get(formControl).getControls(controls.join('.'));
    } else {
        if (!this) {
            return null;
        }
        return this.get(formControl) as FormControl;
    }
};

FormGroup.prototype.getServerError = function(control: string) {
    const formControl = this.getControls(control) as FormControl;
    if (!formControl || !formControl.errors || !formControl.errors.serverError) {
        return null;
    }
    return formControl.errors.serverError;
};

FormGroup.prototype.hasError = function(control: string, errorType = 'required') {
    const formControl = this.getControls(control);
    if (!formControl) {
        return null;
    }
    return formControl.hasError(errorType);
};
FormGroup.prototype.addServerErrors = function(errors) {
    if (!errors) {
        return;
    }
    Object.keys(errors).forEach(prop => {
        const orginialProp = prop;
        prop = prop.firstCharToLower();
        const propDotSplit = prop.split('.');
        FormGroupHelper.setNestedErrors(propDotSplit, this, errors[orginialProp]);
    });
}

class FormGroupHelper {
    static setNestedErrors(props: Array<string>, formGroup: FormGroup, error: string) {
        const prop = props.shift();
        let formControl = null;
        if (!prop.includes('[')) {
            if (!formGroup) {
                return;
            }
            formControl = formGroup.get(prop.firstCharToLower());
            if (props.length === 0) {
                this.setServerError(formControl, error);
                return;
            }
            this.setNestedErrors(props, formControl, error);
        } else {
            const propBracketSplit = prop.split('[');
            const index = propBracketSplit[1].split(']')[0];
            const formControlParent = formGroup.get(propBracketSplit[0]) as FormArray;
            this.setNestedErrors(props, formControlParent.controls[index], error);
        }
    }
    static setServerError(formControl: FormArray | AbstractControl, msg: string) {
        if (formControl) {
            formControl.setErrors({
                serverError: msg
            });
        }
    }
}
