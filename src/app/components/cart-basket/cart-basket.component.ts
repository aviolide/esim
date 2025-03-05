import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CartItem, CartState } from '../../redux/cart.model';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as CartActions from '../../redux/cart.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../service/cart.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-cart-basket',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-basket.component.html',
  styleUrl: './cart-basket.component.css',
  providers: [CartService, ApiService],
})
export class CartBasketComponent implements OnInit {
  cartItems: any[] = [];
  totalAmount = 0;
  private cartSubscription!: Subscription;
  promoCode: string = '';
  tipsinfo: string = '';
  txtpromocode: string = '';
  items$: Observable<CartItem[]>;
  user$: Observable<any>;
  discounts: any;
  totalDiscounts: Number = 0;
  user: any;
  isApplyDiscount: boolean = false;
  isMonthlyPlan: boolean = false;
  isFamilyDiscount: boolean = false;
  isFamilyDiscountApplied: boolean = false;
  isMaxDiscountApplied: boolean = false;

  constructor(
    private store: Store<{ cart: CartState }>,
    private router: Router,
    private cartService: CartService,
    private route: ActivatedRoute,
    private ngxLoader: NgxUiLoaderService,
    private apiService: ApiService
  ) {
    this.items$ = this.store.pipe(select((state) => state.cart.items));
    this.user$ = this.store.pipe(select((state) => state.cart.user));
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser = () => {
    this.user$.subscribe((user) => {
      this.user = user;
      if (!user) {
        toast.error('Please login to continue');
        // this.router.navigate(['/info/sign-in']);
      } else {
        this.fetchCartItems();
      }
    });
  };

  fetchCartItems = () => {
    let planType = window.localStorage.getItem('plan');

    if (planType == 'subscription') {
      this.isMonthlyPlan = true;
      this.getMonthlyPlan();
    } else {
      this.getCartItems();
    }
  };

  checkCouponDiscount = () => {
    let discount = window.localStorage.getItem('discount');

    if (discount) {
      this.discounts = JSON.parse(discount);
      this.isApplyDiscount = true;
      this.txtpromocode = this.discounts.CouponCode;
      this.totalDiscounts = +this.discounts.DiscountPercent
        ? +this.discounts.DiscountPercent / 100
        : 0;
    }
  };

  getMonthlyPlan = () => {
    this.ngxLoader.start();
    this.apiService
      .getMonthlyCartData(this.user.customerid)
      .subscribe((data: any) => {
        this.cartItems = data;

        let amount = 0;

        if (this.cartItems.length > 0) {
          amount = this.cartItems.reduce(
            (prev: any, next: any) => prev + next.saleprice * next.qty,
            0
          );
        }
        window.localStorage.setItem(
          'subscriptionAmount',
          JSON.stringify(amount)
        );

        if (this.cartItems.length == 0) {
          toast.error('No monthly plan found in your cart');
          this.store.dispatch(CartActions.clearCart());
          this.redirectToEsimPlansPage();
        }
        this.ngxLoader.stop();
      });
  };

  getCartItems = () => {
    this.ngxLoader.start();
    this.cartService.getCart().subscribe((data: any) => {
      this.cartItems = data;

      if (this.cartItems.length == 0) {
        this.store.dispatch(CartActions.clearCart());
        toast.error('No plan found in your cart');
        this.redirectToEsimPlansPage();
      }

      this.checkIsAutomaticDiscount(this.cartItems);

      this.ngxLoader.stop();
      this.checkCouponDiscount();
    });
  };

  checkIsAutomaticDiscount = (cartItems:any) => {
    const totalAmount = this.getTotalAmount();

    // Reset discount flags
    this.isMaxDiscountApplied = false;
    this.isFamilyDiscount = false;
    this.txtpromocode = '';

    // Check if Family Discount applies (Higher Priority)
    const highValueItems = cartItems.filter((item:any) => item.saleprice >= 20);
    const hasTwoDifferentHighValueItems = highValueItems.length >= 2;
    const hasHighValueBulkItem = cartItems.some((item:any) => item.saleprice >= 20 && item.qty >= 2);

    if (hasTwoDifferentHighValueItems || hasHighValueBulkItem) {
      this.isFamilyDiscount = true;
      this.txtpromocode = 'DF304875@FAMilyms98';
      this.getcupuon();
      return; // Stop further checks since Family Discount has priority
    }

    // Check if Max Discount applies (Lower Priority) - 3% discount if minimum cart items are 2 or single item has quantity 2
    const hasMinimumItems = cartItems.length >= 2 || cartItems.some((item:any) => item.qty >= 2);
    if (totalAmount >= 35 && hasMinimumItems) {
      this.isMaxDiscountApplied = true;
      this.txtpromocode = 'AB03248r09887fAMily';
      this.getcupuon();
      return;
    }

    // If no discount applies, remove any existing promo code
    this.Removecupuon();
  };


  redirectToEsimPlansPage = () => {
    let redirect = window.localStorage.getItem('redircturl');

    if (redirect) {
      let url: any = '/esim/' + redirect;

      this.router.navigate([url]);
    } else {
      this.router.navigate(['/']);
    }
  };

  removeFromCart(cart: any) {
    this.ngxLoader.start();
    const productId = cart.plane_id;
    const cartId = cart.c_id;

    this.store.dispatch(CartActions.removeFromCart({ productId }));
    this.cartSubscription = this.cartService
      .deleteCart(cartId)
      ?.subscribe(() => {
        this.fetchCartItems();
      });
  }

  getTotalAmount(): number {
    const total = this.cartItems.reduce(
      (acc: number, item: any) => acc + item.saleprice * item.qty,
      0
    );
    return total;
  }

  getDiscountAmount(): string {
    if (this.discounts?.DiscountPercent > 0) {
      const totalAmount = this.getTotalAmount();
      const discountAmount =
        (totalAmount * this.discounts.DiscountPercent) / 100;
      return discountAmount.toFixed(2); // Always show two decimal points
    }
    return '0.00';
  }

  getTotalFinalAmount(): string {
    const totalAmount = this.getTotalAmount();
    const discountAmount = this.discounts?.DiscountPercent
      ? (totalAmount * this.discounts.DiscountPercent) / 100
      : 0;
    const finalTotal = totalAmount - discountAmount;
    return finalTotal.toFixed(2); // Ensure two decimal points
  }

  incrementQuantity(cart: any) {
    let planeId: any = cart.plane_id;
    if (cart.maxcartvalue == cart.qty) {
      toast.error('You can not add more than available maximum quantity');
      return;
    }

    this.store.dispatch(CartActions.incrementQuantity({ productId: planeId }));

    let payload = {
      P_id: planeId,
      planename: cart.plan_name,
      quantity: cart.qty,
      sellingcost: cart.saleprice,
      countryname: cart.countryname,
    };

    this.cartService.incrementQuantity(payload).subscribe(() => {
      this.fetchCartItems();
    });
  }

  decrementQuantity(cart: any) {
    let planeId: any = cart.plane_id;
    if (cart.qty === 1 || cart.mincartvalue == cart.qty) {
      toast.error('You can not remove less than available minimum quantity');
      return;
    }

    this.store.dispatch(CartActions.decrementQuantity({ productId: planeId }));

    let payload = {
      P_id: planeId,
      planename: cart.plan_name,
      quantity: cart.qty,
      sellingcost: cart.saleprice,
      countryname: cart.countryname,
    };

    this.cartService.decreamentQuantity(payload).subscribe(() => {
      this.fetchCartItems();
    });
  }

  Removecupuon() {
    this.txtpromocode = '';
    this.isApplyDiscount = false;
    this.isMaxDiscountApplied = false;
    this.totalDiscounts = 0;
    this.discounts = null;
    window.localStorage.removeItem('discount');
    this.isFamilyDiscountApplied = false;
  }

  getcupuon() {
    this.ngxLoader.start();
    this.apiService.GetPromoCode(this.txtpromocode).subscribe((data: any) => {
      if (data.Status == 1) {
        this.isApplyDiscount = true;

        let total = +data.DiscountPercent / 100;
        this.totalDiscounts = +total.toFixed(2);

        this.discounts = data;
        let res = { ...data, CouponCode: this.txtpromocode };
        window.localStorage.setItem('discount', JSON.stringify(res));

        if (this.isFamilyDiscount) {
          this.isFamilyDiscountApplied = true;
        } else {
          this.isFamilyDiscountApplied = false;
        }

        this.ngxLoader.stop();
      } else {
        this.ngxLoader.stop();
        toast.error(
          'This coupon code doesn’t exist any more. Please try again.'
        );
        this.txtpromocode = '';
      }
    });
  }
}
