import { Component, Inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { HttpClientModule } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { Observable } from 'rxjs';
import { CartState } from '../../redux/cart.model';
import { select, Store } from '@ngrx/store';
import { toast } from 'ngx-sonner';
import SHA1 from 'crypto-js/sha1';
declare let ire: Function;
declare let gtag: Function;
import * as CartActions from '../../redux/cart.actions';
@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [HttpClientModule],
  providers: [ApiService],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.css',

})
export class PaymentSuccessComponent {
  private sub: any;

  sessionid: any;
  cusomerid: string = '';

  price: string = '';
  loginDetials: any = [];
  logindata: any = [];
  loginguestDetials: any = [];
  user$: Observable<any>;
  user: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dbService: ApiService,
    private store: Store<{ cart: CartState }>,
    @Inject(DOCUMENT) private dom: Document
  ) {
    this.user$ = this.store.pipe(select((state) => state.cart.user));

    this.user$.subscribe((user) => {
      if (!user) {
        toast.error('Please login to continue');
        // this.router.navigate(['/info/sign-in']);
      } else {
        this.user = user;
        this.cusomerid = this.user.customerid;
        this.store.dispatch(CartActions.clearCart());
      }
    });

    const loginstate = localStorage.getItem('logdetails');
    const loggustinstate = localStorage.getItem('Guestlogdetails');
    this.router.events.subscribe((event) => {
      if (loginstate) {
        this.loginDetials = JSON.parse(
          localStorage.getItem('logdetails') || '{}'
        );
        this.cusomerid = this.loginDetials.customerid;
      } else if (loggustinstate) {
        this.loginguestDetials = JSON.parse(
          localStorage.getItem('Guestlogdetails') || '{}'
        );
        this.cusomerid = this.loginguestDetials.customerid;
      }

      this.dbService.get_lastsale(this.cusomerid).subscribe({
        next: (data) => {
          this.logindata = data;
          this.price = this.logindata.price;

          if (event instanceof NavigationEnd) {
            //   gtag('event', 'conversion', {
            //     'send_to': 'AW-366348058/EdNGCPGU-ooYEJqO2K4B',
            //     'value':this.price,
            //     'currency': 'USD',
            //     'transaction_id': ''
            // });

            //   var sha1 = require('sha1');
            //  var emailsha1 = sha1(this.logindata.Email);
            const emailsha1 = SHA1(this.logindata.email);
            ire(
              'trackConversion',
              40247,
              {
                orderId: this.logindata.Paymentid,
                customerId: this.logindata.CustomerID,
                customerEmail: emailsha1,
                customerStatus: this.logindata.customerStatus,
                currencyCode: 'USD',
                orderPromoCode: this.logindata.PromoCode,
                orderDiscount: 0.0,
                items: [
                  {
                    subTotal: this.price,
                    category: 'ESimExpress',
                    sku: this.logindata.P_code,
                    quantity: 1,
                    name: this.logindata.planname,
                  },
                ],
              },
              {
                verifySiteDefinitionMatch: true,
              }
            );
          }
        },
        error: (err) => {},
      });
    });

    if (loginstate) {
      this.loginDetials = JSON.parse(
        localStorage.getItem('logdetails') || '{}'
      );
      this.cusomerid = this.loginDetials.customerid;
    } else if (loggustinstate) {
      this.loginguestDetials = JSON.parse(
        localStorage.getItem('Guestlogdetails') || '{}'
      );
      this.cusomerid = this.loginguestDetials.customerid;
    }

    this.dbService.get_lastsale(this.cusomerid).subscribe({
      next: (data) => {
        this.logindata = data;
        this.price = this.logindata.price;

        //  start ecommerce
        (window as any).dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
        (window as any).dataLayer.push({
          event: 'purchase',
          ecommerce: {
            transaction_id: this.logindata.Paymentid,
            value: this.price,

            currency: 'USD',

            items: [
              {
                item_id: this.logindata.planeid,
                item_name: this.logindata.planname,
                affiliation: 'ESimExpress Store',
                coupon: '',
                discount: 0,
                index: 0,
                item_brand: 'ESimExpress',
                item_category: 'eSim',

                item_list_id: 'related_products',
                item_list_name: this.logindata.planname,

                price: this.price,
                quantity: 1,
              },
            ],
          },
        });
      },
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.sessionid = params['id'];

      if (this.sessionid == null || this.sessionid == undefined) {
      } else {
        this.dbService
          .strip_session_Updateorder(this.sessionid)
          .subscribe((data) => {
            console.log(data as string[]);
          });
      }
    });

    localStorage.removeItem('Refsite');
  }

  my_esim() {
    const loginstate = localStorage.getItem('logdetails');
    const loggustinstate = localStorage.getItem('Guestlogdetails');
    if (loginstate) {
      this.router.navigateByUrl('verify/myesim');
    } else if (loggustinstate) {
      this.router.navigateByUrl('verify/guestorder');
    }
  }
}
