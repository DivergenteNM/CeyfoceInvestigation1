import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  visibleFloatingMenu:boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  dropdownMenu() {
    this.visibleFloatingMenu = !this.visibleFloatingMenu;
  }

  signOff() {
    localStorage.removeItem("name");
    localStorage.removeItem("admissibleness");
    localStorage.removeItem("auth");
    localStorage.removeItem("scaleTemp");
    window.location.reload();
  }

}
