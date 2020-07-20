import { Injector } from '@angular/core';
import { LocalData } from '../../common/data/localData';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, AbstractControl, FormGroup, FormControl } from '@angular/forms';
import { TranslatePipe } from '../pipes/translate/translatePipe';

export abstract class FormBase {
    localization: any;
    activeRouter: ActivatedRoute;
    router: Router;
    translate: TranslatePipe;
    constructor(private injector: Injector) {
        this.localization = LocalData.getTranslations();
        this.activeRouter = injector.get(ActivatedRoute);
        this.translate = injector.get(TranslatePipe);
        this.router = injector.get(Router);
    }

    requiredLabel = (str: string) => str + ' *';

    addErrors(errors, formGroup: FormGroup) {
        if (!errors) {
            return;
        }
        Object.keys(errors).forEach(prop => {
            const orginialProp = prop;
            prop = prop.firstCharToLower();
            const propDotSplit = prop.split('.');
            this.setNestedErrors(propDotSplit, formGroup, errors[orginialProp]);
        });
    }
    private setNestedErrors(props: Array<string>, formGroup: FormGroup, error: string) {
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
    private setServerError(formControl: FormArray | AbstractControl, msg: string) {
        console.log(msg)
        if (formControl) {
            formControl.setErrors({
                serverError: msg
            });
        }
    }

    getServerError(form: FormGroup, control: string) {
        const formControl = this.getControls(form, control) as FormControl;
        if (!formControl || !formControl.errors || !formControl.errors.serverError) {
            return null;
        }
        return formControl.errors.serverError;
    }

    hasError(form: FormGroup, control: string, errorType = 'required') {
        const formControl = this.getControls(form, control);
        if (!formControl) {
            return null;
        }
        return formControl.hasError(errorType);
    }

    selectlistCompare = (selectedItem1: any, selectedItem2: any) => selectedItem1 == selectedItem2;

    getControls(form: FormGroup, control: string): FormControl | FormGroup | FormArray {
        const controls = control.split('.');
        const formControl = controls.shift();
        if (controls.length > 0) {
            return this.getControls(form.get(formControl) as FormGroup, controls.join('.'));
        } else {
            if (!form) {
                return null;
            }
            return form.get(formControl) as FormControl;
        }
    }

    getLocalization(key: string) {
        return this.translate.transform(key);
    }
}
