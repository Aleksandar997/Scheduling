import { Component, OnInit, Injector, AfterViewInit } from '@angular/core';
import { Resource } from 'src/app/common/models/resource';
import { ActionFormBase } from 'src/app/common/base/actionFormBase';
import { LocalizationService } from 'src/app/common/services/localization.service';
import { FormGroupHelper } from 'src/app/common/helpers/formGroupHelper';
import { ResponseBase } from 'src/app/common/models/responseBase';
import { FormControl, FormArray } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { SelectListModel } from 'src/app/common/models/selectListModel';
import { ToasterService } from 'src/app/common/components/toaster/toaster.service';
import { Translate } from 'src/app/common/models/translate';
import { ActionType } from 'src/app/common/base/formBase';
import { Culture } from 'src/app/common/models/culture';

@Component({
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent extends ActionFormBase<Resource> implements OnInit, AfterViewInit {
  displayedColumns = ['culture', 'translate'];
  cultures = new Array<SelectListModel>();
  dataSource = new MatTableDataSource<any>();
  form = this.fb.group({
    resourceId: new FormControl(),
    name: new FormControl(null),
    translates: new FormArray([])
  });

  getTranslates = () => (this.form.get('translates') as FormArray);

  constructor(private inj: Injector, private localizationService: LocalizationService) {
    super(inj);
    this.navigateBackUrl = 'administration/translates';
    this.genericName = 'resource';
  }

  ngAfterViewInit(): void {
    this.execGetFunc(() => {
      return this.localizationService.cultureSelectlist().then(res => {
        this.cultures = res.data.map(x => new SelectListModel(x.cultureId, x.value));
        if (!this.getId() || this.getId() === 0) {
          this.initGrid();
          return;
        }
        this.getById((id: number) => {
          return this.localizationService.selectById(id).then(data => {
            FormGroupHelper.mapObjectToFormGroup(data.data, this.form);
            this.initGrid(data.data.translates);
          }) as Promise<ResponseBase<Resource>>;
        });
      }) as Promise<ResponseBase<Array<Culture>>>;
    })
  }

  ngOnInit() {
    this.portalService.clearFilters();
  }

  initGrid(data: Array<Translate> = null) {
    const translates = this.cultures.map(c => {
      const translateModel = data ? data.find(t => t.culture.cultureId === c.id) : null;
      return this.fb.group({
        translateId: translateModel ? translateModel.translateId : null,
        cultureVal: c.name,
        cultureId: c.id,
        value: translateModel ? translateModel.value : null
      });
    });
    const transConntrol = this.getTranslates();
    transConntrol.clear();
    translates.forEach(x => transConntrol.push(x));
    this.dataSource.data = translates;
  }

  submit() {
    return this.execFunc(() => {
      const resource = this.form.getRawValue() as Resource;
      return this.localizationService.save(resource);
    }, ActionType.Save, this.form);
  }
}
