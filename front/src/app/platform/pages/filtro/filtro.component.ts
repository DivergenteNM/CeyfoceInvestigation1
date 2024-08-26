import { Component, Input, OnInit } from '@angular/core';
import { PlatformService } from '../../services/platform.service';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.css']
})
export class FiltroComponent implements OnInit {

  activate:boolean = false;
  activateSpecific:boolean = false;
  optionSelected:number;
  options:any[] = [];

  buttons = [];

  buttonsFilter:any[] = [
    {
      'name': 'Instituciones',
      'options': ''
    },
    {
      'name': 'Grados',
      'options': ''
    },
    {
      'name': 'Edad',
      'options': ''
    },
    {
      'name': 'Sexo',
      'options': [{'name':'Masculino','checked':false},{'name':'Femenino','checked':false}]
    },
    {
      'name': 'Tipo de colegio',
      'options': [{'name':'Pública','checked':false},{'name':'Privada','checked':false}]
    },
    {
      'name': 'Sector',
      'options': [{'name':'Zona rural','checked':false},{'name':'Zona urbana','checked':false}]
    },
    {
      'name': 'Escalas',
      'options': ''
    },
    // {
    //   'name': 'Rangos',
    //   'options': [{'name':'Percentiles de 1 a 25','checked':false},
    //               {'name':'Percentiles de 26 a 74','checked':false},
    //               {'name':'Percentiles de 75 a 99','checked':false}]
    // }
  ];


  constructor(private platformService:PlatformService) {  }
  
  ngOnInit(): void {
    const admissibleness = localStorage.getItem("admissibleness");
    
    this.platformService.getFilterData()
    .subscribe(res=>{
      var institutions = res.institutions;
      var nameOfInstitutions = [];
      var courses = [];
       for (let i = 0; i < institutions.length; i++) {
         nameOfInstitutions.push(institutions[i].name);
         for (let j = 0; j < institutions[i].courses.length; j++) {
           courses.push(parseInt(institutions[i].courses[j].split("-")[0])); 
         }
       }
       const dataArr = new Set(courses);
       var result = [...dataArr];
       function comparar(a, b) {
        return a - b;
       }
       courses = result.sort(comparar);
       var arrayInstitutions = [];
       for (let i = 0; i < nameOfInstitutions.length; i++) {
         arrayInstitutions.push({
           'name': nameOfInstitutions[i],
           'checked': false
         });
       }
       this.buttonsFilter[0].options = arrayInstitutions;
       var arrayCourses = [];
       for (let i = 0; i < courses.length; i++) {
        arrayCourses.push({
          'name': courses[i],
          'checked': false
        })                  
       }
       this.buttonsFilter[1].options = arrayCourses;
       var arrayAges = [];
       for (let i = 0; i < res.ages.length; i++) {
         arrayAges.push({
           'name': res.ages[i],
           'checked': false
         })                  
        }
       this.buttonsFilter[2].options = arrayAges;

       var arrayScales = [];
       for (let i = 0; i < res.scales.length; i++) {
         arrayScales.push({
           'name': res.scales[i].title,
           'checked': false
         })                  
        }
       this.buttonsFilter[6].options = arrayScales;

       if(localStorage.getItem('filterElements')!==null){
         this.buttons = JSON.parse(localStorage.getItem('filterElements'));
       }
       if(admissibleness==="1201fpj4/tmq-1"){
        this.buttonsFilter.splice(0,1);
        this.buttonsFilter.splice(3,1);
       }
       for (let i = 0; i < this.buttons.length; i++) {
         this.buttonsFilter.splice(this.getIndex(this.buttons[i].name),1);
       }
     })
  }

  getIndex(name){
    for (let i = 0; i < this.buttonsFilter.length; i++) {
      if (name===this.buttonsFilter[i].name) {
        return i;
      }
    }
  }

  actionSelect() {
    this.activate = true;
  }

  clickButtons(index) {
    this.activate = false;
    this.activateSpecific = true;
    this.options = this.buttons[index].options;
  }

  delete(index) {
    this.buttonsFilter.push(this.buttons[index]);
    this.buttons.splice(index,1);
    localStorage.setItem('filterElements',JSON.stringify(this.buttons));
  }

  close(){
    this.activate = false;
    this.activateSpecific = false;
  }

  add() {
    if (this.buttonsFilter[this.optionSelected]!==undefined) {
      this.activate = false;
      this.activateSpecific = true;
      this.buttons.push(this.buttonsFilter[this.optionSelected]);
      this.options = this.buttons[this.buttons.length-1].options;
      this.buttonsFilter.splice(this.optionSelected,1);
    }
  }

  check() {
    this.activateSpecific = false;
    localStorage.setItem('filterElements',JSON.stringify(this.buttons));
  }
}
