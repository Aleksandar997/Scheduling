import { Component, OnInit, Injector, AfterViewInit, ViewChild } from '@angular/core';
import { SelectListModel } from '../common/models/selectListModel';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { FormBase, ActionType } from '../common/base/formBase';
import { Company } from '../common/models/company';
import { ActionFormBase } from '../common/base/actionFormBase';
import { CompanyService } from '../common/services/company.service';
import { ResponseBase } from '../common/models/responseBase';
import { LocalData } from '../common/data/localData';
import { FormGroupHelper } from '../common/helpers/formGroupHelper';
import { FileUploadComponent } from '../common/components/fileUpload/fileUpload.component';
import { ThemeService } from '../common/theme/theme.service';
import { Theme } from '../common/theme/themeModel';

@Component({
  templateUrl: './companySettings.component.html',
  styleUrls: ['./companySettings.component.css']
})
export class CompanySettingsComponent extends ActionFormBase<Company> implements OnInit, AfterViewInit {
  @ViewChild(FileUploadComponent) fileUpload: FileUploadComponent;  form: FormGroup = this.fb.group({
    name: new FormControl(null),
    logo: new FormControl()
  });
  themes: Array<Theme>;
  constructor(private inject: Injector, private companyService: CompanyService, private themeService: ThemeService) {
    super(inject);
    this.genericName = 'company';
   }

  ngOnInit() {
    this.portalService.clearFilters();
  }

  ngAfterViewInit() {
    const company = LocalData.getCompany() as Company;
    // this.execGetFunc(() => {
    //   return this.themeService.selectAll().then(res => {
    //     this.themes = res.data;
    //   }) as Promise<ResponseBase<Array<Theme>>>;
    // });
    if (company) {
      FormGroupHelper.mapObjectToFormGroup(company, this.form);
      this.fileUpload.setImagePreview(company.logo);
      return;
    }
    this.getById((id: number) => {
      return this.companyService.getCompany().then(res => {
        this.fileUpload.setImagePreview(res.data.logo);
        FormGroupHelper.mapObjectToFormGroup(res.data, this.form);
      }) as Promise<ResponseBase<Company>>;
    });
  }

  submit() {
    const company = this.form.getRawValue() as Company;
    company.logo = this.fileUpload.imagePreview;
    this.execFunc(() => {
      return this.fileUpload.uploadFileClean((fileId: number) => {
        company.fileId = fileId;
        return this.companyService.save(company).then(res => {
          LocalData.setCompany(res.data);
          this.fileUpload.setImagePreview(res.data.logo);
        });
      }) as Promise<any>;
    }, ActionType.Save, this.form);
  }

}
