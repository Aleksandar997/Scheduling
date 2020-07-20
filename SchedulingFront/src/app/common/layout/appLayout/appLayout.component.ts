import { Component, Injector, OnDestroy, AfterViewInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Menu } from 'src/app/common/models/menu';
import { AuthenticationService } from 'src/app/common/services/authentication.service';
import { LocalData } from 'src/app/common/data/localData';
import { FormBase } from 'src/app/common/base/formBase';
import { Subscription } from 'rxjs';
import { CacheService } from 'src/app/common/services/cache.service';
import { ModalBaseComponent } from '../../modals/modalBase/modalBase.component';
import { MatDialog } from '@angular/material';
import { PasswordChangeComponent } from 'src/app/administration/users/passwordChange/passwordChange.component';
import { ModalFactoryModel } from '../../modals/modalBase/modalFactory/modalFactory.component';

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
export class AppLayoutComponent extends FormBase implements OnDestroy {
  modalBase = new ModalBaseComponent(this.dialog);
  menus: Array<Menu>;
  loggedUser: string;
  logoImage = 'assets/img/logo/logo.png';
  companyName;
  userSubscription: Subscription;
  constructor(private _injector: Injector, private authService: AuthenticationService, private dialog: MatDialog) {
    super(_injector);
    this.userSubscription = LocalData.user().subscribe(res => {
      if (!res) {
        return;
      }
      this.companyName = res.company.name;
      // this.logoImage = res.company.logo;
      this.menus = res.menus;
      this.loggedUser = `${res.firstName} ${res.lastName}`;
    });
    // LocalData.setUser(LocalData.getUser())
  }
  logout(): void {
    this.authService.logout('logout');
  }

  changePass() {
    LocalData.setReturnUrl(this.router.url);
    this.modalBase.openComponent(new ModalFactoryModel(PasswordChangeComponent, 'label_password_change'), 'password-change-modal');
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
