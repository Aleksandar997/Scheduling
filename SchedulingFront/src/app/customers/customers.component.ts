import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  displayedColumns = ['firstName', 'lastName', 'phoneNumber', 'actions'];
  constructor() { }

  ngOnInit() {
  }

}
