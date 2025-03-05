import { Component, OnInit } from '@angular/core';
import { ApiService } from '../.././service/api.service';
import { UserNavigationComponent } from '../user-navigation/user-navigation.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CartState } from '../../redux/cart.model';
import { select, Store } from '@ngrx/store';

@Component({
  selector: 'app-ticket-process',
  standalone: true,
  imports: [
    UserNavigationComponent,
    CommonModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [ApiService],
  templateUrl: './ticket-process.component.html',
  styleUrl: './ticket-process.component.css',
})
export class TicketProcessComponent implements OnInit {
  ticketid: string = '';
  compainttype: string = '';
  Remarks: string = '';
  response: any = [];

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
        this.user = user;
        this.GetTicketcomment();
      }
    });
  }

  GetTicketcomment() {
    this.ticketid = localStorage.getItem('Ticket_id') || '';

    this.dbService
      .TicketDetails(this.user.customerid, this.ticketid)
      .subscribe((data) => {
        this.response = data as string[];
        //this.compainttype=this.response.[0]
      });
  }

  SaveReply() {
    this.dbService
      .SaveReply(this.ticketid, this.Remarks, this.user.customerid)
      .subscribe({
        next: (data) => {
          this.GetTicketcomment();
        },
      });
  }
}
