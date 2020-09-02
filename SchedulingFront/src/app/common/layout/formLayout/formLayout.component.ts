import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ViewContainerRef,
  OnDestroy,
  ChangeDetectorRef,
  AfterViewInit,
  Renderer2
} from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PortalService } from 'src/app/common/services/portal.service';
import { Subscription } from 'rxjs';
import { trigger, transition, style, animate, query, group } from '@angular/animations';
import { LoaderService } from '../../components/loader/loader.service';
import { LoaderComponent } from '../../components/loader/loader.component';


// animations: [
//   trigger('routerAnimations', [
//     transition('* => *', [
//       query(':enter', test(0)),
//       query(':leave',
//         [
//           style({ opacity: 1 }),
//           animate('0.5s', style({ opacity: 0 }))
//         ],
//       ),
//       query(':enter',
//         [
//           style({ opacity: 0 }),
//           animate('0.5s', style({ opacity: 1 }))
//         ],
//         { optional: true }
//       )
//     ])
//   ])


function test(opacity: number, state) {
  return style({ opacity });
}
@Component({
  selector: 'form-layout',
  templateUrl: './formLayout.component.html',
  styleUrls: ['./formLayout.component.css'],
  encapsulation: ViewEncapsulation.None,
  // animations: [
  //   trigger('routeAnimations', [
  //     transition('* <=> *',         animate('225ms cubic-bezier(0.4,0.0,0.2,1)'))
  //   ])
  // ]
})
export class FormLayoutComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(private route: ActivatedRoute, private router: Router, private changeDetector: ChangeDetectorRef,
              private portalService: PortalService, private renderer: Renderer2) {
    this.disableActions = this.portalService.disableActions;
    // this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(route => {
    //   this.actions.clear();
    //   this.actions.createEmbeddedView(this.portalService.actions.value);

    //   console.log(this.portalService.filters.value)
    //   console.log(this.filters)
    //   this.filters.clear();
    //   this.filters.createEmbeddedView(this.portalService.filters.value);
    // });
    this.portalActions = this.portalService.actions.subscribe(res => {
      if (!this.actions || !res) {
        return;
      }
      this.actions.clear();
      this.actions.createEmbeddedView(res);
    });
    this.portalFilters = this.portalService.filters.subscribe(res => {
      console.log(res)
      if (!res) {
        this.showFilters = false;
        return;
      }
      this.showFilters = true;
      console.log(this.showFilters)
      setTimeout(() => {
        this.filters.clear();
        this.filters.createEmbeddedView(res);
      }, 1);

    });
    // this.portalTitle = this.portalService.title.subscribe(res => {
    //   this.title = res;
    // });
  }
  @ViewChild('actions', { read: ViewContainerRef }) actions: ViewContainerRef;
  @ViewChild('filters', { read: ViewContainerRef }) filters: ViewContainerRef;
  @ViewChild('loader') loader: LoaderComponent;
  showFilters = true;
  disableActions = false;
  title: string;
  portalActions: Subscription;
  portalTitle: Subscription;
  portalFilters: Subscription;
  loaderSub: Subscription;
  ngOnInit() {
    this.getTitle();
    this.portalTitle = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.getTitle();
      });
  }
  showFiltersFunc = () => {
    console.log(this.showFilters)
    return this.showFilters;
  };
  ngAfterViewInit() {
    if (this.portalService.actions && this.portalService.actions.value) {
      this.actions.createEmbeddedView(this.portalService.actions.value);
    }
    if (this.portalService.filters && this.portalService.filters.value) {
      this.filters.createEmbeddedView(this.portalService.filters.value);
    }
    this.changeDetector.detectChanges();

    this.loaderSub = LoaderService.loader.subscribe(res => {
      if (res) {
        this.loader.show();
        return;
      }
      this.loader.hide();
    });
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
    this.portalTitle.unsubscribe();
    this.portalFilters.unsubscribe();
    this.loaderSub.unsubscribe();
  }
  prepareRoute(outlet: RouterOutlet) {
    return 'test';
  }

}
