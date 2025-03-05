import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../service/api.service';
import { select, Store } from '@ngrx/store';
import { toast } from 'ngx-sonner';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgxSonnerToaster } from 'ngx-sonner';
import { Title } from '@angular/platform-browser';

declare var Stripe: any;
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgxUiLoaderModule,
    NgxSonnerToaster
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
  providers: [ApiService],
})
export class CheckoutComponent implements OnInit {
  consent = [{ checked: false }, { checked: false }, { checked: false }];
  user: any = {};
  plan: any;

  top_id: string = '';
  error: any = false;
  success: any = false;
  orderIdNumber: string | undefined;
  orderid: string | undefined;
  topupdata: any = [];
  stripsessionid: any;
  isPaymentBtn: boolean = false;
  isVerifiedOrderId: boolean = false;
  isToggle: boolean = false;
  user$: any;
  accountType =  'register';

  areAllCheckboxesChecked() {
    return this.consent.every((checkbox) => checkbox.checked);
  }

  constructor(
    private router: Router,
    private apiService: ApiService,
    private store: Store<{ cart: any }>,
    private ngxLoader: NgxUiLoaderService,
    private titleService: Title 
  ) {
    this.user$ = this.store.pipe(select((state) => state.cart.user));
  }

  ngOnInit(): void {
    this.user$.subscribe((user: any) => {
      this.user = user;
      if(this.user) {
        this.accountType = this.user.accountType;
      }
    });
    this.getSavedTopupsPlan();
    this.titleService.setTitle('Checkout | ESimExpress');

  }

  getSavedTopupsPlan() {
    let plan = typeof window !== 'undefined' ? window.localStorage.getItem('selectedTopups') || false : false;
    if (!plan) {
      this.router.navigate(['/free-esim']);
    } else {
      this.plan = JSON.parse(plan);
  
    }
  }

  acceptAll() {
    const allChecked = this.areAllCheckboxesChecked();

    this.consent.forEach((checkbox) => {
      checkbox.checked = !allChecked;
    });
  }

  validateOrderId(e: any) {
    let orderId = e.target.value;
    if (orderId.length >= 5) {
      this.ngxLoader.start();
      this.apiService
        .verifyOrderId(orderId, orderId)
        .subscribe((res: any) => {
          if (res.status == 0) {
            toast.error(res.message);
            this.ngxLoader.stop();
          } else {
            this.orderIdNumber = orderId;
            this.success = 'Verified';
            this.error = false;
            this.isVerifiedOrderId = true;
            this.ngxLoader.stop();
          }
        });
    }

  }

  logout() {
    window.localStorage.clear();
    window.location.href = '/';
  }

  toggle() {
    this.isToggle = !this.isToggle;
  }

  strip_redirtct() {
    if(!this.isVerifiedOrderId){
      toast.error('Please verify your order id');
      return
    }
    
    this.topupdata = window.localStorage.getItem('selectedTopups') || false;

    this.ngxLoader.start();
    this.apiService
      .strip_topup_sessiong_save(
        this.plan.ID,
        this.orderid,
        '0',
        '1',
        this.accountType
      )
      .subscribe((data) => {
        this.stripsessionid = data as string[];
        this.ngxLoader.stop();
        var stripe = Stripe(
          'pk_live_51LLhobJQXtuoBk8elWU9kCGpVZnESeXoJRVQTWlsVlkvLsCHWXyXQwAD8pA66sWG8nwAPv2giWiWDjTO0uxqDfji00jbr6YWta'
        );

        if (this.stripsessionid == 'false') {
          toast.error('This payment method is on maintenance. Please choose PayPal for payment');
          this.ngxLoader.stop();
        } else {
          stripe.redirectToCheckout({
            sessionId: this.stripsessionid,
          });
          this.ngxLoader.stop();
        }
      });
  }
}
