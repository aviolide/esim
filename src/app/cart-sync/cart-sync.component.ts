import { Component, OnInit } from '@angular/core';
import { CartService } from '../service/cart.service';
import { HttpClientModule } from '@angular/common/http';
import { CartItem, CartState } from '../redux/cart.model';
import { Observable, lastValueFrom } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import * as CartActions from '../redux/cart.actions';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { catchError, take } from 'rxjs/operators';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-cart-sync',
  standalone: true,
  imports: [HttpClientModule],
  providers: [CartService],
  templateUrl: './cart-sync.component.html',
  styleUrls: ['./cart-sync.component.css'],
})
export class CartSyncComponent implements OnInit {
  savedCartItems: any = [];
  cartItems: any = [];
  items$: Observable<CartItem[]>;
  monthlyPlanItems: any = [];
  user$: Observable<any>;
  user: any;

  constructor(
    private store: Store<{ cart: CartState }>,
    private router: Router,
    private cartService: CartService,
    private ngxLoader: NgxUiLoaderService
  ) {
    this.items$ = this.store.pipe(select((state) => state.cart.items));
    this.user$ = this.store.pipe(select((state) => state.cart.user));
  }

  async ngOnInit(): Promise<void> {
    this.user$.pipe(take(1)).subscribe(async (user) => {
      if (!user || Object.keys(user).length === 0) {
        // this.router.navigate(['/info/sign-in']);
      } else {
        this.user = user;
        this.ngxLoader.start();

        try {
          // First, fetch cart items and monthly plan cart items
          await this.fetchCartItems();
          await this.fetchMonthlyPlanCartItems();

          // Once the APIs are successful, proceed to fetch saved cart items
          this.getSavedCart();
        } catch (error) {
          console.error('Error in fetching cart items:', error);
          this.showErrorToast('Failed to load cart data.');
          this.ngxLoader.stop();  // Ensure loader is stopped
          this.router.navigate(['/checkout']);
        }
      }
    });
  }

  async fetchCartItems(): Promise<void> {
    try {
      const data = await lastValueFrom(this.cartService.getCart().pipe(take(1)));
      this.cartItems = data;
    } catch (error) {
      console.error('Error fetching cart items:', error);
      throw error; // Propagate error to the caller
    }
  }

  async fetchMonthlyPlanCartItems(): Promise<void> {
    try {
      const data = await lastValueFrom(
        this.cartService.getMonthlyCartData(this.user.customerid).pipe(take(1))
      );
      this.monthlyPlanItems = data;
    } catch (error) {
      console.error('Error fetching monthly plan items:', error);
      throw error; // Propagate error to the caller
    }
  }

  getSavedCart() {
    this.items$.pipe(take(1)).subscribe((items) => {
      if (items.length > 0) {
        this.savedCartItems = items;
        this.insertCartItems();
      } else {
        this.syncCart();
      }
    });
  }

  insertCartItems() {
    const insertPromises = this.savedCartItems.map((item: any) =>
      lastValueFrom(
        this.cartService.insertCartItems(item).pipe(
          catchError((error) => {
            console.error('Error inserting cart item:', error); // Debugging log
            throw error; // Propagate error
          })
        )
      )
    );

    Promise.all(insertPromises)
      .then(() => {
        this.syncCart();
      })
      .catch((error) => {
        console.error('Error inserting cart items in bulk:', error); // Debugging log
        this.showErrorToast('Failed to insert cart items.');
        this.ngxLoader.stop();  // Ensure loader is stopped
        this.router.navigate(['/checkout']);
      });
  }

  syncCart() {
    this.cartService
      .getCart()
      .pipe(
        take(1),
        catchError((error) => {
          console.error('Error syncing cart:', error); // Debugging log
          this.ngxLoader.stop();  // Ensure loader is stopped
          this.router.navigate(['/checkout']);
          return [];
        })
      )
      .subscribe((data) => {
        this.cartItems = data;
        this.mergeCarts();
      });
  }

  mergeCarts() {
    if (!this.cartItems || !Array.isArray(this.cartItems)) {
      return;
    }

    const c = this.cartItems.map((item) => ({
      P_id: item.plane_id,
      addinformation: '',
      vaildity: '',
      plantype: '',
      mincartvalue: 0,
      maxcartvalue: 0,
      planename: item.plan_name,
      meta_title: '',
      operatorname: '',
      dataallowance: '',
      dataallowancetype: '',
      voice_minute: '',
      YearlySellingcost: 0,
      PriceDiffernece: 0,
      DurationType: item.DurationType,
      DurationSubType: item.DurationSubType,
      Kyc_status: 0,
      is_promocode: 0,
      planename1: item.plan_name,
      sellingcost: item.saleprice,
      Currency: '',
      vailditytype: '',
      dataallowanceMonthly: '',
      c_r_id: 0,
      countryname: item.countryname,
      quantity: item.qty,
      discount: 0,
    }));

    const cartState = {
      items: c,
      total: 0,
      isModalOpen: false,
      user: this.user,
      discount: 0,
    };

    this.store.dispatch(CartActions.syncCart({ cart: cartState }));
    this.ngxLoader.stop();  // Ensure loader is stopped
    this.router.navigate(['/checkout']);
  }

  showErrorToast(message: string) {
    toast.error(message);
  }
}
