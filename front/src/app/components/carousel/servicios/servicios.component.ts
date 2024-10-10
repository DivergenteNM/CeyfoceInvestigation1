import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent implements OnInit {
  asesorias = [
    { titulo: "Asesorías en investigación: ", descripcion: "Asesorías técnicas o académicas de trabajos, tesis de grado o procesos de investigación en metodologías cuantitativas, mixtas y cualitativas.", imagen: "https://source.unsplash.com/random/614x614?finance" },
    { titulo: "Diseño y ejecución de proyectos de investigación: ", descripcion: "Generación de alianzas de cooperación para la formulación y ejecución de proyectos de investigación intervención que impacten la convivencia, construcción de paz, desarrollo cognitivo y dinámicas socioestructurales.", imagen: "https://source.unsplash.com/random/614x614?law" },
    { titulo: "Adaptación y validación de instrumentos: ", descripcion: "En este apartado se busca asesorar los procesos de adaptación y validación de instrumentos con el fin de que estos cuenten con propiedades psicométricas adecuadas y con ello obtener resultados validos y confiables. En este sentido, se resalta la necesidad de realizar la adaptación cultural para que los instrumentos contemplen los mismos supuestos y sean acordes a la cultura de los países en los que se van a aplicar y se realice la validación para garantizar la calidad de la medición.", imagen: "https://source.unsplash.com/random/614x614?marketing" },
    { titulo: "Elaboración de diagnósticos: ", descripcion: "El diagnóstico es un proceso de construcción del conocimiento acerca de algo sobre lo que se va a intervenir o a actuar. En psicología se refiere a síntomas o funcionamientos mentales-emocionales que no tienen una base orgánica observable y se infieren por los comportamientos o reportes que trasmite el cliente. De igual manera, se pueden realizar diagnósticos comunitarios. Es por ello que en esta área contamos con un equipo de profesionales de psicología idóneos quienes a través de los fundamentos de medición y evaluación podrán realizar diagnósticos validos y confiables que orienten a una intervención eficaz en base a las fortalezas y recursos de los sujetos.", imagen: "https://source.unsplash.com/random/614x614?humanresources" },
    { titulo: "Caracterización de contextos educativos: ", descripcion: "A través de la aplicación de las escalas que se encuentran en nuestra plataforma y de entrevistas semiestructuradas se recopilará la información necesaria para brindar a docentes y entes administrativos la caracterización de sus contextos educativos. En este sentido se busca otorgar un informe que contemple diferentes análisis de las variables escogidas en función a las características de los estudiantes como su genero, edad, estrato socioeconómico y a otros elementos institucionales como el grado que cursan.", imagen: "https://source.unsplash.com/random/614x614?technology" }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  toggleLike(asesoria: any): void {
    asesoria.isLiked = !asesoria.isLiked;
    asesoria.likes = asesoria.isLiked ? (asesoria.likes || 0) + 1 : (asesoria.likes || 1) - 1;
  }

  doubleClickLike(asesoria: any): void {
    if (!asesoria.isLiked) {
      asesoria.isLiked = true;
      asesoria.likes = (asesoria.likes || 0) + 1;
    }
  }

  animateShareButton(event: any): void {
    const shareButton = event.target;
    shareButton.style.transform = 'rotate(360deg)';
    setTimeout(() => {
      shareButton.style.transform = 'rotate(0deg)';
    }, 300);
  }
}