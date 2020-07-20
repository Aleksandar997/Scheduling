import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class PortalService {

  disableActions = false;
  outlet = new BehaviorSubject<TemplateRef<any>>(null);
  title = new BehaviorSubject<string>(null);
  constructor() { }
  registerOutlet(outlet: TemplateRef<any>) {
    this.outlet.next(outlet);
  }
  registerTitle(title: string) {
    this.title.next(title);
  }
}




