
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ApiService } from '../.././service/api.service';
import { environment } from '../../../environments/environment';
import { RouterModule } from '@angular/router';
import { UserNavigationComponent } from '../user-navigation/user-navigation.component';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-my-sim-detail',
  standalone: true,
  templateUrl: './my-sim-detail.component.html',
  styleUrl: './my-sim-detail.component.css',
  imports: [RouterModule, UserNavigationComponent, CommonModule, HttpClientModule],
  providers: [ApiService],
})
export class MyESimDetailsComponent implements OnInit {
  loginDetials: any = [];
  response: any = [];

  countryimgae: string = '';
  countryname: string = '';
  activation_code: string = '';
  addinformation: string = '';
  dataallowance: string = '';
  dataallowancetype: string = '';
  vaildity: string = '';
  recharge: string = '';
  Currency: string = '';
  sellingcost: string = '';
  flagimage: string = '';
  esimimage: string = '';
  planid: string = '';
  env = environment;

  constructor(
    @Inject(PLATFORM_ID) private _platformId: object,
    private dbService: ApiService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this.dbService
        .GetOrderHistory(
          '6',
          JSON.parse(localStorage.getItem('inventryid') || '{}')
        )
        .subscribe((data: any) => {
          // this.loading=false;
          this.response = data[0] as string[];
        });
    }
  }
}
