import { FormBase } from './formBase';
import { Injector, ViewChild } from '@angular/core';
import { ResponseBase } from '../models/responseBase';
import { LoaderComponent } from '../components/loader/loader.component';
import { ToasterService } from '../components/toaster/toaster.service';
import { actionEnum } from '../enums';
import { FormBuilder } from '@angular/forms';
import { LoaderService } from '../components/loader/loader.service';

export class ActionFormBase<T> extends FormBase {
    @ViewChild('loader') loader: LoaderComponent;
    action: actionEnum;
    fb: FormBuilder;
    constructor(private injectorAction: Injector) {
        super(injectorAction);
        this.action = this.activeRouter.snapshot.data.action as actionEnum;
        this.fb = this.injectorAction.get(FormBuilder);
    }

    getById(func: (id: number) => Promise<ResponseBase<T>>) {
        LoaderService.show();
        func(this.getId()).then(() => LoaderService.hide()).catch(err => {
            LoaderService.hide();
            ToasterService.handleErrors(err, 'error_global');
        });
    }

    areControlsDisabled = () => this.action === actionEnum.View;

    getId = () => {
        const id = +this.activeRouter.snapshot.params.id;
        return id ? id : 0;
    }

    navigateBack() {
        this.router.navigate([this.navigateBackUrl]);
      }

}
