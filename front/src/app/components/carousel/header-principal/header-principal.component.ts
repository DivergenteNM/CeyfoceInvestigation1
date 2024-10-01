import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-principal',
  templateUrl: './header-principal.component.html',
  styleUrls: ['./header-principal.component.css']
})
export class HeaderPrincipalComponent implements OnInit {
  showInfo: boolean[] = [false, false, false]; // Array para controlar la visibilidad de la información
  toggleInfo(index: number): void {
    this.showInfo[index] = !this.showInfo[index]; // Alterna la visibilidad de la información
  }

  constructor() { }

  /// Propiedades para los elementos del DOM
  text: HTMLElement;
  leaf: HTMLElement;
  hill1: HTMLElement;
  hill4: HTMLElement;
  hill5: HTMLElement;

  // Valor máximo para el desplazamiento
  maxScrollValue = 400;

  ngOnInit(): void {
    // Seleccionar los elementos del DOM
    this.text = document.getElementById('text');
    this.leaf = document.getElementById('leaf');
    this.hill1 = document.getElementById('hill1');
    this.hill4 = document.getElementById('hill4');
    this.hill5 = document.getElementById('hill5');
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    let value = window.scrollY;

    if (window.innerWidth <= 768) {
      // No aplicar el efecto parallax en dispositivos móviles
      return;
    }

    if (value > this.maxScrollValue) {
      value = this.maxScrollValue;
    }

    this.text.style.marginTop = value * 2.5 + 'px';
    this.leaf.style.top = value * -1.5 + 'px';
    this.leaf.style.left = value * 1.5 + 'px';
    this.hill5.style.left = value * 1.5 + 'px';
    this.hill4.style.left = value * -1.5 + 'px';
    this.hill1.style.top = value * 1 + 'px';
  }

}
