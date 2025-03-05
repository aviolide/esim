import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-esim-country-content',
  standalone: true,
  imports: [CommonModule],
  providers: [ApiService],
  templateUrl: './esim-country-content.component.html',
  styleUrl: './esim-country-content.component.css',
})
export class EsimCountryContentComponent implements OnInit {
  constructor(private apiService: ApiService, private route: ActivatedRoute) {}
  countryName!: string;
  content: any;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      let c = params['countryname'];
      let country = c.split('-').join(' ');
      this.countryName = country;
      this.getCountryId();
    });
  }

  getCountryId() {
    this.apiService.getcountrydata().subscribe((data: any) => {
      let country = data && data.find((x: any) => x.CountryName == this.countryName);
      
      if (country !== undefined) {
        this.fetchCountryData(country.countryid);
      }
    });
  }

  fetchCountryData(id: any) {
    this.apiService.getCountryDataCMS(id).subscribe((data: any) => {
      this.content = data[0];
    });
  }
}
