import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as CartActions from '../../redux/cart.actions';
import { CartState, CartItem } from '../../redux/cart.model';

import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ApiService } from '../../service/api.service';
import { CartService } from '../../service/cart.service';
import { toast } from 'ngx-sonner';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  providers: [ApiService, CartService], 
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  totalAmount = 0;
  private cartSubscription!: Subscription;

  items$: Observable<CartItem[]>;
  user$: Observable<any>;
  user: any;

  isLogged: boolean = false;
  @ViewChild('authLoginModal') authLoginModal: any;
  userCart: any;

  constructor(
    private store: Store<{ cart: CartState }>,
    private router: Router,
    private apiService: ApiService,
    private cartService: CartService,
    private ngxLoader : NgxUiLoaderService
  ) {
    this.items$ = this.store.pipe(select((state) => state.cart.items));
    this.user$ = this.store.pipe(select((state) => state.cart.user));
  }

  ngOnInit(): void {
    // Subscribe to items$ to get actual cart items
    this.cartSubscription = this.items$.subscribe((item) => {
      this.cartItems = item.filter((item: any) => item.DurationType !== 3);
    });

    this.user$.subscribe((user) => {
      if (user && Object.keys(user).length > 0) {
        this.user = user;
        this.isLogged = user;
        this.getUserCart();
      }
    });

  }

  ngOnDestroy(): void {}

  getUserCart() {
    this.cartService.getCart().subscribe((res) => {
      this.userCart = res;
    });
  }

  addToCart(item: CartItem): void {
    this.store.dispatch(CartActions.addToCart({ item }));
  }

  removeFromCart(cart: any) {
    let planId = cart.P_id;
    this.ngxLoader.start();
    this.store.dispatch(CartActions.removeFromCart({ productId: planId }));

    if (this.isLogged) {
      let cartId: any = this.userCart?.length > 0 && this.userCart.find(
        (item: any) => item.plane_id === planId
      ).c_id;
      this.cartService.deleteCart(cartId).subscribe(() => {
        this.ngxLoader.stop();
      });
    }
    this.ngxLoader.stop();
  }

  incrementQuantity(cart: any) {
    this.ngxLoader.start();
    let planeId: any = cart.P_id;
    if (cart.maxcartvalue == cart.quantity) {
      toast.error('You can not add more than available maximum quantity');
      return;
    }
    this.store.dispatch(CartActions.incrementQuantity({ productId: planeId }));
    this.cartService.incrementQuantity(cart).subscribe(() => {
      this.ngxLoader.stop();
    });
    this.ngxLoader.stop();
  }

  decrementQuantity(cart: any) {
    let planeId: any = cart.P_id;
    if (cart.quantity === 1 || cart.mincartvalue == cart.quantity) {
      toast.error('You can not remove less than available minimum quantity');
      return;
    }
    this.ngxLoader.start();
    this.store.dispatch(CartActions.decrementQuantity({ productId: planeId }));
    this.cartService.decreamentQuantity(cart).subscribe(() => {
      this.ngxLoader.stop();
    });
    this.ngxLoader.stop();
  }

  clearCart(): void {
    this.store.dispatch(CartActions.clearCart());
  }

  checkout(): void {
    window.localStorage.setItem('plan', 'traveller');
    if (this.isLogged) {
      this.store.dispatch(CartActions.toggleCartModal({ isOpen: false }));
      this.router.navigate(['/checkout']);
    } else {
      this.store.dispatch(CartActions.toggleCartModal({ isOpen: false }));
      this.authLoginModal.nativeElement.click();
    }
  }

  continueShopping(): void {
    this.store.dispatch(CartActions.toggleCartModal({ isOpen: false }));
    let country = typeof window !== 'undefined' ? window.localStorage.getItem('redircturl') || null : null;
    if(country){
      this.router.navigate(['/esim/' + country])
    } else {
      this.router.navigate(['/'])
    }
  }

  closeToggleModal() {
    this.store.dispatch(CartActions.toggleCartModal({ isOpen: false }));
  }

  getCartTotal() {
    let items = this.cartItems.filter((item: any) => item.DurationType !== 3);

    return items
      .reduce((sum, item) => sum + item.sellingcost * item.quantity, 0)
      .toFixed(2);
  }
}
