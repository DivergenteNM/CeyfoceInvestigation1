import { Component, OnInit } from '@angular/core';

interface Escala {
  titulo: string;
  explicacion: string;
}

@Component({
  selector: 'app-instrumentos-medicion',
  templateUrl: './instrumentos-medicion.component.html',
  styleUrls: ['./instrumentos-medicion.component.css']
})
export class InstrumentosMedicionComponent implements OnInit {
  escalas: Escala[] = [
    {
      titulo: "Escala de Exposición a Factores de Deprivación Sociocultural",
      explicacion: "La Escala de Exposición a Factores de Deprivación Sociocultural- EXFADESO evalúa el grado de exposición de un individuo a los factores de deprivación sociocultural. Esta constituida por 25 ítems que se encuentran distribuidos en seis factores, correspondientes a dinámica familiar, clima familiar, exposición a la violencia comunitaria, apoyo social comunitario, mediación del aprendizaje y clima escolar. La escala es de tipo Likert y las opciones de respuesta son totalmente en desacuerdo, desacuerdo, de acuerdo y totalmente de acuerdo. Su tiempo de duración es de aproximadamente 20 minutos."
    },
    {
      titulo: "Escala De Estrés Percibido",
      explicacion: "La escala de estrés percibido- EEP adaptada y validada en Colombia evalúa el grado de estrés que perciben los sujetos en contexto de pandemia. Esta constituida por 14 ítems que se encuentran distribuidos en dos factores, correspondientes a percepción del estrés y afrontamiento de los estresores. La escala es de tipo Likert y las opciones de respuesta son nunca, casi nunca, de vez en cuando, casi siempre y siempre. Su tiempo de duración es de aproximadamente 10 minutos."
    },
    {
      titulo: "Escala De Estrés Percibido",
      explicacion: "La escala de estrés percibido- EEP adaptada y validada en Colombia evalúa el grado de estrés que perciben los sujetos en contexto de pandemia. Esta constituida por 14 ítems que se encuentran distribuidos en dos factores, correspondientes a percepción del estrés y afrontamiento de los estresores. La escala es de tipo Likert y las opciones de respuesta son nunca, casi nunca, de vez en cuando, casi siempre y siempre. Su tiempo de duración es de aproximadamente 10 minutos."
    }
  ];

  constructor() { }

  ngOnInit(): void { }
}