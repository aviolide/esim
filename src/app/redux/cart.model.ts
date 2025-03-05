export interface CartItem {
  P_id: number;
  sellingcost: number;
  countryname: string;
  planename: string;
  planename1: string;
  operatorname: string;
  dataallowance: string;
  dataallowancetype: string;
  dataallowanceMonthly: string;
  voice_minute: string;
  vaildity: string;
  vailditytype: string;
  plantype: string;
  mincartvalue: number;
  maxcartvalue: number;
  YearlySellingcost: number;
  PriceDiffernece: number;
  DurationType: string;
  DurationSubType: string;
  Kyc_status: number;
  is_promocode: number;
  meta_title: string;
  Currency: string;
  c_r_id: number;
  quantity : number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  isModalOpen: boolean; 
  user : any;
}

export const initialState: CartState = {
  items: [],
  total: 0,
  isModalOpen: false, 
  user: null,
};
