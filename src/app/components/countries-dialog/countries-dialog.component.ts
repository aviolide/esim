import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-countries-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './countries-dialog.component.html',
  styleUrl: './countries-dialog.component.css'
})
export class CountriesDialogComponent implements OnInit {
  filteredCountries: any[] = [];
  searchQuery: string = '';
  private searchTerms = new Subject<string>();

  countries = [
    { id: 1, name: 'Albania' },
    { id: 2, name: 'Algeria' },
    { id: 3, name: 'Andorra' },
    { id: 4, name: 'Armenia' },
    { id: 5, name: 'Austria' },
    { id: 6, name: 'Australia' },
    { id: 7, name: 'Azerbaijan' },
    { id: 8, name: 'Bosnia and Herzegovina' },
    { id: 192, name: 'Brazil' },
    { id: 10, name: 'Belarus' },
    { id: 11, name: 'Belgium' },
    { id: 12, name: 'Bulgaria' },
    { id: 13, name: 'Canada' },
    { id: 14, name: 'China' },
    { id: 15, name: 'Croatia' },
  
    { id: 16, name: 'Cyprus' },
    { id: 17, name: 'Czech Republic' },
    { id: 18, name: 'Denmark' },
    { id: 19, name: 'Estonia' },
    
    { id: 21, name: 'Egypt' },
    { id: 20, name: 'Faroe Islands' },
    { id: 22, name: 'Finland' },
    { id: 23, name: 'France' },
    { id: 24, name: 'French Guiana' },
    { id: 25, name: 'Georgia' },
    { id: 26, name: 'Ghana' },
    { id: 27, name: 'Gibraltar' },
    { id: 28, name: 'Germany' },
    { id: 29, name: 'Greece' },
    { id: 30, name: 'Hungary' },
    { id: 31, name: 'Hong Kong' },
    { id: 32, name: 'Iceland' },
    { id: 33, name: 'Ireland' },
    { id: 34, name: 'India' },
    { id: 35, name: 'Italy' },
    { id: 36, name: 'Israel' },
    
    
    { id: 37, name: 'Kazakhstan' },
    { id: 38, name: 'Kuwait' },
    { id: 39, name: 'Kyrgyzstan' },
    { id: 40, name: 'Kenya' },
    { id: 41, name: 'Kosovo' },
    { id: 42, name: 'Latvia' },
    { id: 43, name: 'Lesotho' },
    { id: 44, name: 'Liechtenstein' },
    { id: 45, name: 'Lithuania' },
    { id: 46, name: 'Luxembourg' },
    { id: 47, name: 'Macedonia' },
    { id: 48, name: 'Malta' },
    { id: 49, name: 'Moldova' },
    { id: 50, name: 'Malaysia' },
    { id: 51, name: 'Monaco' },
    { id: 52, name: 'Montenegro' },
    { id: 53, name: 'Morocco' },
    { id: 54, name: 'Nigeria' },
    { id: 55, name: 'Netherlands' },
    { id: 56, name: 'New Zealand' },
    { id: 57, name: 'Norway' },
    { id: 58, name: 'Poland' },
    { id: 59, name: 'Portugal' },
    { id: 60, name: 'Pakistan' },
    { id: 61, name: 'Qatar' },
    { id: 62, name: 'Romania' },
    { id: 63, name: 'Reunion' },
    { id: 64, name: 'Russian Federation' },
    { id: 65, name: 'South Korea' },
    { id: 66, name: 'Serbia' },
   
    { id: 67, name: 'Slovakia' },
    { id: 68, name: 'Slovenia' },
    { id: 69, name: 'Singapore' },
    { id: 70, name: 'Spain' },
    { id: 71, name: 'Sri Lanka' },
   
    { id: 72, name: 'Sweden' },
    { id: 73, name: 'Switzerland' },
    { id: 74, name: 'Taiwan' },
    { id: 75, name: 'Thailand' },
    { id: 76, name: 'Tunisia' },
    { id: 77, name: 'Tanzania' },
    { id: 78, name: 'Turkey' },
    { id: 79, name: 'Ukraine' },
    { id: 80, name: 'United Kingdom' },
    { id: 81, name: 'United States' },
    { id: 82, name: 'Uzbekistan' },
    { id: 83, name: 'United Arab Emirates' },
  ];

  constructor() { 
    this.filteredCountries = this.countries.map(country => country);
  }

  ngOnInit(): void {
    this.searchTerms
    .subscribe(() => {
      this.filterCountries();
    });
  }

  filterCountries(): void {
    
    if (this.searchQuery.trim() === '') {
      this.filteredCountries = this.countries.map(country => country);
    } else {
      this.filteredCountries = this.countries.filter(country =>
        country.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }
  
  onSearchChange(): void {
    this.filterCountries();
  }
  

}
