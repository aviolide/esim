import { Component, OnInit } from '@angular/core';
import { ApiService } from '../.././service/api.service';
import { Router } from '@angular/router';
import { UserNavigationComponent } from '../user-navigation/user-navigation.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { select, Store } from '@ngrx/store';
import { CartState } from '../../redux/cart.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-my-esims',
  standalone: true,
  imports: [UserNavigationComponent, CommonModule, HttpClientModule],
  providers: [ApiService],
  templateUrl: './my-esims.component.html',
  styleUrl: './my-esims.component.css',
})
export class MyEsimsComponent implements OnInit {
  loginDetials: any = [];
  response: any = [];
  name: string = '';
  isLogin: boolean = false;

  user$: Observable<any>;
  user: any;

  constructor(
    private dbService: ApiService,
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
        this.getDetails();
      }
    });
  }

  getDetails() {
    this.dbService.MyeSim(this.user.customerid).subscribe((data) => {
      this.response = data as string[];
    });
  }

  simdetail(item: { inventry_id: string }) {
    this.router.navigateByUrl('/info/myesimdetail');

    localStorage.setItem('inventryid', JSON.stringify(item.inventry_id));
    this.router.navigateByUrl('/info/myesimdetail');
  }

  cancel_subscription(x: any) {
    this.dbService
      .Canceled_Subscriptions(
        x.transcation,
        x.inventry_id,
        this.user.customerid,
        x.planename
      )
      .subscribe(() => {
        this.getDetails();
      });
  }

  goToLoginPage() {
    // this.router.navigate(['/info/sign-in']);
  }
}
