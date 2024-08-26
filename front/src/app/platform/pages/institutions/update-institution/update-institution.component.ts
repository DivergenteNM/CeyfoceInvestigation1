import { Component, OnInit } from '@angular/core';
import { PlatformService } from 'src/app/platform/services/platform.service';

@Component({
  selector: 'app-update-institution',
  templateUrl: './update-institution.component.html',
  styleUrls: ['./update-institution.component.css']
})
export class UpdateInstitutionComponent implements OnInit {

  listInstitutions: string[] = [];
  institutionSelect: string = '-- Seleccione una institución --';
  institution: any;
  activate: boolean = true;

  constructor(private platformServices: PlatformService) { }

  ngOnInit(): void {
    this.platformServices.getInstitutionsUpdate()
      .subscribe(res=>{
        this.listInstitutions=res.institutions;
      });
  }

  update() {
    if(this.institutionSelect!=='-- Seleccione una institución --'){      
      this.platformServices.getInstitution(this.institutionSelect)
        .subscribe(res=>{
          this.institution=res.institution[0];
          this.activate = false;
        })    
    }
  }
}
