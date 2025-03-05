
import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  year:any="";
  isShow: boolean = false;
  topPosToStartShowing = 100;
  public social = [
    {
      link: 'https://t.me/eSIMExpressBot',
      icon:'assets/images/facebook1.svg',
      alt: 'Telegram'  
    },
    
  ] 
  
  constructor(private router: Router) { }


  ngOnInit(): void {

   this.year= new Date().getFullYear();

  }

  
  goToRoute(route:string){
    this.router.navigate([route])
  }

}