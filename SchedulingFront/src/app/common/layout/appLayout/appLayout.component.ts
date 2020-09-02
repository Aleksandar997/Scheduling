import { Component, Injector, OnDestroy, OnInit, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Menu } from 'src/app/common/models/menu';
import { AuthenticationService } from 'src/app/common/services/authentication.service';
import { LocalData } from 'src/app/common/data/localData';
import { FormBase } from 'src/app/common/base/formBase';
import { Subscription } from 'rxjs';
import { ModalBaseComponent } from '../../modals/modalBase/modalBase.component';
import { MatDialog, MatDrawer } from '@angular/material';
import { PasswordChangeComponent } from 'src/app/administration/users/passwordChange/passwordChange.component';
import { ModalFactoryModel } from '../../modals/modalBase/modalFactory/modalFactory.component';
import { SignalRService } from '../../services/signal-r.service';
import { Settings } from '../../settings/settings';
import { ToasterService, Notification, ToasterStatus } from '../../components/toaster/toaster.service';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ProgressLoaderComponent } from '../../components/progressLoader/progressLoader.component';
import { ChartCacheService } from 'src/app/charts/chartCache.service';
import { ThemeService } from '../../theme/theme.service';
import { Theme } from '../../theme/themeModel';

@Component({
  templateUrl: './appLayout.component.html',
  styleUrls: ['./appLayout.component.css'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class AppLayoutComponent extends FormBase implements OnDestroy, OnInit, AfterViewInit {
  @ViewChild('loader') loader: LoaderComponent;
  @ViewChild(ProgressLoaderComponent) progressLoader: ProgressLoaderComponent;
  modalBase = new ModalBaseComponent(this.dialog);
  menus: Array<Menu>;
  loggedUser: string;
  logoImage;
  companyName;
  userSubscription: Subscription;
  themeSubscription: Subscription;
  signalSubscription: Subscription;
  notificationsArray = new Array<Notification>();
  themes = new Array<Theme>();
  sidebarRef;
  // aciveThemeId;
  constructor(private _injector: Injector, private authService: AuthenticationService, private dialog: MatDialog,
              private signalRService: SignalRService, private renderer: Renderer2, private themeService: ThemeService) {
    super(_injector);
    this.themeService.selectAll();
    this.themeSubscription = this.themeService.themes.subscribe(res => {
      this.themes = res;
    });
    ToasterService.initCacheNotificationData();
    this.signalRService.buildConnection();
    this.userSubscription = LocalData.user().subscribe(res => {
      if (!res) {
        return;
      }
      if (res.employeeId) {
        this.signalRService.startConnection();
      }
      this.companyName = res.company.name;
      this.logoImage = Settings.FileServerUrl + res.company.logo;
      this.menus = res.menus;
      this.loggedUser = `${res.firstName} ${res.lastName}`;
    });
    LocalData.chartMetaData().subscribe(res => {
      ChartCacheService.set(res);
    });
    ToasterService.notifications.subscribe(res => {
      this.notificationsArray = res;
    });
  }
  ngAfterViewInit() {
    this.sidebarRef = document.getElementById('sidebar');
    // this.execGetFunc(() => {
    //   return this.themeService.selectAll().then(res => {
    //     this.themes = res.data;
    //   }) as Promise<ResponseBase<Array<Theme>>>;
    // });
  }
  logout(): void {
    this.authService.logout('logout');
  }
  changeTheme(theme: Theme) {
    this.themeService.setTheme(theme);
  }
  getStatusCode = (status: ToasterStatus) => ToasterService.getStatusCode(status);

  clearToasterNotifications = () => {
    this.progressLoader.show();
    // 1163
    this.progressLoader.timedClose(() => ToasterService.clearCache(), 1200);
  }

  changePass() {
    LocalData.setReturnUrl(this.router.url);
    this.modalBase.openComponent(new ModalFactoryModel(PasswordChangeComponent, 'label_password_change'), 'password-change-modal');
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.signalSubscription.unsubscribe();
    this.themeSubscription.unsubscribe();
  }

  viewNotification(urlPath: string) {
    if (!urlPath) {
      return;
    }
    this.router.navigateByUrl(urlPath, { state: { prevUrl: this.router.url } });
  }

  ngOnInit() {
    this.signalSubscription = this.signalRService.signalReceived.subscribe((scheduleId: any) => {
      // this.menus.find(x => x.name === 'Schedules').notificationCount += 1;
      ToasterService.openNotify('new_schedule_added', '/schedules/view/' + scheduleId);
    });
  }

  getNotificationIcon = (status: ToasterStatus) => ToasterService.getNotificationIcon(status);

  swipeLeft() {
    document.getElementById('sidebar').blur();
  }
  swipeRight() {
    document.getElementById('sidebar').focus();
  }

  getNotificationNumber = () => ToasterService.newNotificationNumber;
  openNotifications() {
    ToasterService.newNotificationNumber = 0;
  }
}
