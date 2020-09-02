import { Component } from '@angular/core';

@Component({
    selector: 'loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.css']
})
export class LoaderComponent {

    constructor() { }

    showLoader = false;
    isLoaderHidden = false;
    show(forceShow = false) {
        if (forceShow) {
            setTimeout(() => {
                if (this.isLoaderHidden) {
                    return;
                }
                this.showLoader = true;
            }, 1);
            return;
        }
        setTimeout(() => {
            if (this.isLoaderHidden) {
                return;
            }
            this.showLoader = true;
        }, 500);
    }

    hide() {
        this.isLoaderHidden = true;
        this.showLoader = false;
    }
}
