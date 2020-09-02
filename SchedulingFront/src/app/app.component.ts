import { Component, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToasterComponent } from './common/components/toaster/toaster.component';
import { ToasterService } from './common/components/toaster/toaster.service';
import { RouterOutlet, Router, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import { trigger, transition, query, animate, style } from '@angular/animations';

function test(opacity: number, state) {
  return style({ opacity });
}

function asdf() {
  return [
    query(':enter', test(0, 'enter'), { optional: true }),
    query(':leave',
      [
        test(1, 'leave'),
        animate('0.5s', test(0, 'leave animate'))
      ], { optional: true },
    ),
    query(':enter',
      [
        test(0, 'enter'),
        animate('0.5s', test(1, 'enter animate'))
      ], { optional: true },
    )
  ];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // animations: [
  //   trigger('routeAnimations', [
  //     transition('* <=> *', asdf())
  //   ])
  // ]
})
export class AppComponent {
  @ViewChild('toaster') toaster: ToasterComponent;
  toasterSubscription: Subscription;
  title = 'Schedulingfront';

  constructor(private router: Router) {
    this.toasterSubscription = ToasterService.toaster.subscribe(res => {
      this.toaster.open(res);
    });
    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
          console.log('this.loadingRouteConfig = true;')
      } else if (event instanceof RouteConfigLoadEnd) {
          console.log('this.loadingRouteConfig = false;')
      }
  });
  }

  prepareRoute(outlet: RouterOutlet) {
    return 'test';
  }
}
