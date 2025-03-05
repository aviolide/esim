// cart.actions.ts
import { createAction, props } from '@ngrx/store';
import { CartItem, CartState } from './cart.model';

export const addToCart = createAction(
  '[Cart] Add to Cart',
  props<{ item: CartItem }>()
);

export const removeFromCart = createAction(
  '[Cart] Remove from Cart',
  props<{ productId: number }>()
);

export const incrementQuantity = createAction(
  '[Cart] Increment Quantity',
  props<{ productId: number }>()
);

export const decrementQuantity = createAction(
  '[Cart] Decrement Quantity',
  props<{ productId: number }>()
);

export const clearCart = createAction('[Cart] Clear Cart');

export const loadCart = createAction(
  '[Cart] Load Cart',
  props<{ cart: CartState }>()
);

export const toggleCartModal = createAction(
  '[Cart] Toggle Cart Modal',
  props<{ isOpen: boolean }>() // Accept a boolean payload
);

export const syncCart = createAction(
  '[Cart] Sync Cart',
  props<{ cart: CartState }>()
);

export const setUser = createAction('[Cart] Set User', props<{ user: any }>());

export const clearUser = createAction('[Cart] Clear User');

export const getUser = createAction('[Cart] Get User');

//updateTotalAmount

export const updateTotalAmount = createAction(
  '[Cart] Update Total Amount',
  props<{ totalAmount: number }>()
);