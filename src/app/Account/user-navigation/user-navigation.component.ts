import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CartItem, CartState } from '../../redux/cart.model';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-navigation',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './user-navigation.component.html',
  styleUrl: './user-navigation.component.css',
})
export class UserNavigationComponent {
  username: string = '';
  loginDetials: any = [];
  profilePhoto: string = '';
  env = environment;
  user$: Observable<CartItem[]>;
  user: any;

  constructor(private store: Store<{ cart: CartState }>, private router: Router) {
    this.user$ = this.store.pipe(select((state) => state.cart.user));
  }

  ngOnInit(): void {
    this.user$.subscribe((data: any) => {
      this.user = data;

      if(this.user == null) {
        // this.router.navigate(['/info/sign-in']);
      }
    });
  }

  get userInitial(): string {
    if (this.user?.Name) return this.user.Name.charAt(0).toUpperCase();
    if (this.user?.Email) return this.user.Email.charAt(0).toUpperCase();
    if (this.user?.name) return this.user.name.charAt(0).toUpperCase();
    if (this.user?.email) return this.user.email.charAt(0).toUpperCase();
    return '?'; // Default fallback
  }

  get fullName(): string {
    const firstName = this.user?.Name || this.user?.name || '';
    const lastName = this.user?.LastName || '';
    return `${firstName} ${lastName}`.trim();
  }

  logout() {
    localStorage.clear();
    window.location.href = '/';
  }
}
