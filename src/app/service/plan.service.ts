import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  constructor() {}

  isMonthlyPlan(id: Number): boolean {
    if (['3', '4', '5', '6'].includes(id.toString())) {
      return true;
    }
    return false;
  }
}
