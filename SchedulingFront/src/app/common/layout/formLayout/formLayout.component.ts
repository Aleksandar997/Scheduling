import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ViewContainerRef,
  OnDestroy,
  ChangeDetectorRef,
  AfterViewInit
} from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PortalService } from 'src/app/common/services/portal.service';
import { Subscription } from 'rxjs';
import { ToasterComponent } from 'src/app/common/components/toaster/toaster.component';

@Component({
  selector: 'form-layout',
  templateUrl: './formLayout.component.html',
  styleUrls: ['./formLayout.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FormLayoutComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(private route: ActivatedRoute, private router: Router, private changeDetector: ChangeDetectorRef,
              private portalService: PortalService) {
    this.disableActions = this.portalService.disableActions;
    this.portalActions = this.portalService.outlet.subscribe(res => {
      if (!this.actions) {
        return;
      }
      this.actions.clear();

      if (!res) {
        return;
      }
      this.actions.createEmbeddedView(res);
    });
    this.portalTitle = this.portalService.title.subscribe(res => {
      this.title = res;
    });
  }
  @ViewChild('actions', { static: false, read: ViewContainerRef }) actions: ViewContainerRef;
  @ViewChild('toaster', { static: false }) toaster: ToasterComponent;
  disableActions = false;
  title: string;
  portalActions: Subscription;
  portalTitle: Subscription;
  ngOnInit() {
    this.getTitle();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.getTitle();
      });
  }

  ngAfterViewInit() {
    if (this.portalService.outlet && this.portalService.outlet.value) {
      this.actions.createEmbeddedView(this.portalService.outlet.value);
      this.changeDetector.detectChanges();
    }
  }
  private getTitle() {
    let currentRoute = this.route.root;
    do {
      const childrenRoutes = currentRoute.children;
      currentRoute = null;
      childrenRoutes.forEach(route => {
        if (route.outlet === 'primary') {
          const data: any = route.snapshot.data;
          if (data.title) {
            this.title = data.title;
          }
          currentRoute = route;
        }
      });
    } while (currentRoute);
  }

  ngOnDestroy() {
    this.portalActions.unsubscribe();
  }

}
