import { Component, OnInit, ViewChild, AfterViewInit, Injector } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { User, UserPaging } from 'src/app/common/models/user';
import { UserService } from 'src/app/services/user.service';
import { LocalData } from 'src/app/common/data/localData';
import { FormBase, ActionType } from 'src/app/common/base/formBase';
import { ModalFactoryModel } from 'src/app/common/modals/modalBase/modalFactory/modalFactory.component';
import { PasswordChangeComponent } from './passwordChange/passwordChange.component';
import { DataGridComponent } from 'src/app/common/components/dataGrid/dataGrid.component';
import { ResponseBase } from 'src/app/common/models/responseBase';

@Component({
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent extends FormBase implements OnInit, AfterViewInit {
  @ViewChild('userGrid') userGrid: DataGridComponent<User>;
  dataSource = new MatTableDataSource<User>();
  displayedColumns = ['firstName', 'lastName', 'identificationNumber', 'active', 'roles', 'sysDTCreated', 'actions'];
  paging = new UserPaging();
  filters = this.fb.group({
    firstName: new FormControl(),
    lastName: new FormControl()
  });
  datasourceLength;

  constructor(private inj: Injector, private fb: FormBuilder, private userService: UserService) {
    super(inj);
    this.genericName = 'user';
    this.filters.valueChanges.subscribe(res => {
      this.paging.assign(res);
      this.awaitExecution(() => this.getData());
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.getData();
  }

  getData() {
    this.execGetFunc(() => {
      return this.userService.getUsers(this.paging).then(res => {
        this.dataSource.data = res.data;
        this.datasourceLength = res.count;
      }) as Promise<ResponseBase<Array<User>>>;
    });
  }

  onRowClickLink = (user: User) => '/edit/' + user.userId;

  onPageChange(size: any) {
    this.paging.onPageChange(size);
    this.getData();
  }
  onSortChange(sort) {
    this.paging.onSortChange(sort);
    this.getData();
  }

  deleteUser(userId: number) {
    this.execFunc(() => {
      return this.userService.delete(userId).then(() => {
        this.getData();
      }) as Promise<ResponseBase<number>>;
    }, ActionType.Delete);
  }

  changePass(index: number) {
    this.userGrid.setCacheActivePage(index);
    LocalData.setReturnUrl(this.router.url);
    this.modal.openComponent(new ModalFactoryModel(PasswordChangeComponent, 'label_password_change'), 'password-change-modal');
  }
}
