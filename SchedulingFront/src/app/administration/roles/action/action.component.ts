import { Component, OnInit, Injector, AfterViewInit, ViewChild } from '@angular/core';
import { ActionFormBase } from 'src/app/common/base/actionFormBase';
import { Role } from 'src/app/common/models/role';
import { RoleService } from 'src/app/common/services/role.service';
import { ResponseBase } from 'src/app/common/models/responseBase';
import { FormControl, FormArray, Validators } from '@angular/forms';
import { FormGroupHelper } from 'src/app/common/helpers/formGroupHelper';
import { TreeViewConfig } from 'src/app/common/components/treeView/ITreeViewBase';
import { TreeViewComponent } from 'src/app/common/components/treeView/treeView.component';
import { Permission } from 'src/app/common/models/permission';
import { Menu } from 'src/app/common/models/menu';
import { ActionType } from 'src/app/common/base/formBase';

@Component({
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent extends ActionFormBase<Role> implements OnInit, AfterViewInit {
  @ViewChild('treeViewMenus') treeViewMenus: TreeViewComponent;
  @ViewChild('treeViewPermissions') treeViewPermissions: TreeViewComponent;
  form = this.fb.group({
    roleId: new FormControl({ value: null, disabled: this.areControlsDisabled() }),
    name: new FormControl({ value: null, disabled: this.areControlsDisabled() }, [Validators.required]),
    code: new FormControl({ value: null, disabled: this.areControlsDisabled() }, [Validators.required]),
    active: new FormControl({ value: false, disabled: this.areControlsDisabled() }),
    menus: new FormArray([]),
    permissions: new FormArray([])
  });
  menusConfig = new TreeViewConfig('menuId', 'parentId', 'children');
  permissionConfig = new TreeViewConfig('permissionId', 'parentId', 'children');
  permissionsExpanded = false;
  menusExpanded = false;
  constructor(private inj: Injector, private roleService: RoleService) {
    super(inj);
    this.navigateBackUrl = 'administration/roles';
    this.genericName = 'role';
  }
  ngAfterViewInit(): void {
    this.getById((id: number) => {
      return this.roleService.selectById(id).then(res => {
        this.treeViewMenus.setDatasource(res.data.menus);
        this.treeViewPermissions.setDatasource(res.data.permissions);
        this.permissionsExpanded = true;
        this.menusExpanded = true;
        FormGroupHelper.mapObjectToFormGroup(res.data, this.form);
      }) as Promise<ResponseBase<Role>>;
    });
  }

  ngOnInit() {
    this.portalService.clearFilters();
  }

  submit() {
    return this.execFunc(() => {
      const role = this.form.getRawValue() as Role;
      role.permissions = this.treeViewPermissions.unKnotTree() as Array<Permission>;
      role.menus = this.treeViewMenus.unKnotTree().map(x => Menu.roleSaveInit(x['menuId'], x.active));
      return this.roleService.save(role);
    }, ActionType.Save, this.form);
  }
}
