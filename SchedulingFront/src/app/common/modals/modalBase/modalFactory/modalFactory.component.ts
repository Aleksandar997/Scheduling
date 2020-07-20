import { Component, Inject, ViewChild, ViewContainerRef, ComponentFactory, ComponentFactoryResolver, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LoaderComponent } from 'src/app/common/components/loader/loader.component';
import { ToasterComponent } from 'src/app/common/components/toaster/toaster.component';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './modalFactory.component.html',
  styleUrls: ['./modalFactory.component.css']
})
export class ModalFactoryComponent implements AfterViewInit {
  @ViewChild('factory', { static: false, read: ViewContainerRef }) factory: ViewContainerRef;
  @ViewChild('toaster', { static: false }) toaster: ToasterComponent;
  @ViewChild('loader', { static: false }) loader: LoaderComponent;
  closeSub: Subscription;
  constructor(public dialogRef: MatDialogRef<ModalFactoryComponent>, private facResolver: ComponentFactoryResolver,
              @Inject(MAT_DIALOG_DATA) public data: ModalFactoryModel) {
  }
  ngAfterViewInit() {
    let compFactory: ComponentFactory<any>;
    compFactory = this.facResolver.resolveComponentFactory(this.data.type);
    const comp = this.factory.createComponent(compFactory);
    comp.instance.initLogged(this.loader, this.toaster);
    this.closeSub = comp.instance.closed.subscribe(() => this.hide());
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
