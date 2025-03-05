import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { incrementQuantity } from '../redux/cart.actions';

@Injectable({
  providedIn: 'root',
})
export class CartService {
    //urlprefix: any = 'https://api-doc.esim.place';
    
    urlprefix: any = 'https://api-doc.esim.su';
    constructor(private http: HttpClient) {}

  getCustomerId() {
    let customerId = null;
    if (typeof localStorage !== 'undefined') {
      customerId = JSON.parse(localStorage.getItem('user') || '{}');
      customerId = customerId.customerid || customerId.Customerid;
    }
    return customerId;
  }

  get_Plan_CR_id(flag: any, c_id: any) {
    const url =
      this.urlprefix +
      'Home/GetCountryRegionsPlane_web_v2?flag=' +
      flag +
      '&countryid=' +
      c_id;

    return this.http.get(url);
  }

  getCart() {
    let customerId = this.getCustomerId();
    const url = this.urlprefix + `/Cart/Get_CartData/?Customerid=${customerId}`;
    return this.http.get(url);
  }

  getMonthlyCartData(customerId: any) {
    const url = this.urlprefix + '/Cart/Get_CartData_monthly?Customerid=' + customerId;
    return this.http.get(url);
  }

  insertCart(data: any) {
    let user = this.getCustomerId();

    if (!user) {
      return;
    }

    const payload: { [key: string]: any } = {
      CustomerId: this.getCustomerId(),
      planeid: data.P_id,
      plane_name: data.planename,
      sellingcost: data.sellingcost,
      totalAmount: +data.sellingcost * 1,
      qty: 1,
      countryname: data.countryname,
      EIDnumber: data.eid,
      IMEInumber: data.imei,
      traveldate: data.traveldate,
    };

    const url = `${this.urlprefix}/Cart/insertCart`;

    // Convert payload to query parameters using HttpParams
    let params = new HttpParams();
    Object.keys(payload).forEach((key) => {
      if (payload[key] !== undefined && payload[key] !== null) {
        params = params.append(key, payload[key].toString());
      }
    });

    // Send HTTP GET request with query parameters and handle the response
    this.http.get(url, { params }).subscribe(
      () => {
      },
      (error) => {
        console.error('Error inserting cart data:', error);
      }
    );
  }

  insertCartItems(data: any): Observable<any> {
    const user = this.getCustomerId();
  
    if (!user) {
      return throwError(() => new Error('User not authenticated.'));
    }
  
    const payload: { [key: string]: any } = {
      CustomerId: user,
      planeid: data.P_id,
      plane_name: data.planename,
      sellingcost: data.sellingcost,
      totalAmount: +data.sellingcost * 1,
      qty: 1,
      countryname: data.countryname,
      EIDnumber: data.eid,
      IMEInumber: data.imei,
      traveldate: data.traveldate,
    };
  
    const url = `${this.urlprefix}/Cart/insertCart`;
  
    // Convert payload to query parameters using HttpParams
    let params = new HttpParams();
    Object.keys(payload).forEach((key) => {
      if (payload[key] !== undefined && payload[key] !== null) {
        params = params.append(key, payload[key].toString());
      }
    });
  
    // Return the HTTP GET request as an observable
    return this.http.get(url, { params }).pipe(
      catchError((error) => {
        console.error('Error inserting cart data:', error);
        return throwError(() => error); // Re-throw the error as an observable
      })
    );
  }
  

  deleteCart(cartId: any):Observable<any> {
    const url = this.urlprefix + `/Cart/Delete_CartData/?id=${cartId}`;
    return this.http.get(url);
  }

  incrementQuantity(data: any): Observable<any> {
    const qty = data.quantity + 1;
  
    const payload: { [key: string]: any } = {
      CustomerId: this.getCustomerId(),
      planeid: data.P_id,
      plane_name: data.planename,
      sellingcost: data.sellingcost,
      totalAmount: +data.sellingcost * qty,
      qty: qty,
      countryname: data.countryname,
      EIDnumber: data.eid,
      IMEInumber: data.imei,
      traveldate: data.traveldate,
    };

  
    const url = `${this.urlprefix}/Cart/insertCart`;
  
    let params = new HttpParams();
    Object.keys(payload).forEach((key) => {
      if (payload[key] !== undefined && payload[key] !== null) {
        params = params.append(key, payload[key].toString());
      }
    });
  
    // Return the HTTP GET request observable
    return this.http.get(url, { params });
  }
  

  decreamentQuantity(data: any): Observable<any>  {
    let qty = data.quantity - 1;

    const payload: { [key: string]: any } = {
      CustomerId: this.getCustomerId(),
      planeid: data.P_id,
      plane_name: data.planename,
      sellingcost: data.sellingcost,
      totalAmount: +data.sellingcost * qty,
      qty: qty,
      countryname: data.countryname,
      EIDnumber: data.eid,
      IMEInumber: data.imei,
      traveldate: data.traveldate,
    };

    const url = `${this.urlprefix}/Cart/insertCart`;

    let params = new HttpParams();
    Object.keys(payload).forEach((key) => {
      if (payload[key] !== undefined && payload[key] !== null) {
        params = params.append(key, payload[key].toString());
      }
    });

    // Send HTTP GET request with query parameters and handle the response
    return this.http.get(url, { params })
  }
}
