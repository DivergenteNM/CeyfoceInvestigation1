import { Component, OnInit, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit, AfterViewInit {

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const projects = this.el.nativeElement.querySelectorAll('.project');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.renderer.addClass(entry.target, 'visible');
        }
      });
    }, {
      threshold: 0.1
    });

    projects.forEach(project => {
      observer.observe(project);
    });

    // Efecto parallax suave
    // window.addEventListener('scroll', () => {
    //   const scrolled = window.scrollY;
    //   projects.forEach((project, index) => {
    //     this.renderer.setStyle(project, 'transform', `translateY(${scrolled * 0.1 * (index + 1)}px)`);
    //   });
    // });

    // Efecto de hover
    projects.forEach(project => {
      this.renderer.listen(project, 'mousemove', (e) => {
        const { left, top, width, height } = project.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;

        this.renderer.setStyle(project, 'transform', `perspective(1000px) rotateY(${x * 10}deg) rotateX(${y * -10}deg) scale3d(1.05, 1.05, 1.05)`);
      });

      this.renderer.listen(project, 'mouseleave', () => {
        this.renderer.setStyle(project, 'transform', 'perspective(1000px) rotateY(0) rotateX(0) scale3d(1, 1, 1)');
      });
    });
  }
}