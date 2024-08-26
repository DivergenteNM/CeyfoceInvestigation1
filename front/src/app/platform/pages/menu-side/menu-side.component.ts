import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-menu-side',
  templateUrl: './menu-side.component.html',
  styleUrls: ['./menu-side.component.css']
})
export class MenuSideComponent implements OnInit {

  activateResponsive: boolean = false;

  itemsScales = [
    {
      'link': '/scales/create',
      'title': 'Crear',
      'icon': 'add_circle'
    },
    {
      'link': '/scales/edit',
      'title': 'Editar',
      'icon': 'edit'
    },
    {
      'link': '/scales/results',
      'title': 'Resultados',
      'icon': 'search'
    },
    {
      'link': '/scales/resultsIndividual',
      'title': 'Individual',
      'icon': 'find_in_page'
    }
  ];
  itemsInstitutions = [
    {
      'link': '/institutions/create',
      'title': 'Añadir',
      'icon': 'add_circle'
    },
    {
      'link': '/institutions/update',
      'title': 'Actualizar',
      'icon': 'update'
    }
  ];
  itemsUsers = [
    {
      'link': '/users/authorization',
      'title': 'Autorizar',
      'icon': 'playlist_add_check'
    },
    {
      'link': '/users/changeRole',
      'title': 'Cambiar rol',
      'icon': 'swap_horizontal_circle'
    }
  ];
  itemsProfile = [
    {
      'link': '/profile',
      'title': 'Perfil',
      'icon': 'perm_identity'
    }
  ];
  itemsApproved = [];

  constructor(private router: Router) {

    this.router.events.subscribe((val: NavigationEnd) => {
      const asdf = val.url + "";
      this.change(asdf[10]);
    })
  }

  ngOnInit(): void {
    if (this.router.url.split('/')[2] === "scales") {
      this.change("s");
    } else if (this.router.url.split('/')[2] === "institutions") {
      this.change("i");
    } else if (this.router.url.split('/')[2] === "users") {
      this.change("u");
    } else if (this.router.url.split('/')[2] === "profile") {
      this.change("p");
    }
  }

  change(path) {
    const admissibleness = localStorage.getItem('admissibleness');
    this.activateResponsive = false;
    if (admissibleness === "6465asd7#asd-1") {
      if (path === 's') {
        this.itemsApproved = this.itemsScales;
      } else if (path === 'i') {
        this.itemsApproved = this.itemsInstitutions;
      } else if (path === 'u') {
        this.itemsApproved = this.itemsUsers;
      } else if (path === 'p') {
        this.itemsApproved = this.itemsProfile;
      }
    } else if (admissibleness === "1201fpj4/tmq-1") {
      if (path === 's') {
        const array = [this.itemsScales[2]];
        this.itemsApproved = array;
      } else if (path === 'u') {
        this.itemsApproved = this.itemsUsers;
      } else if (path === 'p') {
        this.itemsApproved = this.itemsProfile;
      }
    } else if (admissibleness === "8435dpe1+nrs-3") {
      if (path === 's') {
        const array = [this.itemsScales[2], this.itemsScales[3]];
        this.itemsApproved = array;
      } else if (path === 'p') {
        this.itemsApproved = this.itemsProfile;
      }
    }
  }

  activateMenuResponsive() {
    if (this.activateResponsive === true) {
      this.activateResponsive = false;
    } else {
      this.activateResponsive = true;
    }
  }
}
