import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  displayedColumns = ['name', 'code', 'active', 'actions'];
  constructor() { }

  ngOnInit() {
  }

}
