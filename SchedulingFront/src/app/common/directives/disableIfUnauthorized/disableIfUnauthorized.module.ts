import { NgModule } from '@angular/core';
import { DisableIfUnauthorizedDirective } from './disableIfUnauthorized.directive';

@NgModule({
    declarations: [
        DisableIfUnauthorizedDirective
    ],
    exports: [
        DisableIfUnauthorizedDirective
    ],
  })
  export class DisableIfUnauthorizedDirectiveModule { }
