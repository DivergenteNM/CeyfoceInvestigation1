import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  tabs = [
    {
      'link': '/scales',
      'title': 'Escalas',
      'icon': 'assessment'
    },
    {
      'link': '/institutions',
      'title': 'Instituciones',
      'icon': 'store'
    },
    {
      'link': '/users',
      'title': 'Usuarios',
      'icon': 'supervised_user_circle'
    }
  ]
  generatetabs = [];

  visibleFloatingMenu:boolean = false;

  constructor() { }

  ngOnInit(): void {
    const admissibleness = localStorage.getItem("admissibleness");
    if (admissibleness==='6465asd7#asd-1') {
      this.generatetabs = this.tabs;
    }else if(admissibleness==="1201fpj4/tmq-1"){
      const array = [this.tabs[0],this.tabs[2]];
      this.generatetabs = array;
    }else if(admissibleness==="8435dpe1+nrs-3"){
      const array = [this.tabs[0]];
      this.generatetabs = array;
    }
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
