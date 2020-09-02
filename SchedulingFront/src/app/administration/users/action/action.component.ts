import { Component, OnInit, Injector, AfterViewInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { SelectListModel } from 'src/app/common/models/selectListModel';
import { SystemService } from 'src/app/services/system.service';
import { ToasterService } from 'src/app/common/components/toaster/toaster.service';
import { FormGroupHelper } from 'src/app/common/helpers/formGroupHelper';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/common/models/user';
import { isArrayEmpty } from 'src/app/common/validators/compareValidator';
import { ActionFormBase } from 'src/app/common/base/actionFormBase';
import { ResponseBase } from 'src/app/common/models/responseBase';
import { OrganizationUnit } from 'src/app/models/organizationUnit';
import { Role } from 'src/app/common/models/role';
import { Product } from 'src/app/models/product';

@Component({
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent extends ActionFormBase<User> implements OnInit, AfterViewInit {
  form: FormGroup;
  organizationUnits = new Array<SelectListModel>();
  products = new Array<SelectListModel>();
  roles = new Array<SelectListModel>();
  disableAnimations = false;
  constructor(private inj: Injector, private activatedRoute: ActivatedRoute, private userServce: UserService,
              private systemService: SystemService, private renderer: Renderer2) {
    super(inj);
    this.genericName = 'user';
    this.navigateBackUrl = '/administration/users';
    this.form = this.fb.group({
      userId: new FormControl(),
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      active: new FormControl(null, [Validators.required]),
      roles: new FormArray([], [isArrayEmpty]),
      roleIds: new FormControl(null),
      employee: this.fb.group({
        organizationUnits: new FormControl({ value: null, disabled: true }, [Validators.required]),
        employeeId: new FormControl(),
        products: new FormControl({ value: null, disabled: true }, [Validators.required]),
        identificationNumber: new FormControl({ value: null, disabled: true }, [Validators.required]),
        isEmployee: new FormControl(false)
      }, {disabled: this.areControlsDisabled()}),
      userName: new FormControl(null, [Validators.required])
    });
    if (this.areControlsDisabled()) {
      this.form.disable({ onlySelf: true });
      return;
    }
    this.form.getControls('employee.organizationUnits').valueChanges.subscribe(res => {
      if (!res) {
        return;
      }
      this.getProductLists(res);
    });
    this.form.getControls('roleIds').valueChanges.subscribe(async (res: Array<number>) => {
      if (!res) {
        return;
      }
      const roles = this.form.getControls('roles') as FormArray;
      roles.clear();
      await res.forEach(async x => {
        await roles.push(
          this.fb.group({
            roleId: new FormControl({ value: x, disabled: this.areControlsDisabled() }, [Validators.required])
          })
        );
      });
      if (res.includes(this.roles.find(x => x.code === '2').id)) {
        this.form.getControls('employee').enable({ onlySelf: true });
        this.form.getControls('employee.isEmployee').setValue(true);
        return;
      }
      this.form.getControls('employee.isEmployee').setValue(false);
      this.form.getControls('employee').disable({ onlySelf: false });
    });
  }

  ngOnInit() {
    this.portalService.clearFilters();
  }

  ngAfterViewInit() {
    this.getLists();
    if (this.getId() > 0) {
      this.disableAnimations = true;
      this.getUser();
    }
    // this.renderer.setStyle(document.getElementById('t'), 'pointer-events', 'none')
  }

  getLists() {
    this.execGetFunc(() => {
      return this.systemService.getOrganizationUnits().then(res => {
        this.organizationUnits = res.data.map(x => new SelectListModel(x.organizationUnitId, x.name));
      }) as Promise<ResponseBase<Array<OrganizationUnit>>>
    });
    this.execGetFunc(() => {
      return this.systemService.getRoles().then(res => {
        this.roles = res.data.map(x => new SelectListModel(x.roleId, x.name, x.code));
      }) as Promise<ResponseBase<Array<Role>>>;
    });
  }

  getUser() {
    this.getById(userId => {
      return this.userServce.getById(userId).then(res => {
        res.data.roleIds = res.data.roles.map(x => x.roleId);
        FormGroupHelper.mapObjectToFormGroup(res.data, this.form);
        // setTimeout(() => this.disableAnimations = false, 1);
      }) as Promise<ResponseBase<User>>;
    });
  }

  getProductLists(organizationUnitId: Array<number>) {
    this.execGetFunc(() => {
      return  this.systemService.getProducts(organizationUnitId).then(res => {
        this.products = res.data.products
                          .map(x => new SelectListModel(x.productId, x.name, x.organizationUnitsString))
                          .filter(this.onlyUnique);
        if (this.disableAnimations) {
          this.disableAnimations = false;
          return;
        }
        const productElement = document.getElementById('productSelect');
        this.renderer.removeClass(productElement, 'productFromOrganizationUnit');
        setTimeout(() => {
          ToasterService.openSuccess('products_taken_from_organization_unit');
          this.renderer.addClass(productElement, 'productFromOrganizationUnit');
        }, 1);
      }) as Promise<ResponseBase<Array<Product>>>;
    });
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  submit() {
    this.execFunc(() => {
      const user = (this.form.getRawValue() as User);
      user.isUserSave = true;
      user.roles = user.roles.length > 0 ? user.roles : null;
      return this.userServce.save(user);
    });
  }
}
