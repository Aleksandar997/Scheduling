import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductType } from '../models/productType';
import { DocumentType } from '../models/documentType';
@Component({
  templateUrl: './codebooks.component.html'
})
export class CodebooksComponent implements OnInit {
  displayColumns = [];
  code: string;
  disableAdd = false;
  type;
  constructor(private activatedRoute: ActivatedRoute) {
    this.code = this.activatedRoute.snapshot.data.code.split('/').pop();
    switch (this.code) {
      case 'documentType':
        this.displayColumns = ['name', 'code', 'documentTypeCompany.year', 'documentTypeCompany.defaultNumber', 'actions'];
        this.type = (t) => {
          const res = t as DocumentType;
          res.documentTypeCompany.defaultNumber = +res.documentTypeCompany.defaultNumber;
          res.documentTypeCompany.year = +res.documentTypeCompany.year;
          return res;
        };
        this.disableAdd = true;
        break;
      case 'productType':
        this.displayColumns = ['name', 'active', 'actions'];
        this.type = (t) => t as ProductType;
        break;
      default:
        this.displayColumns = [];
        break;
    }
  }
  ngOnInit() {
  }

}


