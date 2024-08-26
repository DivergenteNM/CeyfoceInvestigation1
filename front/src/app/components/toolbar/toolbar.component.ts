import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  affairFormControl = new FormControl('', [Validators.required]);
  messageFormControl = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();
  name:string = "Login";
  loading: boolean = false;

  investigadores = [
    {
      color: `border-color: rgba(${Math.floor((Math.random() * (255 - 1 + 1)) + 1)},
                                  ${Math.floor((Math.random() * (255 - 1 + 1)) + 1)},
                                  ${Math.floor((Math.random() * (150 - 1 + 1)) + 1)},.5);`,
      image: 'assets/images/lina.png',
      name: 'Lina Maria Obando Guerrero',
      title: 'Psicóloga, Universidad de Nariño',
      profile: 'Magister en Psicodiagnóstico y Evaluación Psicológica, Universidad de Buenos Aires. Especialista en Psicología Forense y Criminal en curso, Universidad Konrad Lorenz. Miembro del Grupo de Investigación “Libres Pensadores” Categoria B de Colciencias.',
      moreInfo: false
    },
    {
      color: `border-color: rgba(${Math.floor((Math.random() * (255 - 1 + 1)) + 1)},
                                  ${Math.floor((Math.random() * (255 - 1 + 1)) + 1)},
                                  ${Math.floor((Math.random() * (150 - 1 + 1)) + 1)},.5);`,
      image: 'assets/images/librespensadorescirculo.png',
      name: 'Grupo de investigación - Libres Pensadores',
      title: '',
      profile: '',
      moreInfo: false
    },
    {
      color: `border-color: rgba(${Math.floor((Math.random() * (255 - 1 + 1)) + 1)},
                                  ${Math.floor((Math.random() * (255 - 1 + 1)) + 1)},
                                  ${Math.floor((Math.random() * (150 - 1 + 1)) + 1)},.5);`,
      image: 'assets/images/jhonatan.jpeg',
      name: 'Jonnathan Harvey Narváez',
      title: 'Psicólogo, Universidad de Nariño',
      profile: 'Licenciado en Filosofía, Pensamiento Político y Económico Universidad Santo Tomás. Especialista en Estudios Latinoamericanos,. Magister en Investigación Integrativa, Doctor en Ciencias de la Educación. Director Grupo de Investigación Libres Pensadores Departamento de Psicología Universidad de Nariño. Investigador Asociado Colciencias.',
      moreInfo: false
    },
  ]

  itemsMenu = [
    {
      title: 'Medición y evaluación',
      link: '',
      subMenu: [
        {
          title: 'Adaptación y validación de instrumentos',
          link: ''
        },
        {
          title: 'Elaboración de diagnósticos',
          link: ''
        },
        {
          title: 'Caracterización de contextos educativos',
          link: ''
        }
      ]
    },
    {
      title: 'Intervención psicoeducativa',
      link: '',
      subMenu: [
        {
          title: 'Convivencia y paz',
          link: ''
        },
        {
          title: 'Cognición y desarrollo multidimensional',
          link: ''
        },
        {
          title: 'Violencia, Escuela y contexto',
          link: ''
        }
      ]
    },
    {
      title: 'Investigación',
      link: '',
      subMenu: [
        {
          title: 'Asesorías en investigación',
          link: ''
        },
        {
          title: 'Asesorías en investigación',
          link: ''
        },
        {
          title: 'Diseño y ejecución de proyectos de investigación',
          link: ''
        },
        {
          title: 'Artículos',
          link: ''
        }
      ]
    },
    {
      title: 'Escalas',
      link: '',
      subMenu: [
        {
          title: 'Información',
          link: ''
        }
      ]
    },
    {
      title: 'Registro',
      link: '/account/register',
      subMenu: []
    }
  ]

  carrusel = [
    {
      image: 'assets/images/5car.jpg',
      title: '',
      content: ''
    },
    {
      image: 'assets/images/1car.jpg',
      title: '¿Qué son las escalas?',
      content: 'Las escalas corresponden a  un conjunto de ítems que buscan describir determinadas características de variables que no son observables directamente (Lamprea y Gómez, 2007). Estas están divididas en factores los cuales reflejan le realidad que se va a medir (Sánchez y Echeverry, 2004).'
    },
    {
      image: 'assets/images/2car.jpg',
      title: 'Escala de Exposición a Factores de Deprivación Sociocultural',
      content: 'La Escala de Exposición a Factores de Deprivación Sociocultural- EXFADESO evalúa el grado de exposición de un individuo a los factores de deprivación sociocultural. Esta constituida por 25 ítems que se encuentran distribuidos en seis factores, correspondientes a dinámica familiar, clima familiar, exposición a la violencia comunitaria, apoyo social comunitario, mediación del aprendizaje y clima escolar. La escala es de tipo Likert y las opciones de respuesta son totalmente en desacuerdo, desacuerdo, de acuerdo y totalmente de acuerdo. Su tiempo de duración es de aproximadamente 20 minutos.'
    },
    {
      image: 'assets/images/3car.jpg',
      title: 'Escala De Estrés Percibido',
      content: 'La escala de estrés percibido- EEP adaptada y validada en Colombia evalúa el grado de estrés que perciben los sujetos en contexto de pandemia. Esta constituida por 14 ítems que se encuentran distribuidos en dos factores, correspondientes a percepción del estrés y afrontamiento de los estresores. La escala es de tipo Likert y las opciones de respuesta son nunca, casi nunca, de vez en cuando, casi siempre y siempre. Su tiempo de duración es de aproximadamente 10 minutos.'
    },
    {
      image: 'assets/images/4car.jpg',
      title: 'Escala De Estrés Percibido',
      content: 'La escala de estrés percibido- EEP adaptada y validada en Colombia evalúa el grado de estrés que perciben los sujetos en contexto de pandemia. Esta constituida por 14 ítems que se encuentran distribuidos en dos factores, correspondientes a percepción del estrés y afrontamiento de los estresores. La escala es de tipo Likert y las opciones de respuesta son nunca, casi nunca, de vez en cuando, casi siempre y siempre. Su tiempo de duración es de aproximadamente 10 minutos.'
    },
  ]

  informationForDialog = [
    {
      title: 'Adaptación y validación de instrumentos',
      text: `En este apartado se busca asesorar los procesos de 
        adaptación y validación de instrumentos  con el fin de que 
        estos cuenten con propiedades psicométricas adecuadas y con 
        ello obtener resultados validos y confiables. En este sentido,  
        se resalta la necesidad de realizar la adaptación cultural para 
        que  los instrumentos contemplen  los mismos supuestos y sean 
        acordes a la cultura de los países en los que se van a aplicar 
        y se realice la validación para  garantizar la calidad de la medición.`,
      links: []
    },
    {
      title: 'Elaboración de diagnósticos',
      text: `El diagnóstico es un proceso de construcción del conocimiento 
        acerca de algo sobre lo que se va a intervenir o a actuar. En psicología 
        se refiere a síntomas o funcionamientos mentales-emocionales que no 
        tienen una base orgánica observable y se infieren por los comportamientos 
        o reportes que trasmite el cliente. De igual manera, se pueden realizar 
        diagnósticos comunitarios.  Es por ello que en esta área contamos con 
        un equipo de profesionales de psicología idóneos quienes a través de 
        los fundamentos de medición y evaluación podrán realizar diagnósticos 
        validos y confiables que orienten a una intervención eficaz en base a 
        las fortalezas y recursos de los sujetos.`,
      links: []
    },
    {
      title: 'Caracterización de contextos educativos',
      text: `A través de la aplicación de las escalas que se encuentran en nuestra 
        plataforma y de entrevistas semiestructuradas se recopilará la información 
        necesaria para brindar a docentes y entes administrativos la  caracterización 
        de sus contextos educativos. En este sentido se busca otorgar un informe 
        que contemple diferentes análisis de las variables escogidas en función  
        a las características de los estudiantes como su genero, edad, estrato 
        socioeconómico y  a otros elementos institucionales como el grado que cursan.`,
      links: []
    },
    {
      title: 'Convivencia y paz',
      text: `Desarrollo de estrategias psicoeducativas y experienciales (cátedra de 
        la paz, diplomado en liderazgo para la paz, taller experiencial A®memos la paz, 
        para la promoción de una cultura de paz y el establecimiento de la convivencia 
        pacífica en las escuelas y contextos comunitarios.`,
      links: []
    },
    {
      title: 'Cognición y desarrollo multidimensional',
      text: `Evaluación y fortalecimiento de los procesos, competencias y habilidades 
      cognitivas mediante la ejecución de programas y estrategias que favorecen el 
      desarrollo humano multidimensional.`,
      links: []
    },
    {
      title: 'Violencia, Escuela y contexto',
      text: `Asesoramiento en programas de investigación intervención orientados a 
      mitigar el impacto de los factores socioestructurales como la pobreza, la 
      violencia, el microtráfico y la desigualdad sobre las dinámicas educativas.`,
      links: []
    },
    {
      title: 'Asesorías en investigación',
      text: `Asesorías técnicas o académicas de trabajos, tesis de grado o 
        procesos de investigación en metodologías cuantitativas, mixtas y cualitativas.`,
      links: []
    },
    {
      title: 'Formación en investigación',
      text: `Desarrollo de cursos de formación o talleres de capacitación en 
        investigación, técnicas, instrumentos, tipos de estudio, enfoques de investigación, 
        consideraciones éticas,  análisis de datos y producción científica.`,
      links: []
    },
    {
      title: 'Diseño y ejecución de proyectos de investigación',
      text: `Generación de alianzas de cooperación para la formulación y ejecución de 
        proyectos de investigación intervención que impacten la convivencia, construcción 
        de paz, desarrollo cognitivo y dinámicas socioestructurales.`,
      links: []
    },
    {
      title: 'Información',
      text: `El registro y el inicio de sesión son necesarios para realizar la 
        aplicación de los instrumentos y mirar los resultados.`,
      links: [
        {
          articulo: 'Inicia sesión',
          anio: '',
          link: 'https://ceyfoce.tk/account/login'
        },
        {
          articulo: 'Regístrate',
          anio: '',
          link: 'https://ceyfoce.tk/account/register'
        }
      ]
    },
    {
      title: 'Artículos',
      text: ``,
      links: [
        {
          articulo: 'Procesos de desarrollo del talento humano en una clínica de especialidades de Pasto, Colombia',
          anio: '(2018)',
          link: 'https://revistas.udenar.edu.co/index.php/usalud/article/view/3555'
        },
        {
          articulo: 'Imaginario social, territorios de frontera y fronteras imaginarias: Comuna 10 de Pasto',
          anio: '(2018)',
          link: 'http://editorial.umariana.edu.co/revistas/index.php/unimar/article/view/1601'
        },
        {
          articulo: 'Factores socioambientales de la violencia urbana y la convivencia escolar: panorama de tres instituciones educativas en Pasto (Colombia)',
          anio: '(2020)',
          link: 'https://revistas.urosario.edu.co/index.php/territorios/article/view/7356'
        },
        {
          articulo: 'Conductas disruptivas en adolescentes en situación de deprivación sociocultural',
          anio: '(2020)',
          link: 'https://revistas.unisimon.edu.co/index.php/psicogente/article/view/3509/5431'
        },
        {
          articulo: 'La violencia urbana como fenómeno multicausal: un estudio en tres comunas de la ciudad de San Juan de Pasto',
          anio: '(2020)',
          link: 'http://revistas.unisimon.edu.co/index.php/psicogente/article/view/3269'
        },
        {
          articulo: 'Programa de estrategias de aprendizaje para estudiantes de una institución educativa',
          anio: '(2020)',
          link: 'https://revistas.uptc.edu.co/index.php/praxis_saber/article/view/9272'
        },
        {
          articulo: 'Adaptation and validation of the Screening Questionnaire for Family Abuse of the Elderly in the sociocultural context of Colombia',
          anio: '(2021)',
          link: 'https://onlinelibrary.wiley.com/doi/10.1111/hsc.13360'
        },
        {
          articulo: 'Bienestar psicológico y estrategias de afrontamiento frente a la COVID-19 en universitarios',
          anio: '(2021)',
          link: 'https://revistas.udenar.edu.co/index.php/usalud/article/view/6206'
        },
        {
          articulo: 'Relación entre factores predisponentes a la deprivación sociocultural y el apoyo social en adolescentes',
          anio: '(2021)',
          link: 'https://revistavirtual.ucn.edu.co/index.php/RevistaUCN/article/view/1259'
        },
        {
          articulo: 'Eventos vitales estresantes, estrategias de afrontamiento y resiliencia en adolescentes en contexto de pandemia',
          anio: '(2021)',
          link: 'http://revistas.unisimon.edu.co/index.php/psicogente/article/view/4789'
        }
      ]
    }
  ]

  constructor(
    config: NgbCarouselConfig, 
    private http: HttpClient,
    public dialog: MatDialog) {
    config.interval = 5000;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = false;
  }

  ngOnInit(): void {
    try {
      var nameVar = localStorage.getItem("name").split(" ")[0];
    } catch (error) {
      
    }
    if(nameVar){
      this.name = "¡Hola "+nameVar+"!";
    }
  }

  public redirect() {
    document.location.href = './account/login';
  }

  public sendMessage() {
    if(this.emailFormControl.valid && this.affairFormControl.valid && this.messageFormControl.valid) {
      this.loading = true;
      const json = {
        email: this.emailFormControl.value,
        affair: this.affairFormControl.value,
        message: this.messageFormControl.value
      }
      this.http.post<any>(`${environment.baseURL}/platform/internalMessage`,json)
      .subscribe(res=>{
        Swal.fire(
          'Genial',
          'Mensaje enviado !!!',
          'success'
        )
        this.emailFormControl.reset('');
        this.affairFormControl.reset('');
        this.messageFormControl.reset('');
        this.loading = false;
      })
    }else{
      Swal.fire(
        'Error',
        'Verifique su información e intente nuevamente',
        'error'
      )
    }
  }

  openDialog(title: string): void {
    const info = this.informationForDialog.find(item=>item.title===title);
    const dialogRef = this.dialog.open(DialogContent, {
      width: '80vw',
      data: {title: info.title,text: info.text, links: info.links},
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}

@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: './dialogOne.html',
})
export class DialogContent {
  constructor(
    public dialogRef: MatDialogRef<DialogContent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}