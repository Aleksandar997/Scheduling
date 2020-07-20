import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive({
  selector: '[clearInputOnBackspace]'
})
export class ClearInputOnBackspaceDirective {

  @Input('controlBind') ControlBind: FormControl | any;
  constructor(public element: ElementRef) {
  }


  @HostListener('keydown.backspace')
  onBackspace() {
    if (this.ControlBind instanceof FormControl) {
      this.ControlBind.setValue(null);
      return;
    }
    this.ControlBind = null;
  }

}
