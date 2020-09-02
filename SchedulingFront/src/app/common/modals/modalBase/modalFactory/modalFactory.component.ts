import { Component, Inject, ViewChild, ViewContainerRef, ComponentFactory, ComponentFactoryResolver, AfterViewInit, ComponentRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LoaderComponent } from 'src/app/common/components/loader/loader.component';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './modalFactory.component.html',
  styleUrls: ['./modalFactory.component.css']
})
export class ModalFactoryComponent implements AfterViewInit {
  @ViewChild('factory', { read: ViewContainerRef }) factory: ViewContainerRef;
  @ViewChild('loader') loader: LoaderComponent;
  closeSub: Subscription;
  comp: ComponentRef<any>;
  constructor(public dialogRef: MatDialogRef<ModalFactoryComponent>, private facResolver: ComponentFactoryResolver,
              @Inject(MAT_DIALOG_DATA) public data: ModalFactoryModel) {
  }
  ngAfterViewInit() {
    let compFactory: ComponentFactory<any>;
    compFactory = this.facResolver.resolveComponentFactory(this.data.type);
    this.comp = this.factory.createComponent(compFactory);
    this.comp.instance.initModal(this.loader);
    this.closeSub = this.comp.instance.closed.subscribe(() => this.hide());
  }

  hide() {
    this.closeSub.unsubscribe();
    this.dialogRef.close();
  }
}

export class ModalFactoryModel {
  type: any;
  title: string;

  constructor(type: any, title: string = null) {
    this.type = type;
    this.title = title;
  }
}
