import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    MatIconModule, MatToolbarModule, MatSidenavModule, MatListModule, MatMenuModule, MatButtonModule, MatTooltipModule, MatDialog, MatDialogModule
} from '@angular/material';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppLayoutComponent } from './appLayout.component';
import { TranslatePipeModule } from 'src/app/common/pipes/translate/translatePipe.module';
import { FormLayoutComponent } from '../formLayout/formLayout.component';
import { PortalService } from 'src/app/common/services/portal.service';
import { ToasterModule } from 'src/app/common/components/toaster/toaster.module';
import { LoaderModule } from 'src/app/common/components/loader/loader.module';
import { ModalBaseModule } from '../../modals/modalBase/modalBase.module';

@NgModule({
  declarations: [
    AppLayoutComponent,
    FormLayoutComponent
  ],
  imports: [
      ToasterModule,
      LoaderModule,
      TranslatePipeModule,
      FormsModule,
      CommonModule,
      MatToolbarModule,
      MatIconModule,
      MatListModule,
      MatSidenavModule,
      BrowserAnimationsModule,
      RouterModule,
      MatMenuModule,
      MatButtonModule,
      MatTooltipModule,
      MatDialogModule,
      ModalBaseModule
  ],
  providers: [PortalService],
  bootstrap: [],
  exports: [
    AppLayoutComponent
  ]
})
export class AppLayoutModule { }
