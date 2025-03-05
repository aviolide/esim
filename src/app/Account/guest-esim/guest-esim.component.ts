import { Component, OnInit } from '@angular/core';
import { ApiService } from '../.././service/api.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartState } from '../../redux/cart.model';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-guest-esim',
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule],
  providers: [ApiService],
  templateUrl: './guest-esim.component.html',
  styleUrl: './guest-esim.component.css',
})
export class GuestEsimComponent implements OnInit {
  response: any = [];
  name: string = '';
  isLogin: boolean = false;
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
        this.isLogin = true;
        this.user = user;
        this.binddata();
      }
    });
  }

  binddata() {
    this.apiService.GuestMyeSim(this.user.customerid).subscribe((data) => {
      this.response = data as string[];
    });
  }

  simdetail(item: any) {
    localStorage.setItem('inventryid', JSON.stringify(item.inventry_id));
    this.router.navigateByUrl('/info/myesimdetail');
  }
  cancel_subscription(x: any) {
    this.apiService
      .Canceled_Subscriptions(
        x.transcation,
        x.inventry_id,
        this.user.customerid,
        x.planename
      )
      .subscribe((data) => {
        this.binddata();
      });
  }

  goToLoginPage() {
    // this.router.navigate(['/info/sign-in']);
  }
}
