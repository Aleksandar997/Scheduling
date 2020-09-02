import { Component, OnInit, Input, AfterViewInit, ViewChild, Injector, EventEmitter, ContentChild, AfterContentInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';
import { CodebookService } from '../../services/codebook.service';
import { LoaderComponent } from '../loader/loader.component';
import { CodebookPaging } from '../../models/iCodebookBase';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { FormBase } from '../../base/formBase';
import { ModalBaseComponent } from '../../modals/modalBase/modalBase.component';
import { CodebookEditComponent, CodebookData } from '../../modals/codebookEdit/CodebookEdit.component';
import { ModalBase } from '../../models/modalBase';
import { ToasterService } from '../toaster/toaster.service';
import { PortalService } from '../../services/portal.service';
import { ResponseBase } from '../../models/responseBase';
import { CodebookOutputModel } from '../../models/codebookOutputModel';

@Component({
  selector: 'codebook',
  templateUrl: './codebookBase.component.html',
  styleUrls: ['./codebookBase.component.css']
})
export class CodebookBaseComponent extends FormBase implements OnInit, AfterViewInit, AfterContentInit {
  // @ViewChild('actionsTemplate', { static: false, read: ViewContainerRef }) actionsTemplate;
  // @ContentChild('actions', { static: false }) actions;
  // contentChildActions = false;
  @ViewChild('actions', { static: true }) actions;
  @Input() enableActionForm = false;
  @ViewChild('loader') loader: LoaderComponent;
  @Input() displayColumns = [];
  matColumnsDef = [];
  @Input() code = '';
  url: string;
  @Input() disableAdd = false;
  @Input() type;
  filters = this.fb.group({
    name: new FormControl(),
    code: new FormControl()
  });
  paging = new CodebookPaging();
  datasourceLength;
  dataSource = new MatTableDataSource<any>();
  constructor(private _injector: Injector, private activatedRoute: ActivatedRoute,
              private fb: FormBuilder, private codebookService: CodebookService) {
    super(_injector);
    this.code = this.activatedRoute.snapshot.data.code;
    this.url = this.activatedRoute.snapshot.data.url;
  }
  ngAfterViewInit() {
    setTimeout(() => this.portalService.registerActions(this.actions), 1);
    // if (this.contentChildActions) {
    //   this.actionsTemplate.createEmbeddedView(this.actions);
    // }
    this.getData();
  }

  ngAfterContentInit() {
    // this.contentChildActions = this.actions != null;
  }

  edit(id: number) {
    if (this.enableActionForm) {
      this.router.navigateByUrl(this.router.url + '/edit/' + id);
      return;
    }
    this.modal.openDialog(
      new ModalBase(
        'confirm' + this.code.insertStringBetweenUpper('_') + '_edit_title',
        null,
        new CodebookData(id, this.codebookService, this.type),
        null,
        () => this.getData()
      ), CodebookEditComponent);
  }

  ngOnInit() {
    this.codebookService.setCodebookUrl(this.url);
    this.filters.valueChanges.subscribe(res => {
      this.paging.assign(res);
      this.awaitExecution(() => this.getData());
    });
    this.matColumnsDef = this.displayColumns.filter(x => x !== 'actions');
  }

  getData() {
    this.execGetFunc(() => {
      return this.codebookService.getAll(this.paging).then(res => {
        this.dataSource.data = res.data.data;
        this.dataSource._updateChangeSubscription();
        this.datasourceLength = 10;
      }) as Promise<ResponseBase<CodebookOutputModel<any>>>;
    });
  }
  onPageChange(size: any) {
    this.paging.onPageChange(size);
    this.getData();
  }
  onSortChange(sort) {
    this.paging.onSortChange(sort);
    this.getData();
  }
}


