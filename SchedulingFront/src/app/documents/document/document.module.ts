import { NgModule } from '@angular/core';
import { DocumentRoutingModule } from './document-routing.module';
import { DocumentComponent } from './document.component';
import { TranslatePipeModule } from 'src/app/common/pipes/translate/translatePipe.module';
import { MatCardModule, MatIconModule, MatButtonModule, MatInputModule, MatTableModule, MatTooltipModule, MatPaginatorModule, MatSortModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { PortalOutletDirectiveModule } from 'src/app/common/directives/portalOutlet/portalOutlet.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from 'src/app/common/components/loader/loader.module';
import { ToasterModule } from 'src/app/common/components/toaster/toaster.module';
import { DataGridModule } from 'src/app/common/components/dataGrid/dataGrid.module';
import { ClearInputOnBackspaceModule } from 'src/app/common/directives/clearInputOnBackspace/clearInputOnBackspace.module';
import { ActionComponent } from './action/action.component';
import { DetailActionModule } from 'src/app/common/components/detailAction/detailAction.module';
import { ModalBaseModule } from 'src/app/common/modals/modalBase/modalBase.module';

@NgModule({
  declarations: [
      DocumentComponent,
      ActionComponent
  ],
  imports: [
    DocumentRoutingModule,
    TranslatePipeModule,
    MatCardModule,
    PortalOutletDirectiveModule,
    FormsModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    LoaderModule,
    ToasterModule,
    MatInputModule,
    DataGridModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    ClearInputOnBackspaceModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DetailActionModule,
    ModalBaseModule
  ],
  providers: [],
  bootstrap: [],
  exports: [
    DocumentComponent
  ]
})
export class DocumentModule { }
