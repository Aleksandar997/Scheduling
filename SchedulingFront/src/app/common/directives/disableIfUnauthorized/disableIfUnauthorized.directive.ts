import { Directive, ElementRef } from '@angular/core';
import { LocalData } from '../../data/localData';

@Directive({
  selector: '[disableIfUnauthorized]'
})
export class DisableIfUnauthorizedDirective {

  constructor(private el: ElementRef) {
    if (!LocalData.isUserAdmin()) {
      this.el.nativeElement.style.display = 'none';
    }
  }

}
