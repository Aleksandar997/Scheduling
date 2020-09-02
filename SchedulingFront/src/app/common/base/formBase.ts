import { Injector, EventEmitter } from '@angular/core';
import { LocalData } from '../../common/data/localData';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '../pipes/translate/translatePipe';
import { Platform } from '@angular/cdk/platform';
import { DeviceHelper } from '../helpers/deviceHelper';
import { PortalService } from '../services/portal.service';
import { FormGroup } from '@angular/forms';
import { FormGroupHelper } from '../helpers/formGroupHelper';
import { ToasterService } from '../components/toaster/toaster.service';
import { ModalBaseComponent } from '../modals/modalBase/modalBase.component';
import { MatDialog } from '@angular/material';
import { ModalBase } from '../models/modalBase';
import { ConfirmationModalComponent } from '../modals/confirmationModal/confirmationModal.component';
import { ResponseBase } from '../models/responseBase';
import { LoaderService } from '../components/loader/loader.service';

export abstract class FormBase {
    localization: any;
    activeRouter: ActivatedRoute;
    router: Router;
    translate: TranslatePipe;
    navigateBackUrl;
    portalService: PortalService;
    modal: ModalBaseComponent;
    loaderEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
    genericName = 'item';
    awaitExecutionExecuted = false;
    constructor(private injector: Injector) {
        this.localization = LocalData.getTranslations();
        this.activeRouter = injector.get(ActivatedRoute);
        this.portalService = injector.get(PortalService);
        this.translate = injector.get(TranslatePipe);
        this.router = injector.get(Router);
        this.isPhone = DeviceHelper.isMobile();
        this.modal = new ModalBaseComponent(this.injector.get(MatDialog));
    }

    isPhone = false;

    requiredLabel = (str: string) => str + ' *';

    selectlistCompare = (selectedItem1: any, selectedItem2: any) => selectedItem1 == selectedItem2;

    getNestedObjProp(item, path: string) {
        const props = path.split('.');
        const firstItem = item[props.shift().firstCharToLower()];
        if (props.length > 0) {
            return this.getNestedObjProp(firstItem, props.join('.'));
        }
        return firstItem;
    }
    getNestedPropName = (path: string) => path.split('.').pop().firstCharToLower();
    getLocalization(key: string) {
        return this.translate.transform(key);
    }

    execGetFunc(func: () => Promise<ResponseBase<any>>) {
        LoaderService.show();
        func().then(() => LoaderService.hide()).catch(err => {
            LoaderService.hide();
            console.log(err)
            ToasterService.handleErrors(err, 'error_global');
        });
    }

    execFunc(func: () => any,  actionType: ActionType = ActionType.Save, form: FormGroup = null) {
        if (form && !FormGroupHelper.isValid(form)) {
            ToasterService.openWarning(this.getLocalization('form_not_valid'));
            return;
        }
        const actionVal = ActionType[actionType].toLowerCase();
        this.modal.openDialog(
            new ModalBase(
                          `confirm_${this.genericName}_${actionVal}_title`,
                          `confirm_${this.genericName}_${actionVal}_text`,
                          null,
                          this.loaderEmitter, () => {
                this.loaderEmitter.emit(true);
                (func() as Promise<any>).then(() => {
                    this.loaderEmitter.emit(false);
                    this.modal.closeDialog();
                    ToasterService.openSuccess(`${this.genericName}_${actionVal}_success`);
                    if (this.navigateBackUrl) {
                        this.router.navigate([this.navigateBackUrl]);
                    }
                }).catch(err => {
                    if (form) {
                        form.addServerErrors(err.error);
                    }
                    this.loaderEmitter.emit(false);
                    ToasterService.openError(`${this.genericName}_${actionVal}_error`);
                });
            }), ConfirmationModalComponent);
    }

    awaitExecution(func: () => any, time: number = 600) {
        if (!this.awaitExecutionExecuted) {
            setTimeout(() => {
                func();
                this.awaitExecutionExecuted = false;
            }, time);
        }
        this.awaitExecutionExecuted = true;
    }
}

export enum ActionType { Save, Delete, Cancel }
