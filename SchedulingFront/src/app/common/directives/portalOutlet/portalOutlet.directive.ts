import { Directive, AfterViewInit, TemplateRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { PortalService } from '../../services/portal.service';

@Directive({
  selector: '[portalOutlet]'
})
export class PortalOutletDirective implements AfterViewInit {
  constructor(private portalService: PortalService, public templateRef: TemplateRef<any>, private changeDetector: ChangeDetectorRef) {
    this.portalService.registerActions(this.templateRef);
  }
  ngAfterViewInit() {
    // this.portalService.registerOutlet(this.templateRef);
  }
}

@Directive({
  selector: '[filtersPortalOutlet]'
})
export class FiltersPortalOutletDirective implements AfterViewInit {
  constructor(private portalService: PortalService, public templateRef: TemplateRef<any>, private changeDetector: ChangeDetectorRef) {
    this.portalService.registerFilters(this.templateRef);
  }
  ngAfterViewInit() {
    // this.portalService.registerOutlet(this.templateRef);
  }
}
