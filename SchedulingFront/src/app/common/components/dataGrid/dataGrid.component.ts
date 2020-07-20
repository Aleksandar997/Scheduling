import {
  Component,
  Input,
  ViewChild,
  ContentChildren,
  QueryList,
  AfterContentInit,
  ContentChild,
  Renderer2,
  AfterViewInit,
  RendererStyleFlags2,
  ViewChildren,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  MatTableDataSource,
  MatTable,
  MatColumnDef,
  MatPaginator,
  MatRow
} from '@angular/material';
import { BasePaging } from '../../models/basePaging';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { DeviceHelper } from '../../helpers/deviceHelper';

@Component({
  selector: 'data-grid',
  templateUrl: './dataGrid.component.html',
  styleUrls: ['./dataGrid.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class DataGridComponent<T> implements AfterContentInit, AfterViewInit, OnInit, OnDestroy {
  private static activePageCache = new Map<string, string>();
  @ContentChildren(MatColumnDef) columnDefs: QueryList<MatColumnDef>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @ContentChild(MatPaginator, { static: false }) paginatorContentChild: MatPaginator;
  @Input() serverSidePagination = true;
  @Input() expandableRows = false;
  @Input() gridName: string;
  @ContentChild('actions', { static: false }) actions;
  @ContentChild('expandedRow', { static: false }) expandedRow;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  expandedElement;
  @Input() displayedColumns;
  @Input() dataSource = new MatTableDataSource<T>();
  @Input() highlightPreviousVisitedRow: boolean;

  @ViewChildren(MatRow) matRows: QueryList<MatRow>;

  @Input() rowColorFunc: (item) => any;

  @Output() rowClickInvoke: EventEmitter<any> = new EventEmitter();
  @Input() onRowClickLink: (item) => any;

  dataSetter: Subject<any> = new Subject<any>();
  @Input() formArray;

  pageSizeOptions = [];

  dataSetterSub: Subscription;
  private isMobile = DeviceHelper.isMobile();
  private activePageData: string[] = [];
  constructor(private renderer: Renderer2, private router: Router) {
    this.dataSetterSub = this.dataSetter.subscribe(res => {
      if (Array.isArray(res) && res.length > 0) {
        this.dataSource.data = res;
        return;
      }
      this.dataSource.data = [...this.dataSource.data, res];
    });
  }

  getPaginatorLength() {
    const paginator = (this.serverSidePagination ? this.paginatorContentChild : this.dataSource.paginator);
    return paginator ? paginator.length : 0;
  }

  private activePageKey = () => this.gridName + 'activePage';
  // private activePageValue = (index: number = null) =>
  //      index ? `${this.paginatorRef.pageIndex};${index}` : `${this.paginatorRef.pageIndex}`;
  private activePageValue = (index: number = null) => `${this.dataSource.paginator.pageIndex};${index}`;
  setCacheActivePage = (index: number = null) => DataGridComponent.activePageCache.set(this.activePageKey(), this.activePageValue(index));

  getActionsHeight = (i: number) => document.getElementsByClassName('table-row').item(i).clientHeight;

  onRowClickFunc(row, index: number, target) {
    if (this.isMobile) {
      return;
    }
    if (this.expandableRows) {
      this.expandedElement = this.expandedElement === row ? null : row;
    }
    const route: string = this.onRowClickLink ? this.onRowClickLink(row) : null;
    if (target.path.find(x => x.className && x.className.includes('table-actions'))) {
      return;
    }
    this.setCacheActivePage(index);
    if (route) {
      this.router.navigate([this.router.routerState.snapshot.url + route]);
      return;
    }
    this.rowClickInvoke.emit();
  }

  ngOnInit() {
    const activePagePair: string = DataGridComponent.activePageCache.get(this.activePageKey());
    if (!activePagePair) {
      return;
    }
    this.activePageData = activePagePair.split(';');
  }

  ngOnDestroy() {
    this.dataSetterSub.unsubscribe();
  }

  ngAfterContentInit() {
    this.columnDefs.forEach(columnDef => {
      this.table.addColumnDef(columnDef);
    });
    this.pageSizeOptions =
      this.paginatorContentChild &&
      this.paginatorContentChild._displayedPageSizeOptions &&
      this.paginatorContentChild._displayedPageSizeOptions.length > 2 ?
        this.paginatorContentChild._displayedPageSizeOptions : BasePaging.pageSizeOptions;

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.serverSidePagination ? this.paginatorContentChild : this.paginator;
    if (this.formArray) {
      this.renderer.setAttribute(document.getElementById(this.gridName), 'formArray', this.formArray)
    }
    this.matRows.notifyOnChanges = () => {
      if (this.rowColorFunc) {
        this.dataSource.data.forEach((value, index) => {
          const color = this.rowColorFunc(value);
          if (color) {
            this.renderer.setStyle(
              document.getElementById(this.gridName + this.dataSource.paginator.pageIndex + ';' + index),
              'background',
              color,
              RendererStyleFlags2.Important + RendererStyleFlags2.DashCase);
          }
        });
      }
      if (this.serverSidePagination && this.dataSource.paginator) {
        this.dataSource.paginator.pageIndex = +(this.activePageData[0]);
      }
      if (!this.highlightPreviousVisitedRow || !(this.activePageData.length > 0)) {
        return;
      }
      this.renderer.setStyle(
        document.getElementById(this.gridName + this.activePageData.join(';')),
        'background',
        'lightblue',
        RendererStyleFlags2.Important + RendererStyleFlags2.DashCase);
    };
  }
}
