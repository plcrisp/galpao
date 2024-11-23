import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicial',
  templateUrl: './inicial.component.html',
  styleUrl: './inicial.component.scss'
})
export class InicialComponent {
  constructor(private router: Router){}
  ngOnInit(): void {}
  redirect() {
    this.router.navigate(['/login']);
  }
}
