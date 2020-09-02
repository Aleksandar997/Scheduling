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

export class DataGridComponentCache {
  static activePageCache = new Map<string, string>();
}

@Component({
  selector: 'data-grid',
  templateUrl: './dataGrid.component.html',
  styleUrls: ['./dataGrid.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class DataGridComponent<T> implements AfterContentInit, AfterViewInit, OnInit, OnDestroy {

  @ContentChildren(MatColumnDef) columnDefs: QueryList<MatColumnDef>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @ContentChild(MatPaginator) paginatorContentChild: MatPaginator;
  @Input() serverSidePagination = true;
  @Input() expandableRows = false;
  @Input() gridName: string;
  @ContentChild('actions') actions;
  @ContentChild('expandedRow') expandedRow;
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

  getSize() {
    return {
      pageSize: this.paginator.pageSize,
      pageIndex: this.paginator.pageIndex
    };
  }

  getPaginatorLength() {
    const paginator = (this.serverSidePagination ? this.paginatorContentChild : this.dataSource.paginator);
    return paginator ? paginator.length : 0;
  }

  private activePageKey = () => this.gridName + 'activePage';
  // private activePageValue = (index: number = null) =>
  //      index ? `${this.paginatorRef.pageIndex};${index}` : `${this.paginatorRef.pageIndex}`;
  private activePageValue = (index: number = null) => `${this.paginator.pageIndex};${index}`;
  setCacheActivePage = (index: number = null) =>
    DataGridComponentCache.activePageCache.set(this.activePageKey(), this.activePageValue(index))

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
    this.rowClickInvoke.emit(row);
    if (this.rowClickInvoke.observers.length > 0 || route) {
      document.getElementById(this.gridName).childNodes.item(1).childNodes.forEach(e => {
        if (e.nodeName === 'TR') {
          // this.renderer.setStyle(
          //   e,
          //   'background',
          //   'initial',
          //   RendererStyleFlags2.Important);
          this.renderer.removeClass(
            e,
            'highlight');
        }
      });
      this.setActivePage();
      this.setActivePageStyle();
    }
  }

  ngOnInit() {
    this.setActivePage();
    if (this.paginator.pageIndex !== +this.activePageData[0]) {
      this.paginator.pageIndex = +this.activePageData[0];
      // this.pageChange(
      //   {
      //     pageIndex: this.paginator.pageIndex,
      //     pageSize: this.paginator.pageSize
      //   });
    }
  }

  setActivePage() {
    const activePagePair: string = DataGridComponentCache.activePageCache.get(this.activePageKey());
    if (!activePagePair) {
      return;
    }
    this.activePageData = activePagePair.split(';');
  }

  setActivePageStyle() {
    const id = this.gridName + this.activePageData.join(';');
    if (!this.highlightPreviousVisitedRow ||
      !(this.activePageData.length > 0)
      || !id
      || +this.activePageData[0] !== this.paginator.pageIndex) {
      return;
    }
    const e = document.getElementById(id);
    if (!e) {
      return;
    }
    this.renderer.addClass(
      e,
      'highlight');
    // this.renderer.setStyle(
    //   document.getElementById(id),
    //   'background',
    //   'lightblue',
    //   RendererStyleFlags2.Important + RendererStyleFlags2.DashCase);
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

  pageChange(event) {
    this.paginatorContentChild.page.emit(event);
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
      this.setActivePageStyle();
    };
  }
}
