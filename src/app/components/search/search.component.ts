import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-search',
  standalone: true,
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
  providers: [ApiService],
  imports: [FormsModule, CommonModule, ReactiveFormsModule, HttpClientModule],
})
export class SearchComponent implements OnInit {
  public countries: any = [];
  public regions: any = [];
  public searchData: any = [];
  public filteredSearchData: any = [];
  public userType: string = 'single';

  keyword = 'countryNameandAlias';
  keyword2 = 'regionName';
  monthly_tabs: boolean = false;
  searchQuery: string = '';

  constructor(private dbService: ApiService, private router: Router) {}

  @Output() messageToEmit = new EventEmitter<string>();

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData = () => {
    // Fetch country and region data, then combine into searchData
    this.dbService.getcountrydata().subscribe((data) => {
      this.countries = data;
      this.updateSearchData();
    });

    this.dbService.getregionaldata().subscribe((data) => {
      this.regions = data;
      this.regions.forEach((item: any) => {
        item.CountryName = item.regionName;
        item.countryNameandAlias = item.regionName;
        item.flagimage = item.regionflag;
      });
      this.updateSearchData();
    });
  };

  // Method to update searchData and filteredSearchData
  private updateSearchData() {
    this.searchData = [...this.countries, ...this.regions];
    this.filteredSearchData = [...this.searchData];
  }

  // Method to filter the search results based on user input
  onSearchChange(query: string) {
    this.searchQuery = query.toLowerCase();
    // Filter based on the search query
    this.filteredSearchData = this.searchData.filter(
      (item: any) =>
        item.CountryName?.toLowerCase().includes(this.searchQuery) ||
        item.countryNameandAlias?.toLowerCase().includes(this.searchQuery) ||
        item.regionName?.toLowerCase().includes(this.searchQuery)
    );
  }
  
  selectEvent(item: any) {
    const formattedName = item.CountryName.replace(/ /g, '-');
    this.router.navigateByUrl('/esim/' + formattedName);
  }

  Reg_selectEvent(item: any) {
    const formattedName = item.regionName.replace(/ /g, '-');
    this.router.navigateByUrl('/esim/' + formattedName);
  }

  monthlyplanOpen() {
    this.monthly_tabs = true;
  }
}
