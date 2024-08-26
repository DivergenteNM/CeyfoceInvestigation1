import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from '../../services/student.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.css']
})
export class AnswerComponent implements OnInit {
  loading:boolean = true;
  scale:any;
  scalesCodes: any[];
  countScales: number = 0;
  routeParams;

  favoriteSeason: string;
  optionsType: string[] = [];
  letters: string[] = ["a","b","c","d","e","f","g","h"];
  answers: string[] = [];

  constructor(private activateRoute: ActivatedRoute,
              private studentService:StudentService) { }

  ngOnInit(): void {
    this.routeParams = this.activateRoute.snapshot.paramMap.get('idScale');
    this.studentService.getScaleStudentAnswer(this.routeParams)
      .subscribe(res=>{
        this.loading = false;
        this.scale = res[0];
        this.answers = res[0].questions.map(question=>"");
        this.optionsType = res[0].optionsType[0];
      })
      this.studentService.getScalesStudentAllowed()
      .subscribe(res=>{
        this.scalesCodes = res;
        this.countScales = this.scalesCodes.length;
        console.log(this.scalesCodes);
      })
  }

  sendResults(){
    var aux = true;
    for (let i = 0; i < this.answers.length; i++) {
      if(this.answers[i]==="") {
        aux = false;
        break;
      }
    }
    if(aux===true){
      const jsonSend = {
        "codeScale": this.scale.codeScale,
        "resultsScale": this.answers
      }
      this.studentService.sendResults(jsonSend)
        .subscribe(res=>{
          if (this.countScales-1===0) {
            Swal.fire({
              title: 'Genial!!!',
              text: 'Gracias por responder',
              icon: 'success',
              confirmButtonText: 'Aceptar',
            }).then((result) => {
              document.location.href = '/student/scales';
            })
          }else{
            const missingScale = this.scalesCodes.filter(item=>item.codeScale!==this.routeParams);
            document.location.href = `/student/answer/${missingScale[0].codeScale}`;
          }
        })
    }else{
      Swal.fire({
        title: 'Oops!',
        text: 'Por favor responde todas las preguntas',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      })
    }
  }
}
