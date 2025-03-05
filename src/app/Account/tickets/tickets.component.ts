import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ApiService } from '../.././service/api.service';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { UserNavigationComponent } from '../user-navigation/user-navigation.component';
import { HttpClientModule } from '@angular/common/http';
import { CartState } from '../../redux/cart.model';
import { select, Store } from '@ngrx/store';
@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [
    UserNavigationComponent,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
  ],
  providers: [ApiService],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css',
})
export class TicketsComponent implements OnInit {
  @ViewChild('closeBtn') closeBtn!: ElementRef;

  ticketForm!: FormGroup;
  submitted = false;
  name: string = '';
  user$: any;
  user: any;

  constructor(
    @Inject(PLATFORM_ID) private _platformId: object,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private router: Router,
    private store: Store<{ cart: CartState }>
  ) {
    this.user$ = this.store.pipe(select((state) => state.cart.user));
  }

  complaintmaster: any = [];
  subcomplaintmaster: any = [];

  response: any = [];

  get f() {
    return this.ticketForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    const { complaintmaster, subcomplaintmaster, EsimNumber, Remarks } =
      this.ticketForm.value;
    // stop here if form is invalid
    if (this.ticketForm.invalid) {
      return;
    } else {
      this.apiService
        .SaveTickets(
          complaintmaster,
          subcomplaintmaster,
          EsimNumber,
          Remarks,
          this.user.customerid
        )
        .subscribe({
          next: (data) => {
            this.Binddefaultticket();
            this.closeBtn.nativeElement.click();
          },
        });
    }
  }
  ngOnInit(): void {
    this.user$.subscribe((user: any) => {
      if (user.customerid) {
        this.user = user;
      }
    });

    this.ticketForm = this.formBuilder.group({
      complaintmaster: ['', Validators.required],
      subcomplaintmaster: ['', Validators.required],
      EsimNumber: [''],
      Remarks: ['', Validators.required],
    });

    if (isPlatformBrowser(this._platformId)) {
      this.Binddefaultticket();
      this.apiService.BindComplaintList().subscribe((data) => {
        // this.loading=false;
        this.complaintmaster = data as string[];
      });
    }
  }

  Binddefaultticket() {
    this.apiService
      .GetTicketOpenData(this.user.customerid)
      .subscribe((data) => {
        this.response = data as string[];
      });
  }
  subcomplaint(cid: string): void {
    const { complaintmaster, subcomplaintmaster, EsimNumber, Remarks } =
      this.ticketForm.value;
    this.apiService.BindSubcomplaint(complaintmaster).subscribe((data) => {
      // this.loading=false;
      this.subcomplaintmaster = data;
    });
  }
  ticketprocess(item: any, type: any) {
    window.localStorage.setItem('Ticket_id', JSON.stringify(item.ticket_id));
    window.localStorage.setItem('t_type', JSON.stringify(type));
    this.router.navigateByUrl('info/ticketprocess');
  }

  tab(tab: any) {
    if (tab == 'one') {
      this.apiService
        .GetTicketOpenData(this.user.customerid)
        .subscribe((data) => {
          // this.loading=false;
          this.response = data as string[];
        });
    } else if (tab == 'two') {
      this.apiService
        .GetTicketCloseData(this.user.customerid)
        .subscribe((data) => {
          // this.loading=false;
          this.response = data as string[];
        });
    } else if (tab == 'three') {
      this.apiService
        .GetTicketInprocessData(this.user.customerid)
        .subscribe((data) => {
          // this.loading=false;
          this.response = data as string[];
        });
    }
  }
}
