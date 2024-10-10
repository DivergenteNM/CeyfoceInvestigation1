import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-repositorio-digital',
  templateUrl: './repositorio-digital.component.html',
  styleUrls: ['./repositorio-digital.component.css']
})
export class RepositorioDigitalComponent implements OnInit {
  articulos = [
    { id: 1, titulo: "Procesos de desarrollo del talento humano en una clínica de especialidades de Pasto, Colombia", anio: 2018, url: "https://revistas.udenar.edu.co/index.php/usalud/article/view/3555" },
    { id: 2, titulo: "Imaginario social, territorios de frontera y fronteras imaginarias: Comuna 10 de Pasto", anio: 2018, url: "http://editorial.umariana.edu.co/revistas/index.php/unimar/article/view/1601" },
    { id: 3, titulo: "Factores socioambientales de la violencia urbana y la convivencia escolar: panorama de tres instituciones educativas en Pasto (Colombia)", anio: 2020, url: "https://revistas.urosario.edu.co/index.php/territorios/article/view/7356" },
    { id: 4, titulo: "Conductas disruptivas en adolescentes en situación de deprivación sociocultural", anio: 2020, url: "https://revistas.unisimon.edu.co/index.php/psicogente/article/view/3509/5431" },
    { id: 5, titulo: "La violencia urbana como fenómeno multicausal: un estudio en tres comunas de la ciudad de San Juan de Pasto", anio: 2020, url: "http://revistas.unisimon.edu.co/index.php/psicogente/article/view/3269" },
    { id: 6, titulo: "Programa de estrategias de aprendizaje para estudiantes de una institución educativa", anio: 2020, url: "https://revistas.uptc.edu.co/index.php/praxis_saber/article/view/9272" },
    { id: 7, titulo: "Adaptation and validation of the Screening Questionnaire for Family Abuse of the Elderly in the sociocultural context of Colombia", anio: 2021, url: "https://onlinelibrary.wiley.com/doi/10.1111/hsc.13360" },
    { id: 8, titulo: "Bienestar psicológico y estrategias de afrontamiento frente a la COVID-19 en universitarios", anio: 2021, url: "https://revistas.udenar.edu.co/index.php/usalud/article/view/6206" },
    { id: 9, titulo: "Relación entre factores predisponentes a la deprivación sociocultural y el apoyo social en adolescentes", anio: 2021, url: "https://revistavirtual.ucn.edu.co/index.php/RevistaUCN/article/view/1259" },
    { id: 10, titulo: "Eventos vitales estresantes, estrategias de afrontamiento y resiliencia en adolescentes en contexto de pandemia", anio: 2021, url: "http://revistas.unisimon.edu.co/index.php/psicogente/article/view/4789" }
  ];

  constructor() { }
 
  ngOnInit(): void {
  }
}