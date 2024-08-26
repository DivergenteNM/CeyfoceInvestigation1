import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-scales',
  templateUrl: './scales.component.html',
  styleUrls: ['./scales.component.css']
})
export class ScalesComponent implements OnInit {

  scales;
  loading:boolean = true;
  name = '';
  constructor(private studentService:StudentService,
              private router: Router) { }

  ngOnInit(): void {
    this.name = localStorage.getItem('name');
    this.studentService.getScalesStudentAllowed()
      .subscribe(res=>{
        this.scales = res;
        this.loading = false;
      })
      
  }

  answer() {
    this.router.navigate([`/student/answer/${this.scales[0].codeScale}`]);
  }

  getSize(){
    try {
      return this.scales.length;
    } catch (error) {
      return 0;
    }
  }
}
