import { Component, OnInit } from '@angular/core';
import { ApiService } from '../.././service/api.service';
import { UserNavigationComponent } from '../user-navigation/user-navigation.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartState } from '../../redux/cart.model';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';

@Component({
  selector: 'app-top-ups',
  standalone: true,
  imports: [UserNavigationComponent, CommonModule, HttpClientModule],
  providers: [ApiService],
  templateUrl: './top-ups.component.html',
  styleUrl: './top-ups.component.css',
})
export class TopUpsHistoryComponent implements OnInit {
  topupus: any;


  user$: Observable<any>;
  user: any;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private store: Store<{ cart: CartState }>
  ) {
    this.user$ = this.store.pipe(select((state) => state.cart.user));
  }

  ngOnInit(): void {
    this.user$.subscribe((user) => {
      if (user.customerid) {
        this.user = user;
        this.getTopUps();
      }
    });
  }


  getTopUps() {
    this.apiService
      .getPurchasedTopupsDetails('1', this.user.customerid, '6')
      .subscribe((data: any) => {
        this.topupus = data;
      });
  }
}
