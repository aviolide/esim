 
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as fs from 'fs'; // Node.js file system module (for backend)
import { resolve } from 'path';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // jsonurlprefix: any = 'https://admin.esim.su/';
  jsonurlprefix: any = 'https://admin.esim.su/';

  //urlprefix:any="http://localhost:50679/";
  urlprefix: any = 'https://api-doc.esim.su/';
  // urlprefix: any = 'https://api-doc.esim.place/';
  // test genkinstest

  constructor(private http: HttpClient) {}

  isLoggedinUser() {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('isLoggedIn') || false;
    }
    return false;
  }

  // json dataread

  GetContryWiseJsonData(countryname: any) {
    const urlseond =
      'assets/JsonData/Web/AllLocalPlan/' + countryname + '.json';
    const url =
      this.jsonurlprefix + 'JsonData/Web/AllLocalPlan/' + countryname + '.json';
    // return this.http.get(url);

    return this.http
      .get(url)
      .pipe(catchError((error) => this.handleErrorAndRetry(error, urlseond)));
  }

  RegionWiseJsonData(countryname: any) {
    // const urlseond =
    //   'assets/JsonData/Web/ALLRegionalPlan/' + countryname + '.json';
    const url =
      this.jsonurlprefix +
      'JsonData/Web/ALLRegionalPlan/' +
      countryname +
      '.json';

    return this.http.get(url);

    // return this.http
    //   .get(url)
    //   .pipe(catchError((error) => this.handleErrorAndRetry(error, urlseond)));
  }

  getregionaldata() {
    // let url=this.urlprefix+'Home/BindDropdownCountry_web_v2?flag=2&countryid=0'
    const urlseond = 'assets/JsonData/Web/RegionList/Region.json';
    // console.log(urlseond);
    const url = this.jsonurlprefix + 'JsonData/Web/RegionList/Region.json';

    // return this.http.get(url);

    return this.http
      .get(url)
      .pipe(catchError((error) => this.handleErrorAndRetry(error, urlseond)));
  }

  getcountrydata() {
    // let url=this.urlprefix+'Home/BindDropdownCountry_web_v2?flag='+flag+'&countryid=0'
    const urlseond = 'assets/JsonData/Web/CountryList/Country.json';
    const url = this.jsonurlprefix + 'JsonData/Web/CountryList/Country.json';

    // return this.http.get(url);

    return this.http
      .get(url)
      .pipe(catchError((error) => this.handleErrorAndRetry(error, urlseond)));
  }

  private handleErrorAndRetry(
    error: HttpErrorResponse,
    urlsecond: string
  ): Observable<any> {
    console.error('First API call failed, trying second API:', error.message);

    // Make a second API call if the first one fails
    return this.http
      .get<any>(urlsecond)
      .pipe(catchError(this.handleFinalError));
  }
  private handleFinalError(error: HttpErrorResponse): Observable<never> {
    console.error('Second API call also failed:', error.message);

    return throwError('Both API calls failed; please try again later.');
  }

  // GetMetaTage(countryname: any) {
  //   let url = this.jsonurlprefix + 'JsonData/Metatag/' + countryname + '.json';

  //   return this.http.get(url);
  // }
  GetAllPlanJsonData() {
    const url = this.jsonurlprefix + 'JsonData/allPlan.json';

    return this.http.get(url);
  }

  ///
  getcountrydata10() {
    // const url =
    //   this.urlprefix +
    //   'Home/BindDropdownCountry_web_v2?flag=' +
    //   flag +
    //   '&countryid=0';
    const url = this.jsonurlprefix + 'JsonData/Web/CountryList/Country.json';
    return this.http.get(url);
  }

  AddSiteRefernce(refsite: any, reurl: any) {
    const url =
      this.urlprefix + 'Customer/Save_Ref?refsite=' + refsite + '&url=' + reurl;

    return this.http.get(url);
  }
  AddPlanTrack(refsite: any, planid: any, customerid: any) {
    const url =
      this.urlprefix +
      'Customer/Save_planTrack?refsite=' +
      refsite +
      '&planid=' +
      planid +
      '&customerid=' +
      customerid;

    return this.http.get(url);
  }

  getcountrydata_countryid(flag: any, c_id: any, plantype: any) {
    const url =
      this.urlprefix +
      'Home/GetPlansV2?flag=' +
      flag +
      '&countryid=' +
      c_id +
      '&PlanType=' +
      plantype;

    return this.http.get(url);
  }
  get_planDetails_Id(plan_id: any) {
    const url =
      this.urlprefix + 'Plan/getsoldinventory?flag=5&Customerid=' + plan_id;

    return this.http.get(url);
  }
  get_planDetails_Id_Planduration(plan_id: any, duration: any) {
    const url =
      this.urlprefix +
      'Plan/GetDurationByPlandetials?flag=6&planeid=' +
      plan_id +
      '&duration=' +
      duration;

    return this.http.get(url);
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

  get_data_byPlanName(Planname: any) {
    const url =
      this.urlprefix + 'Plan/Get_PlaneDetails?flag=5&plane_name=' + Planname;

    return this.http.get(url);
  }
  Get_PlaneDetails_country(Planname: any) {
    const url =
      this.urlprefix +
      'Plan/Get_PlaneDetails_country?flag=5&plane_name=' +
      Planname;

    return this.http.get(url);
  }
  get_Plan_Countries(Planname: any) {
    const url =
      this.urlprefix + 'Plan/Get_PlaneCountries?flag=5&plane_name=' + Planname;

    return this.http.get(url);
  }

  Get_TopupData(planeid: any) {
    const url = this.urlprefix + 'Plan/gettopup?planeid=' + planeid;

    return this.http.get(url);
  }

  get_data_popularCountry() {
    const url = this.urlprefix + 'Home/Get_PopularPlan?flag=1';

    return this.http.get(url);
  }
  get_data_popularRegional() {
    const url = this.urlprefix + 'Home/Get_PopularPlan?flag=2';

    return this.http.get(url);
  }

  get_blog(blogcategory: any, flag: any) {
    const url =
      this.urlprefix +
      'web/GetBloglist?blogcategory=' +
      blogcategory +
      '&flag=' +
      flag;

    return this.http.get(url);
  }
  get_blogDeteails(slug: any) {
    const url = this.urlprefix + 'web/GetBlog_ID?slug=' + slug;

    return this.http.get(url);
  }

  // sim detail by coutryname

  get_CountryIDByName(flag: any, locationname: any) {
    const url =
      this.urlprefix +
      'Home/GetCountryNameById_V2?flag=' +
      flag +
      '&countryname=' +
      locationname;

    return this.http.get(url);
  }
  strip_session_Updateorder(sessionid: any) {
    const url =
      this.urlprefix + 'PaymentCart/OrderSuccess?session_id=' + sessionid;

    return this.http.get(url);
  }
  strip_session_Update_topup_order(sessionid: any) {
    const url =
      this.urlprefix + 'Plan/TopUpOrderSuccess?session_id=' + sessionid;

    return this.http.get(url);
  }
  strip_sessiong_generate(plane_id: any) {
    const url =
      this.urlprefix + 'Stripe/CreateCheckoutSession?Pidid=' + plane_id;

    return this.http.get(url);
  }
  strip_sessiong_save(
    cid: any,

    refsite: any,

    paymenttype: any,

    kycid: any,
    PromoCode: any,
    Accounttype: any,
    utm_source: any,
    utm_medium: any,
    utm_campaign: any
  ) {
    const url =
      this.urlprefix +
      'StripCart/save_sessiondetails?cid=' +
      cid +
      '&source=web&refsite=' +
      refsite +
      '&paymenttype=' +
      paymenttype +
      '&kycid=' +
      kycid +
      '&PromoCode=' +
      PromoCode +
      '&logintype=' +
      Accounttype +
      '&utm_source=' +
      utm_source +
      '&utm_medium=' +
      utm_medium +
      '&utm_campaign=' +
      utm_campaign;

    return this.http.get(url);
  }

  // topup start

  strip_topup_sessiong_save(
    topid: any,
    cid: any,

    paymenttype: any,

    Promo: any,
    Accounttype: any
  ) {
    const url =
      this.urlprefix +
      'Stripe/save_topup_sessiondetails?topid=' +
      topid +
      '&source=web&cid=' +
      cid +
      '&Promo=' +
      Promo +
      '&logintype=' +
      Accounttype;

    return this.http.get(url);
  }
  ////  card payment and login api/////

  cardpayment(
    stripEmail: any,
    tokenid: any,
    Pidid: any,
    refsite: any,
    traveldatepram: any,
    cid: any,
    paymenttype: any,
    IMEInumber: any,
    EIDnumber: any,
    Accounttype: any,
    utm_source: any,
    utm_medium: any,
    utm_campaign: any
  ) {
    const url =
      this.urlprefix +
      'PaymentCart/Card_Paryment?stripEmail=' +
      stripEmail +
      '&tokenid=' +
      tokenid +
      '&Pidid=' +
      Pidid +
      '&source=web&refsite=' +
      refsite +
      '&traveldatepram=' +
      traveldatepram +
      '&cid=' +
      cid +
      '&paymenttype=' +
      paymenttype +
      '&IMEInumber=' +
      IMEInumber +
      '&EIDnumber=' +
      EIDnumber +
      '&logintype=' +
      Accounttype +
      '&utm_source=' +
      utm_source +
      '&utm_medium=' +
      utm_medium +
      '&utm_campaign=' +
      utm_campaign;

    return this.http.get(url);
  }

  ////  Regisaton and login api/////

  //// encyprtedurl
  // private key = CryptoJS.enc.Utf8.parse('1203199320052021');
  // private iv = CryptoJS.enc.Utf8.parse('1203199320052021');
  // Enccardpayment(
  //   stripEmail: any,
  //   tokenid: any,
  //   Pidid: any,
  //   refsite: any,
  //   traveldatepram: any,
  //   cid: any,
  //   paymenttype: any,
  //   IMEInumber: any,
  //   EIDnumber: any
  // ) {
  //   let lstrquerystring = stripEmail;

  //   var encrypted = CryptoJS.AES.encrypt(
  //     CryptoJS.enc.Utf8.parse(
  //       'stripEmail=' + stripEmail + '&tokenid=' + tokenid + '&Pidid=' + Pidid
  //     ),
  //     this.key,
  //     {
  //       keySize: 128 / 8,
  //       iv: this.iv,
  //       mode: CryptoJS.mode.CBC,
  //       padding: CryptoJS.pad.Pkcs7,
  //     }
  //   );

  //   let url =
  //     this.urlprefix +
  //     'Plan/Encripted_Card_Paryment?encrptionkeys=' +
  //     encrypted;

  //   return this.http.get(url);
  // }

  /////encrypedt url
  get_login_data(emailid: any, Password: any) {
    const url =
      this.urlprefix +
      'Customer/Cusotmer_Login?emailid=' +
      emailid +
      '&password=' +
      Password;

    return this.http.get(url);
  }

  Singup_guest(
    name: any,
    Lastname: any,
    emailid: any,
    Password: any,
    Refsite: any
  ) {
    const url =
      this.urlprefix +
      'Customer/Save_customer_Guest?source=web&name=' +
      name +
      '&Lastname=' +
      Lastname +
      '&emailid=' +
      emailid +
      '&password=' +
      Password +
      '&refernce=' +
      Refsite;

    return this.http.get(url);
  }
  Singup(name: any, Lastname: any, emailid: any, Password: any, Refsite: any) {
    const url =
      this.urlprefix +
      'Customer/Save_customer?source=web&name=' +
      name +
      '&Lastname=' +
      Lastname +
      '&emailid=' +
      emailid +
      '&password=' +
      Password +
      '&refernce=' +
      Refsite;

    return this.http.get(url);
  }
  CusotmerSocial_Login(name: any, emailid: any, CustImg: any, Refsite: any) {
    const url =
      this.urlprefix +
      'Customer/CusotmerSocial_Login?source=web&name=' +
      name +
      '&emailid=' +
      emailid +
      '&CustImg=' +
      CustImg +
      '&refernce=' +
      Refsite;

    return this.http.get(url);
  }
  get_lastsale(cusomerid: any) {
    const url = this.urlprefix + 'Customer/getlastsale?Customerid=' + cusomerid;

    return this.http.get(url);
  }

  OTPVerify(otpnumber: any, cusomerid: any) {
    const url =
      this.urlprefix +
      'Customer/OtpVerify?OTPnumber=' +
      otpnumber +
      '&Customerid=' +
      cusomerid;

    return this.http.get(url);
  }

  // forgot password

  forgotPassword(emailid: any) {
    const url = this.urlprefix + 'Customer/sent_email_OTP?emailid=' + emailid;

    return this.http.get(url);
  }
  // Password Reset

  ResetPassword(Customerid: any, password: any) {
    const url =
      this.urlprefix +
      'Customer/ChangePassword?Customerid=' +
      Customerid +
      '&password=' +
      password;

    return this.http.get(url);
  }

  // Partner enqueriyadd

  Save_Partner_Inquiry(
    CompanyName: any,
    CompanyWebsite: any,
    Country: any,
    NameofContact: any,
    Email: any,
    Phone: any,
    Comments: any,
    collaborationType?: any
  ) {
    const url =
      this.urlprefix +
      'Web/Save_Partner_Inquiry?CompanyName=' +
      encodeURIComponent(CompanyName) +
      '&CompanyWebsite=' +
      encodeURIComponent(CompanyWebsite) +
      '&Country=' +
      encodeURIComponent(Country) +
      '&NameofContact=' +
      encodeURIComponent(NameofContact) +
      '&Email=' +
      encodeURIComponent(Email) +
      '&Phone=' +
      encodeURIComponent(Phone) +
      '&collaborationType=' +
      encodeURIComponent(collaborationType) +
      '&Comments=' +
      encodeURIComponent(Comments);
    return this.http.get(url);
  }
  // Partner enqueriyadd

  SaveContactus_Inquiry(
    name: any,
    Lastname: any,
    emailid: any,
    Phone: any,
    EsimIccid: any,
    Subject: any,
    Message: any
  ) {
    const url =
      this.urlprefix +
      'Web/Save_Inquiry?name=' +
      name +
      '&Lastname=' +
      Lastname +
      '&emailid=' +
      emailid +
      '&Phone=' +
      Phone +
      '&EsimIccid=' +
      EsimIccid +
      '&Subject=' +
      Subject +
      '&Message=' +
      Message;

    return this.http.get(url);
  }

  // customer panel pages

  Customerprofile(Customerid: any) {
    const url =
      this.urlprefix +
      'Customer/GetCustomerprofile_web?Customerid=' +
      Customerid;

    return this.http.get(url);
  }
  // order history
  GetOrderHistory(flag: any, Customerid: any) {
    const url =
      this.urlprefix +
      'Plan/getsoldinventory?flag=' +
      flag +
      '&Customerid=' +
      Customerid;

    return this.http.get(url);
  }

  // my eSim data
  MyeSim(Customerid: any) {
    const url =
      this.urlprefix +
      'Plan/Web_myesim_status?flag=2&status=1&Customerid=' +
      Customerid;

    return this.http.get(url);
  }
  GuestMyeSim(Customerid: any) {
    const url =
      this.urlprefix +
      'Plan/Web_myesim_status?flag=3&status=1&Customerid=' +
      Customerid;

    return this.http.get(url);
  }
  // my eSim data
  MyeSimPedning(Customerid: any) {
    const url =
      this.urlprefix + 'Plan/Web_esminPending_status?Customerid=' + Customerid;

    return this.http.get(url);
  }

  Canceled_Subscriptions(
    subscription_id: any,
    inid: any,
    username: any,
    planname: any
  ) {
    const url =
      this.urlprefix +
      'Plan/Canceled_Subscriptions?subscription_id=' +
      subscription_id +
      '&inid=' +
      inid +
      '&username=' +
      username +
      'planname=' +
      planname;

    return this.http.get(url);
  }
  // Ticket detial
  //open
  GetTicketOpenData(Customerid: any) {
    const url =
      this.urlprefix +
      'Customer/GetTicketDetails?flag=0&Customerid=' +
      Customerid;

    return this.http.get(url);
  }
  //close

  GetTicketCloseData(Customerid: any) {
    const url =
      this.urlprefix +
      'Customer/GetTicketDetails?flag=1&Customerid=' +
      Customerid;

    return this.http.get(url);
  }
  //Inprocess

  GetTicketInprocessData(Customerid: any) {
    const url =
      this.urlprefix +
      'Customer/GetTicketDetails?flag=3&Customerid=' +
      Customerid;

    return this.http.get(url);
  }
  //Inprocess

  TicketDetails(Customerid: any, Ticket_id: any) {
    const url =
      this.urlprefix +
      'Customer/GetTicketDetailsNew?flag=51&Ticket_id=' +
      Ticket_id +
      '&Customerid=' +
      Customerid;

    return this.http.get(url);
  }

  getticket_check_e_y() {
    const url = this.urlprefix + 'Customer/get_string';
    return this.http.get(url);
  }
  //Bind Complaint list

  BindComplaintList() {
    const url = this.urlprefix + 'Customer/BindTicketComplaintType?flag=2';

    return this.http.get(url);
  }

  BindSubcomplaint(TicketComplain_id: any) {
    const url =
      this.urlprefix +
      'Customer/BindTicketsubComplain_id?flag=2&TicketComplain_id=' +
      TicketComplain_id;

    return this.http.get(url);
  }

  SaveTickets(
    TicketComplain_id: any,
    TicketSubComplain_id: any,
    esimnumber: any,
    remarks: any,
    Customerid: any
  ) {
    const url =
      this.urlprefix +
      'Customer/InsertTicketComplaintdetails?flag=1&TicketComplain_id=' +
      TicketComplain_id +
      '&TicketSubComplain_id=' +
      TicketSubComplain_id +
      '&prioritylevel=High&esimnumber=' +
      esimnumber +
      '&remarks=' +
      remarks +
      '&Customerid=' +
      Customerid;

    return this.http.get(url);
  }
  SaveReply(Ticket_id: any, remarks: any, Customerid: any) {
    const url =
      this.urlprefix +
      'Customer/TicketCommentUpdate?flag=2&Ticket_id=' +
      Ticket_id +
      '&remarks=' +
      remarks +
      '&Customerid=' +
      Customerid +
      '&TicketStatus=3';

    return this.http.get(url);
  }
  UpdateProfile(data: FormData): Observable<string> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    const httpOptions = {
      headers: headers,
    };
    return this.http.post<string>(
      this.urlprefix + '/Customer/Update_Cusotmer_v2/',
      data,
      httpOptions
    );
  }
  Check_kyc(Customerid: any, countryname: any, flag: any) {
    const url =
      this.urlprefix +
      '/Customer/GetEkyc_status?countryname=' +
      countryname +
      '&Customerid=' +
      Customerid +
      '&flag=' +
      flag;

    return this.http.get(url);
  }
  Check_kyc_id(kycid: any) {
    const url = this.urlprefix + '/Customer/GetEkyc_status_id?kycid=' + kycid;

    return this.http.get(url);
  }
  insert_kyc_user(planeid: any, Customerid: any, countryname: any, flag: any) {
    const url =
      this.urlprefix +
      '/Customer/insert_kyc_user?planeid=' +
      planeid +
      '&Customerid=' +
      Customerid +
      '&countryname=' +
      countryname +
      '&flag=' +
      flag;

    return this.http.get(url);
  }
  GetPromoCode(promoCode: any) {
    const encodedPromoCode = encodeURIComponent(promoCode);
    const url =
      this.urlprefix + 'web/Getpromocode_cart?CouponCode=' + encodedPromoCode;

    return this.http.get(url);
  }

  InsertWebcamfile(data: FormData): Observable<string> {
    return this.http.post<string>(
      this.jsonurlprefix + '/Customer/InsertPassportImage/',
      data
    );
  }

  Insertfileuploadfile(data: FormData): Observable<string> {
    return this.http.post<string>(
      this.jsonurlprefix + 'Customer/InsertfileUpload',
      data
    );
  }

  getAllFaqs() {
    const url = 'assets/faq.json';
    return this.http.get(url);
  }

  // getTopUpsPlansList(countryId: any) {
  //   let url = this.urlprefix + 'api/FreeEsim/Get_Topuplist';
  //   let headers = new HttpHeaders()
  //     .set('key', 'NjA5Zjg5OTAtZWFhZC00MGM4LThhYzgtZmFmYzhjZDFhNjNk')
  //     .set('Access-Control-Allow-Origin', 'http://localhost:4200/')
  //     .set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  //     // res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  //     // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  //     // //.set('countryid', countryId);
  //   headers.append('Content-Type', 'application/json');
  //   return this.http.post(url, { flag: 1 }, { headers: headers });
  // }
  getTopUpsPlansList(flag: any, countryId: any) {
    const url = `${this.urlprefix}/Planfree/Get_Topuplist?flag=${flag} &countryid=${countryId}`;
    return this.http.get(url);
  }

  checkFreeEsimUser(emailId: string, refsite: string) {
    const url = `${this.urlprefix}/Planfree/check_freeSimuser?emailid=${emailId}&refsite=${refsite}`;
    return this.http.get(url);
  }

  freeEsimUserOTPVerify(customerId: string, otp: string) {
    const url = `${this.urlprefix}/Planfree/otpVerify?Customerid=${customerId}&OTPnumber=${otp}`;
    return this.http.get(url);
  }

  verifyOrderId(orderId: string, customerId: string) {
    const url = `${this.urlprefix}/Planfree/Verify_ordid?OrderNumber=${orderId}&Customerid=${customerId}`;
    return this.http.get(url);
  }
  OTPfreVerify(otpnumber: any, cusomerid: any, refsite: any) {
    const url =
      this.urlprefix +
      'Planfree/OtpVerify?OTPnumber=' +
      otpnumber +
      '&Customerid=' +
      cusomerid +
      '&refsite=' +
      refsite;

    return this.http.get(url);
  }

  getPurchasedTopupsDetails(flag: string, customerId: string, planId: string) {
    const url = `${this.urlprefix}/plan/get_purchaseTopUpsDetails?flag=${flag}&Customerid=${customerId}&planeid=${planId}`;
    return this.http.get(url);
  }

  // getCountryDataCMS(countryId: any) {
  //   const url =
  //     this.urlprefix + 'plan/getcountry_cms?flag=1&countryid=' + countryId;
  //   const urlseond = 'assets/JsonData/CMS/' + countryId;
    
  //   return this.http
  //     .get(url)
  //     .pipe(catchError((error) => this.handleErrorAndRetry(error, urlseond)));
  // }
  // getCountryDataCMS(countryId: any): Observable<any> {
  //   const filePath = resolve(`./src/assets/JsonData/CMS/${countryId}.json`);

  //   try {
  //     // Read the file synchronously
  //     const data = fs.readFileSync(filePath, 'utf-8');
  //     const jsonData = JSON.parse(data);

  //     // Return the parsed JSON data as an observable
  //     return of(jsonData);
  //   } catch (error: any) {
  //     console.error(`🚨 Error reading file for countryId ${countryId}:`, error.message);
  //     return of(null); // Return null or handle the error as needed
  //   }
  // }
  getCountryDataCMS(countryId: any): Observable<any> {
    const url = `./assets/JsonData/CMS/${countryId}.json`;
    return this.http.get(url).pipe(
      catchError((error) => {
        console.error(`🚨 Error fetching data for countryId ${countryId}:`, error.message);
        return of(null); // Handle errors gracefully
      })
    );
  }

  getMonthlyCartData(customerId: any) {
    const url =
      this.urlprefix + 'Cart/Get_CartData_monthly?Customerid=' + customerId;
    return this.http.get(url);
  }

  // Set a cookie
  setCookie(name: string, value: string, days: number): void {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`;
  }

  // Get a cookie by name
  getCookie(name: string): string {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find((row) => row.startsWith(`${name}=`));
    return cookie ? cookie.split('=')[1] : '';
  }

  // Delete a cookie by name
  deleteCookie(name: string): void {
    this.setCookie(name, '', -1);
  }
}
