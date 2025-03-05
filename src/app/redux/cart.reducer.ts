import { createReducer, on } from '@ngrx/store';
import * as CartActions from './cart.actions';
import { CartState, initialState } from './cart.model';

// Utility to get cart state from localStorage on the client side only
const getInitialCartState = (): CartState => {
  if (typeof window !== 'undefined') {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const cart = JSON.parse(storedCart);
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return {
          items: cart.items || [], // Ensure items are an array
          total: cart.total || 0, // Ensure total is a number
          isModalOpen: false,
          user: user,
        };
      } catch (error) {}
    }
  }
  return initialState; // Return initial state if no cart exists
};

// Utility to save cart state to localStorage
const saveCartToLocalStorage = (cart: CartState): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
};

export const cartReducer = createReducer(
  getInitialCartState(),

  on(CartActions.loadCart, (state, { cart }) => {
    return {
      ...state,
      items: cart.items,
      total: 0,
     
    };
  }),

  on(CartActions.toggleCartModal, (state, { isOpen }) => {
    return {
      ...state,
      isModalOpen: isOpen, // Set the modal state based on the payload
    };
  }),

  on(CartActions.setUser, (state, { user }) => {
    window.localStorage.setItem('user', JSON.stringify(user)); // Save user to localStorage
    return {
      ...state,
      user: user,
    };
  }),

  on(CartActions.addToCart, (state, { item }) => {
    const existingItemIndex = state.items.findIndex(
      (i) => i.P_id === item.P_id
    );

    let updatedItems;

    if (existingItemIndex > -1) {
      // If the item already exists, update its quantity
      updatedItems = state.items.map((i, index) =>
        index === existingItemIndex ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      // If it's a new item, add it to the cart with a quantity of 1
      updatedItems = [...state.items, { ...item }];
    }

    const updatedTotal = updatedItems.reduce(
      (sum, item) => sum + item.sellingcost * item.quantity,
      0
    );

    const newState = { ...state, items: updatedItems, total: updatedTotal };

    // Save updated state to localStorage
    saveCartToLocalStorage(newState);

    return newState;
  }),

  on(CartActions.syncCart, (state, { cart }) => {
    const newState = {
      ...state,
      items: cart.items || [],
      total: cart.total || 0,
    };

    // Save the synced state to localStorage
    saveCartToLocalStorage(newState);

    return newState;
  }),

  on(CartActions.syncCart, (state, { cart }) => {
    const newState = {
      ...state,
      items: cart.items || [],
      total: cart.total || 0,
    };

    // Save the synced state to localStorage
    saveCartToLocalStorage(newState);

    return newState;
  }),

  on(CartActions.removeFromCart, (state, { productId }) => {
    const updatedItems = state.items.filter((i) => i.P_id !== productId);
    const updatedTotal = updatedItems.reduce(
      (sum, item) => sum + item.sellingcost * item.quantity,
      0
    );

    const newState = { ...state, items: updatedItems, total: updatedTotal };

    // Save updated state to localStorage
    saveCartToLocalStorage(newState);

    return newState;
  }),

  on(CartActions.incrementQuantity, (state, { productId }) => {
    const updatedItems = state.items.map((item) =>
      item.P_id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );

    const updatedTotal = updatedItems.reduce(
      (sum, item) => sum + item.sellingcost * item.quantity,
      0
    );

    const newState = { ...state, items: updatedItems, total: updatedTotal };

    // Save updated state to localStorage
    saveCartToLocalStorage(newState);

    return newState;
  }),

  on(CartActions.decrementQuantity, (state, { productId }) => {
    const updatedItems = state.items
      .map((item) =>
        item.P_id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    const updatedTotal = updatedItems.reduce(
      (sum, item) => sum + item.sellingcost * item.quantity,
      0
    );

    const newState = { ...state, items: updatedItems, total: updatedTotal };

    // Save updated state to localStorage
    saveCartToLocalStorage(newState);

    return newState;
  }),

  // updateTotalAmount reducer

  on(CartActions.updateTotalAmount, (state, { totalAmount }) => {
    return {
      ...state,
      total: totalAmount,
    };
  }),

  on(CartActions.clearCart, (state) => {
    const newState = {
      ...state,
      items: [],
      total: 0,
      
    };
    

    // Save updated state to localStorage
    saveCartToLocalStorage(newState);

    return newState;
  })
);
