import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../service/api.service';

import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HeaderComponent } from '.././components/header/header.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CartBasketComponent } from '.././components/cart-basket/cart-basket.component';
import { CartService } from '../service/cart.service';
import { Observable } from 'rxjs';
import { CartItem, CartState } from '../redux/cart.model';
import { select, Store } from '@ngrx/store';
import { toast } from 'ngx-sonner';
import * as CartActions from '../redux/cart.actions';
import { Title } from '@angular/platform-browser';

declare let ire: Function;
declare var Stripe: any;

declare global {
  interface Window {
    StripeCheckout: any;
  }
}

@Component({
  selector: 'app-checkout-esim',
  standalone: true,
  imports: [CartBasketComponent, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './checkout-esim.component.html',
  styleUrl: './checkout-esim.component.css',
  providers: [ApiService],
})
export class CheckoutEsimComponent implements OnInit {
  isPaymentBtn: boolean = false;
  isPaymentBtn2: boolean = false;
  isPaymentBtn3: boolean = false;

  isUKPlan: boolean = false;
  isMonthlyPlan: boolean | undefined;
  isStudentPlanExist: boolean = false;
  showAlertModel: boolean = false;
  isLoading: boolean = false;

  private regionname: any;
  private sub: any;
  monthlytab: boolean = false;
  flag: any;
  loading: boolean = false;
  plan: any = [];
  plan_review: any = [];
  plane_id: string = '';
  accounttype: string = 'register';
  paymentmessage: string = '';
  Guestmessage: string = '';
  cusomter_id: string | undefined;
  planDetials: any = [];
  datanotfound: boolean = false;
  Istraveldatevisual: boolean = false;
  firststep: boolean = false;
  secondstep: boolean = false;
  thridstep: boolean = false;
  tipsinfo: boolean = false;
  loginstatus: boolean = true;
  loginGueststatus: boolean = true;
  popStudentDoc: boolean = false;
  kycstaus: boolean = false;
  studentkycstaus: boolean = false;
  StudentDocstaus: boolean = false;
  minValue: number = 0;
  maxValue: number = 250;
  defaultDate: Date = new Date();
  isGlobalPlan: boolean = false;
  expandedPlans: boolean = false;

  alertShown = false;
  isFamilyPlan: boolean = false;
  isSubscriptionPlan: boolean = false;

  //  star payment parammeter
  minDate = new Date();
  countryname: string = '';
  dataallowance: string = '';
  dataallowancetype: string = '';
  dataallowanceMonthly: string = '';
  vaildity: string = '';
  loginDetials: any = [];
  Gustlogindata: any = [];
  responseMeta: any = [];
  sellingcost: number = 0;
  totalDiscount: string | undefined;
  finalPrice: string | undefined;
  Discount: number | undefined;
  response: string = '';
  stripeemail: string = '';
  stripeTokenid: string = '';

  IsGuestlogin: boolean = false;
  IsGuestotp: boolean = false;
  IsPayment: boolean = false;
  Paypal: boolean = true;
  paymentHandler: any = null;

  VoiceMinute: any;
  Plansource: any;

  PlanDuration: string = '';
  Planname: string = '';
  Plannamewarning: string = '';
  ValidityTab: boolean = true;
  Finalsellingcost: any;
  PriceDiffernece: any;
  txtpromocode: string = '';
  txtguestemail: string = '';
  txtguestemailConfirm: string = '';
  txtguestotp: string = '';
  countryName: string = '';
  isApplyPromo: boolean = false;

  @ViewChild('alertModal', { static: true }) alertModal!: ElementRef;
  plans: any;
  cartItems: any;
  isAcceptTerms: boolean = true;

  items$: Observable<CartItem[]>;
  sourceOfAcquisition: string = 'ESimExpress';
  eKYCId: string = '';
  uTMSource: string = 'ESimExpress';
  uTMMedium: string = 'ESimExpress';
  uTMCampaign: string = 'ESimExpress';
  accountType: string = 'register';
  planType: string = 'subscription';
  user$: Observable<any>;
  user: any;
  totalAmount: number = 0;
  monthlyPlans: any;

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private apiService: ApiService,
    private ngxLoader: NgxUiLoaderService,
    private route: ActivatedRoute,
    private titleService: Title,
    private store: Store<{ cart: CartState }>
  ) {
    this.plan = [];
    this.items$ = this.store.pipe(select((state) => state.cart.items));
    this.user$ = this.store.pipe(select((state) => state.cart.user));
    this.token = undefined;
  }

  ngOnInit(): void {
    this.invokeStripe();
    this.items$.subscribe((data) => {
      this.cartItems = data;
    });
    this.user$.subscribe((data) => {
      this.user = data;
      if (this.user) {
        this.getMonthlyPlanCart();
      }
    });
    this.getReference();
    this.titleService.setTitle('Checkout | ESimExpress');
  }

  getMonthlyPlanCart = () => {
    this.apiService
      .getMonthlyCartData(this.user.customerid)
      .subscribe((cart: any) => {
        if (cart) {
          let amount = cart
            .map((item: any) => item.saleprice * item.qty)
            .reduce((prev: any, next: any) => prev + next, 0);
          this.totalAmount = amount;
          this.monthlyPlans = cart;
        }
      });
  };

  getReference = () => {
    if (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    ) {
      const reference = window.localStorage.getItem('Refsite');
      if (reference) {
        this.sourceOfAcquisition = JSON.parse(reference);
      }

      const Refekyc_id = window.localStorage.getItem('ekyc_id');
      if (Refekyc_id) {
        this.eKYCId = JSON.parse(Refekyc_id);
      }

      const utm_sourceurl = window.localStorage.getItem('utm_source');
      if (utm_sourceurl) {
        this.uTMSource = JSON.parse(utm_sourceurl);
      }

      const utm_mediumurl = window.localStorage.getItem('utm_medium');
      if (utm_mediumurl) {
        this.uTMMedium = JSON.parse(utm_mediumurl);
      }

      const utm_campaignurl = window.localStorage.getItem('utm_campaign');
      if (utm_campaignurl) {
        this.uTMCampaign = JSON.parse(utm_campaignurl);
      }

      const guestAccount = window.localStorage.getItem('guestUser');
      if (guestAccount) {
        this.accountType = 'guest';
      }

      const planType = window.localStorage.getItem('plan');
      if (planType) {
        this.planType = planType;
      }

      const redirect = window.localStorage.getItem('redircturl');
      if (redirect) {
        this.countryName = redirect;
      }
    }

    // Proceed with the rest of the function
    this.checkPlanType();
  };

  checkPlanType() {
    if (this.planType === 'subscription') {
      this.isSubscriptionPlan = true;
      this.Paypal = false;
    }
  }

  // End of Review
  scroll(element: { yPosition: ScrollToOptions | undefined }) {
    window.scrollTo(element.yPosition);
  }

  changeEvent(event: any) {
    // Return date object
  }

  kyc_response: any = [];
  // r_DataAllowance:string='';

  stdentresponse: any = [];

  @ViewChild('photoInput') photoInput: ElementRef | undefined;

  Verifypage() {
    window.localStorage.setItem(
      'countryname',
      JSON.stringify(this.plan_review.CountryNameWithregion)
    );
    window.localStorage.setItem(
      'plan_id',
      JSON.stringify(this.plan_review.PlanId)
    );
    window.localStorage.setItem(
      'Pageurl',
      JSON.stringify(this.plan_review.CountryName)
    );

    this.router.navigateByUrl('verify/instruct');
  }

  Refsite: string = '';
  cumerid: string = '';

  // strip pyament start
  stripeAPIKey: any =
    'pk_live_51LLhobJQXtuoBk8elWU9kCGpVZnESeXoJRVQTWlsVlkvLsCHWXyXQwAD8pA66sWG8nwAPv2giWiWDjTO0uxqDfji00jbr6YWta';

  // stripeAPIKey: any =
  //   'pk_test_51LLhobJQXtuoBk8erSEneavvDpBSlzuPGikcqqpeo0xG4DtK19uwYq2pJLenG7LvQldy5e8R4PCdCYJg6BABmeP800o7AJsStJ';

  token: string | undefined;

  /* ********* Refactor code ********* */

  makePayment() {
    let payamount = window.localStorage.getItem('subscriptionAmount') || false;

    if (payamount) {
      payamount =  JSON.parse(payamount);

    } else {
      window.location.reload();
    }

  
    const checkbox = document.getElementById(
      'compatibleCheck'
    ) as HTMLInputElement | null;

    if (!this.areAllCheckboxesChecked()) {
      this.isAcceptTerms = false;
      return;
    }

    this.ngxLoader.start();

    const paymentHandler = window.StripeCheckout.configure({
      key: this.stripeAPIKey,
      locale: 'auto',
      token: (stripeToken: any) => {
        this.stripeemail = stripeToken.email;
        this.stripeTokenid = stripeToken.id;
        window.localStorage.setItem(
          'stripeemail',
          JSON.stringify(stripeToken.email)
        );
        window.localStorage.setItem(
          'stripeTokenid',
          JSON.stringify(stripeToken.id)
        );


        if (this.monthlyPlans?.[0].DurationType == '3') {
          if (stripeToken.card.funding == 'credit') {
            this.cardpayment();
            this.ngxLoader.stop();
          } else {
            alert('We only accept credit cards for subscription  plans');
            this.ngxLoader.stop();
          }
        } else {
          this.ngxLoader.stop();
          // this.cardpayment();
        }
      },
    });

    paymentHandler.open({
      name: 'Pay with your card ',
      description: 'via stripe.',
      amount: +payamount * 100,
    });
    this.ngxLoader.stop();
  }
  // checkout start //

  cardpayment() {
    this.loading = true;

    this.stripeTokenid = JSON.parse(
      localStorage.getItem('stripeTokenid') || '{}'
    );

    this.stripeemail = JSON.parse(localStorage.getItem('stripeemail') || '{}');

    if (this.stripeTokenid != '') {
      const utm_sourceurl = localStorage.getItem('utm_source');
      const utm_source = utm_sourceurl ? JSON.parse(utm_sourceurl) : 'ESimExpress';

      const utm_mediumurl = localStorage.getItem('utm_medium');
      const utm_medium = utm_mediumurl ? JSON.parse(utm_mediumurl) : 'ESimExpress';

      const utm_campaignurl = localStorage.getItem('utm_campaign');
      const utm_campaign = utm_campaignurl
        ? JSON.parse(utm_campaignurl)
        : 'ESimExpress';
      this.apiService
        .cardpayment(
          this.stripeemail,
          this.stripeTokenid,
          '',
          this.sourceOfAcquisition,
          '',
          this.user.customerid,
          '1',
          '',
          '',
          this.accounttype,
          utm_source,
          utm_medium,
          utm_campaign
        )
        .subscribe((data) => {
          // alert( data as string[]);
          this.loading = false;
          this.response = data as string;
          if (this.response == 'succeeded') {
            this.router.navigateByUrl('/info/paymentsucsess');
          } else {
            alert(this.response);
          }
        });
    }
  }

  /*------------------------------------------
   --------------------------------------------
 invokeStripe() Function
 --------------------------------------------
 --------------------------------------------*/
  invokeStripe() {
    if (
      typeof window !== 'undefined' &&
      !window.document.getElementById('stripe-script')
    ) {
      const script = window.document.createElement('script');

      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      // script.src = 'https://js.stripe.com/v3/';

      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: this.stripeAPIKey,
          locale: 'auto',
          token: function (stripeToken: any) {
            alert('Payment has been successfull!');
          },
        });
      };

      window.document.body.appendChild(script);
    }
  }

  // Paypal Payment - redirection /

  landpaymentpage() {
    this.ngxLoader.start();

    let promoCode;
    let promo = localStorage.getItem('discount');

    if (promo) {
      promoCode = JSON.parse(promo).CouponCode;
    }

    const url =
      // 'https://api-doc.esim.su/Plan/PaymentWithPaypal_web/?price=' +
      // 'https://api-doc.esim.place/PaymentCart/PaymentWithPaypal_cart/?product=esim&curancy=USD&cid=' +
      'https://api-doc.esim.su/PaymentCart/PaymentWithPaypal_cart/?product=esim&curancy=USD&cid=' +
      this.user.customerid +
      '&Refsite=' +
      this.sourceOfAcquisition +
      '&kycid=' +
      this.eKYCId +
      '&PromoCode=' +
      promoCode +
      '&logintype=' +
      this.accounttype +
      '&utm_source=' +
      this.uTMSource +
      '&utm_medium=' +
      this.uTMMedium +
      '&utm_campaign=' +
      this.uTMCampaign;
    this.ngxLoader.stop();
   window.open(url, '_self');
    console.log(url);
  }

  stripsessionid: any;

  /* ********* Refactor code ********* */

  /* Credit Debit Card Payment */

  strip_redirtct() {
    if (!this.areAllCheckboxesChecked()) {
      this.isAcceptTerms = false;
      return;
    }

    this.ngxLoader.start();

    let promoCode;
    let promo = localStorage.getItem('discount');

    if (promo) {
      promoCode = JSON.parse(promo).CouponCode;
    }
    this.apiService
      .strip_sessiong_save(
        this.user.customerid,
        this.sourceOfAcquisition,
        '1',
        this.eKYCId,
        promoCode,
        this.accounttype,
        this.uTMSource,
        this.uTMMedium,
        this.uTMCampaign
      )
      .subscribe((data: any) => {
        this.stripsessionid = data as string[];
        this.ngxLoader.stop();

        var stripe = Stripe(
          'pk_live_51LLhobJQXtuoBk8elWU9kCGpVZnESeXoJRVQTWlsVlkvLsCHWXyXQwAD8pA66sWG8nwAPv2giWiWDjTO0uxqDfji00jbr6YWta'
        );

        if (this.stripsessionid == 'false') {
          alert(
            'This payment method is on maintenance. Please choose PayPal for payment'
          );
        } else {
          stripe.redirectToCheckout({
            sessionId: this.stripsessionid,
          });
        }
      });
  }

  generratestripesession() {
    this.apiService.strip_sessiong_generate(this.plane_id).subscribe((data) => {
      this.stripsessionid = data as string[];
    });
  }

  ascending: boolean = true;

  consent = [{ checked: false }, { checked: false }, { checked: false }];

  areAllCheckboxesChecked() {
    return this.consent.every((checkbox) => checkbox.checked);
  }

  acceptAll() {
    const allChecked = this.areAllCheckboxesChecked();

    this.consent.forEach((checkbox) => {
      checkbox.checked = !allChecked;
    });

    this.isAcceptTerms = true;
  }

  goBack() {
    if (this.countryName == '') {
      this.router.navigateByUrl('/');
    } else {
      let url = '/esim/' + this.countryName;
      this.router.navigateByUrl(url);
    }
  }

  goToCheckout(type: any) {
    window.localStorage.setItem('plan', type);
    window.location.reload();
  }
}
