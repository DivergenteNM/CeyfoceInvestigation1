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
