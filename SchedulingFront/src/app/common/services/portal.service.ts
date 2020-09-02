import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class PortalService {

  disableActions = false;
  actions = new BehaviorSubject<TemplateRef<any>>(null);
  filters = new BehaviorSubject<TemplateRef<any>>(null);
  title = new BehaviorSubject<string>(null);
  constructor() { }
  registerActions(outlet: TemplateRef<any>) {
    this.actions.next(outlet);
  }

  registerFilters(outlet: TemplateRef<any>) {
    this.filters.next(outlet);
  }

  clearFilters() {
    this.filters.next(null);
  }

  registerTitle(title: string) {
    this.title.next(title);
  }
}




