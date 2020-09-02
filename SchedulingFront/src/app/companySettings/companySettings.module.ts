import { NgModule } from '@angular/core';
import { CodebookBaseModule } from '../common/components/codebookBase/codebookBase.module';
import { CompanySettingsComponent } from './companySettings.component';
import { CompanySettingsRoutingModule } from './companySettings-routing.module';
import { TranslatePipeModule } from '../common/pipes/translate/translatePipe.module';
import { MatCardModule, MatIconModule, MatButtonModule, MatInputModule, MatTooltipModule, MatSelectModule, MatExpansionModule } from '@angular/material';
import { PortalOutletDirectiveModule } from '../common/directives/portalOutlet/portalOutlet.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../common/components/loader/loader.module';
import { ModalBaseModule } from '../common/modals/modalBase/modalBase.module';
import { FileUploadModule } from '../common/components/fileUpload/fileUpload.module';
import { ThemeManagerService } from '../common/theme/themeManager.service';


@NgModule({
  declarations: [
    CompanySettingsComponent
  ],
  imports: [
    CompanySettingsRoutingModule,
    CodebookBaseModule,
    TranslatePipeModule,
    MatCardModule,
    PortalOutletDirectiveModule,
    FormsModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    LoaderModule,
    MatInputModule,
    MatTooltipModule,
    ModalBaseModule,
    FileUploadModule,
    MatSelectModule,
    MatExpansionModule
  ],
  providers: [],
  bootstrap: []
})
export class CompanySettingsModule { }
