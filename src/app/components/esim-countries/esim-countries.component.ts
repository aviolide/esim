import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-esim-countries',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './esim-countries.component.html',
  styleUrl: './esim-countries.component.css',
  providers: [ApiService],
})
export class EsimCountriesComponent implements OnInit {
  selectedtab = 'one';
  countries: any = [];
  countrylist = false;
  itemsToShow = 12;
  itemsPerPage = 6;
  regionaldata: any = [];
  showAll = false;
  @ViewChild('esimTabs') esimTabs!: ElementRef;

  isMonthlyPlansTabs = false;

  monthlyPlans = [
    {
      countryid: 1,
      CountryName: 'USA',
      flagName: 'flag USA',
      countryimage: '/assets/images/countrybanner/USA.png',
      OrderBy: 2,
      flagimage: '/assets/images/countryflag/USA.png',
      flag: 'USA',
      MinSalePrice: '5',
      countryNameandAlias: 'USA, America, United States',
    },

    {
      countryid: 28,
      CountryName: 'UK',
      flagName: 'flag UK',
      countryimage: '/assets/images/countrybanner/UK.png',
      OrderBy: 5,
      flagimage: '/assets/images/countryflag/UK.png',
      countryNameandAlias: 'UK, United Kingdom, England',
      flag: 'UK',
      MinSalePrice: '6',
    },
    {
      countryid: 13,
      CountryName: 'Canada',
      flagName: 'flag Canada',
      countryimage: '/assets/images/countrybanner/Canada.png',
      OrderBy: 14,
      flagimage: '/assets/images/countryflag/Canada.png',
      countryNameandAlias: 'Canada',
      flag: 'Canada',
      MinSalePrice: '7.5',
    },

    {
      countryid: 6,
      CountryName: 'Australia',
      countryimage: '/assets/images/Australia.png',
      flagName: 'flag Australia',
      region: '4',
      regionflag: '/assets/images/countryflag/Australia.png',
      flag: 'Australia',
      MinSalePrice: '38',
    },
    {
      countryid: 98,
      CountryName: 'Ireland',
      flagName: 'flag Ireland',
      countryimage: '/assets/images/countrybanner/Ireland.png',
      OrderBy: '42',
      flagimage: '/assets/images/countryflag/Ireland.png',
      flag: 'Ireland',
      MinSalePrice: '9',
    },
    {
      CountryName: 'Spain',
      flagName: 'flag Spain',
      countryid: '162',
      countryimage: '/assets/images/countrybanner/Spain.png',

      OrderBy: '16',
      flagimage: '/assets/images/countryflag/Spain.png',
      flag: 'Spain',

      MinSalePrice: '4.5',
    },
    {
      countryid: 4,
      CountryName: 'Europe',
      countryimage: '/assets/images/Europe.png',
      flagName: 'flag Europe',
      region: '4',
      regionflag: '/assets/images/SevenContinents/Europe.png',
      flag: 'Europe',
      MinSalePrice: '11',
    },
  ];

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchCountryData();
    this.fetchRegionalData();
  }

  goToEsimPage(country: any) {
    let route;

    if (country.CountryName === null) {
      window.localStorage.setItem('regionId', country.regionid);
      route = country.regionName.replace(/ /g, '-');
    } else {
      window.localStorage.setItem('countryId', country.countryid);
      route = country.CountryName.replace(/ /g, '-');
    }
    this.router.navigateByUrl('/esim/' + route);
  }

  tabclick(type: any) {
    this.selectedtab = type;
    if (type == 'three') {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('activeTab', 'Monthly');
      }
    }
  }

  fetchCountryData() {
    this.apiService.getcountrydata().subscribe((data) => {
      if (Array.isArray(data)) {
        this.countries = data.map((country) => ({
          ...country,
          flag: this.extractImageName(country.flagimage),
        }));
      } else {
        this.countries = [];
      }

      this.countrylist = true;
      this.loadMoreItems();
    });
  }

  fetchRegionalData() {
    this.apiService.getregionaldata().subscribe((data) => {
      this.regionaldata = data;
    });
  }

  extractImageName(imagePath: any) {
    if (imagePath) {
      const pathArray = imagePath.split('/');
      const imageNameWithExtension = pathArray[pathArray.length - 1]; // "Thailand.png"
      const imageName = imageNameWithExtension.split('.')[0]; // "Thailand"
      return imageName;
    }
    return null;
  }

  loadMoreItems() {
    if (!this.showAll) {
      this.itemsToShow += 6;    // Increase by 18
      // If we have shown at least 30 items, show the "Show All" button next
      if (this.itemsToShow >= 30) {
        this.showAll = true;
      }
    } else {
      // Show all countries
      this.itemsToShow = this.countries.length;
    }
  }


  monthlyPlansTab() {
    window.localStorage.setItem('activeTab', 'Monthly');
  }

  handleMonthlyTab() {
    this.selectedtab = 'three';

    this.esimTabs.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}
