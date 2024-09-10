import { Component, OnInit } from '@angular/core';
import { PlatformService } from '../../services/platform.service';
import { Router } from '@angular/router'; // Importa Router para la navegación

@Component({
  selector: 'app-scales-edit',
  templateUrl: './scales-edit.component.html',
  styleUrls: ['./scales-edit.component.css']
})
export class ScalesEditComponent implements OnInit {

  listScales: string[] = [];
  scaleSelect: string = '-- Seleccione una escala --';
  scale: any;
  activate: boolean = true;

  constructor(private platformServices: PlatformService, private router: Router) { }

  ngOnInit(): void {
    this.platformServices.getScalesEdit()
      .subscribe(res => {
        this.listScales = res.scales;
      });
  }

  edit() {
    if (this.scaleSelect !== '-- Seleccione una escala --') {
      this.platformServices.getScale(this.scaleSelect)
        .subscribe(res => {
          this.scale = res.scale;
          this.activate = false;
        });
    }
  }

  deleteScale(): void {
    if (this.scaleSelect !== '-- Seleccione una escala --') {
      this.platformServices.deleteScale(this.scaleSelect).subscribe(response => {
        // Navega a otra ruta o actualiza la lista de escalas después de la eliminación
        this.router.navigate(['/scales']);
      });
    }
  }
}



// import { Component, OnInit } from '@angular/core';
// import { PlatformService } from '../../services/platform.service';
// import { Router } from '@angular/router'; // Importa Router para la navegación

// @Component({
//   selector: 'app-scales-edit',
//   templateUrl: './scales-edit.component.html',
//   styleUrls: ['./scales-edit.component.css']
// })
// export class ScalesEditComponent implements OnInit {

//   listScales: any[] = []; // Cambiar a any[] para permitir objetos
//   scaleSelect: any = null; // Cambiar a any para que pueda ser un objeto completo
//   scale: any;
//   activate: boolean = true;

//   constructor(private platformServices: PlatformService, private router: Router) { }

//   ngOnInit(): void {
//     this.platformServices.getScalesEdit()
//       .subscribe(res => {
//         this.listScales = res.scales;
//       });
//   }

//   edit() {
//     if (this.scaleSelect) {
//       this.platformServices.getScale(this.scaleSelect.codeScale)
//         .subscribe(res => {
//           this.scale = res.scale;
//           this.activate = false;
//         });
//     }
//   }

//   deleteScale(): void {
//     if (this.scaleSelect) {
//       this.platformServices.deleteScale(this.scaleSelect.codeScale).subscribe(response => {
//         // Actualiza la lista de escalas después de la eliminación
//         this.listScales = this.listScales.filter(scale => scale.codeScale !== this.scaleSelect.codeScale);
//         this.scaleSelect = null; // Reiniciar la selección
//         this.activate = true;
//         this.router.navigate(['/scales']);
//       }, error => {
//         console.error('Error al eliminar la escala:', error);
//       });
//     } else {
//       console.error('No se ha seleccionado ninguna escala válida.');
//     }
//   }
// }
