import { FormGroup, FormArray, FormControl, AbstractControl } from '@angular/forms';

export class FormGroupHelper {
    static disabledProps: Array<string> = new Array<string>();
    private static isFormValid = true;
    static mapFormGroupToObject<T>(formGroup: FormGroup, type: new () => T) {
        let obj = this.createEntity(type);
        obj = formGroup.getRawValue();
        return obj as T;
    }

    static setDisabledProp(props: Array<string>) {
        this.disabledProps = [...this.disabledProps, ...props];
    }

    static isValid(form, assignValidProp = true) {
        this.isFormValid = assignValidProp ? true : this.isFormValid;
        if (this.isFormValid) {
            if (form instanceof FormGroup) {
                Object.keys(form.controls).forEach(k => {
                    this.isFormValid = this.isValid(form.get(k) as FormGroup, false);
                });
            } else if (form instanceof FormControl) {
                this.isFormValid = this.isFormControlValid(form);
            } else if (form instanceof FormArray) {
                form.controls.forEach(e => {
                    this.isFormValid = this.isValid(e, false);
                });
            }
        }
        return this.isFormValid;
    }

    private static isFormControlValid = (formControl: FormControl) => formControl.status !== 'INVALID';

    static mapControlsToFormGroup(props: Array<string>, object: any, formGroup: FormGroup) {
        props.forEach(p => {
            if (p.includes('.')) {
                this.mapNestedControl(p.split('.'), object, formGroup);
            } else {
                const propNamee = p.firstCharToLower();
                formGroup.addControl(propNamee, new FormControl(object[propNamee]));
            }
        });
    }

    private static mapNestedControl(prop: Array<string>, object: any, formGroup: FormGroup) {
        if (prop.length === 0) {
            return;
        }
        const next = prop.shift().firstCharToLower();
        const objValue = object[next];
        let c = formGroup.get(next);
        if (prop.length > 0) {
            if (!c) {
                c = formGroup;
            } else {
                this.mapNestedControl(prop, objValue, c as FormGroup);
                return;
            }
            (c as FormGroup).addControl(next, new FormGroup({}))
            this.mapNestedControl(prop, objValue, c.get(next) as FormGroup);
        } else {
            formGroup.addControl(next, new FormControl(object[next]));
        }

    }

    static async mapObjectToFormGroup(obj: any, formGroup: FormGroup, firstCicle = true) {
        if (firstCicle) {
            this.disabledProps = new Array<string>();
        }
        if (!obj) {
            return;
        }
        Object.keys(obj).forEach(p => {
            if (!formGroup.get(p)) {
                return;
            }
            if (this.isDisabled(formGroup.get(p))) {
                let disabledProps = [p];
                if (formGroup.get(p) instanceof FormGroup) {
                    disabledProps = Object.keys((formGroup.get(p) as FormGroup).controls);
                }
                this.setDisabledProp(disabledProps);
            }
            if (formGroup.get(p) != null) {
                formGroup.get(p).enable({ onlySelf: true });
            }
            if (obj[p] instanceof Array) {
                if (formGroup.get(p) instanceof FormArray || formGroup.get(p) instanceof Array) {
                    const formArray = formGroup.get(p) as FormArray;
                    obj[p].forEach(child => {
                        formArray.push(this.getFormGroup(child));
                        this.mapObjectToFormGroup(child, formArray.at(obj[p].indexOf(child)) as FormGroup, false);
                    });
                } else {
                    formGroup.get(p).setValue(obj[p]);
                }
            } else if (formGroup.contains(p)) {
                if (formGroup.get(p) instanceof FormGroup) {
                    this.mapObjectToFormGroup(obj[p], formGroup.get(p) as FormGroup, false);
                } else {
                    formGroup.get(p).setValue(obj[p]);
                    if (this.disabledProps.includes(p)) {
                        formGroup.get(p).disable({ onlySelf: true });
                    }
                }
            }
        });
    }

    private static isDisabled = (control: AbstractControl) => control && control.status === 'DISABLED';

    static async mapArrayToFormArray(objs: Array<any>, formArray: FormArray) {
        formArray.clear();
        objs.forEach(obj => {
            formArray.push(this.getFormGroup(obj));
            this.mapObjectToFormGroup(obj, formArray.at(objs.indexOf(obj)) as FormGroup, false);
        });
    }

    static createEntity<T>(type: new () => T): T {
        return new type();
    }

    static getFormGroup(obj: any, _formGroup: FormGroup = null) {
        const formGroup = _formGroup ? _formGroup : new FormGroup({});
        Object.keys(obj).forEach(p => {
            if (obj[p] != null) {
                let formControl = null;
                if (Object.keys(obj[p]).length > 0 && !(obj[p] instanceof Array) && (typeof obj[p] !== 'string')) {
                    formControl = new FormGroup({});
                    this.getFormGroup(obj[p], formControl);
                } else {
                    formControl = new FormControl();
                }
                formGroup.addControl(p, formControl);
            }
        });
        return formGroup;
    }
}
