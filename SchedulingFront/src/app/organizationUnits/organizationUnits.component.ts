import { Component, OnInit,  AfterViewInit} from '@angular/core';

@Component({
  templateUrl: './organizationUnits.component.html'
})
export class OrganizationUnitsComponent implements OnInit, AfterViewInit {
  displayedColumns = ['name', 'code', 'active', 'actions'];
  constructor() { }

  ngOnInit() {
  }
  ngAfterViewInit() {
  }
}
