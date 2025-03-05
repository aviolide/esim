import { Component } from '@angular/core';
import { ApiService } from '../service/api.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-faqs',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  providers: [ApiService],
  templateUrl: './search-faqs.component.html',
  styleUrl: './search-faqs.component.css',
})
export class SearchFaqsComponent {
  searchText: string = '';
  searchResults: any[] = [];
  faqs: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getAllFaqsList();
  }

  search() {
    this.searchResults = [];
    if (this.searchText.trim() !== '') {
      this.searchResults = this.faqs.filter((item) =>
        item.qns.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }

  getAllFaqsList() {
    this.apiService.getAllFaqs().subscribe((res: any) => {
      let data = res.data;
      this.faqs = data.filter((item: any) => {
        return item.category == 'Faq';
      });
    });
  }
}
