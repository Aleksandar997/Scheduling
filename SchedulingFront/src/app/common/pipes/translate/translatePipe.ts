
import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { LocalData } from '../../data/localData';
import { Subscription } from 'rxjs';

@Pipe({
    name: 'translate'
})
export class TranslatePipe implements PipeTransform, OnDestroy {
    localization: any = null;
    localizationSubscription: Subscription;
    constructor() {
        this.localizationSubscription = LocalData.translates().subscribe(res => {
            if (!res) {
                return;
            }
            this.localization = res;
        });
    }

    transform = (resourceCode: string, trigger: any = null): string =>
        !this.localization || !this.localization[resourceCode] ? resourceCode : this.localization[resourceCode]

    ngOnDestroy = () =>
        this.localizationSubscription.unsubscribe()
}
