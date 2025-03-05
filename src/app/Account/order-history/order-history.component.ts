import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ApiService } from '../.././service/api.service';
import { UserNavigationComponent } from '../user-navigation/user-navigation.component';
import { HttpClientModule } from '@angular/common/http';
import { CartState } from '../../redux/cart.model';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [UserNavigationComponent, CommonModule, HttpClientModule],
  providers: [ApiService],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css',
})
export class OrderHistoryComponent implements OnInit {
  loginDetials: any = [];
  response: any = [];
  name: string = '';

  user$: Observable<any>;
  user: any;

  constructor(
    private apiService: ApiService,
    private store: Store<{ cart: CartState }>
  ) {
    this.user$ = this.store.pipe(select((state) => state.cart.user));
  }

  ngOnInit(): void {
    this.user$.subscribe((user) => {
      if (user.customerid) {
        this.user = user;
        this.getDetails();
      }
    });
  }

  getDetails(): void {
    this.apiService
      .GetOrderHistory('7', this.user.customerid)
      .subscribe((data) => {
        // this.loading=false;
        this.response = data as string[];
      });
  }
}
