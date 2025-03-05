import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router, RouterModule } from '@angular/router';

import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  providers: [ApiService],
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css'],
})
export class BlogsComponent implements OnInit {
  response: any;
  countblog: number = 0;
  activeButton: string = '1';
  email?: string;

  constructor(
    private apiService: ApiService,
    private titleService: Title,
    @Inject(DOCUMENT) private dom: Document,
    private router: Router,
    private metaService: Meta,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadBlogs();
    this.seo();
    this.updateCanonicalLink();
  }

  seo() {
    this.titleService.setTitle(
      'Blog from ESimExpress App - an exquisite esim experience for travellers'
    );
    this.metaService.updateTag({
      name: 'description',
      content:
        'Read the latest blogs from ESimExpress App and stay updated with the latest news, trends, and information about eSIM technology, travel, and more.',
    });
    this.metaService.updateTag({
      name: 'keywords',
      content:
        'ESimExpress App blog, eSIM technology, travel blog, eSIM news, eSIM trends, eSIM information, eSIM blog, ESimExpress App news',
    });
  }

  updateCanonicalLink(): void {
    const head = this.dom.getElementsByTagName('head')[0];
    var element: HTMLLinkElement | null = this.dom.querySelector(
      `link[rel='canonical']`
    );
    if (element == null) {
      element = this.dom.createElement('link') as HTMLLinkElement;
      head.appendChild(element);
    }
    element.setAttribute('rel', 'canonical');
    element.setAttribute('href', 'https://www.esim.su/blogs');
  }

  private loadBlogs(): void {
    let blogCategoryName = 'All';
    let blogFlag = '1';
    if (isPlatformBrowser(this.platformId)) {
      blogCategoryName = localStorage.getItem('blogcategoryname') ?? 'All';
      blogFlag = localStorage.getItem('blogflag') ?? '1';
    }

    this.activeButton = blogFlag;

    this.apiService
      .get_blog(blogCategoryName, blogFlag)
      .subscribe((data: any) => {
        this.response = data;
        this.countblog = data.length;
        let imageUrl = 'https://bloglogin.esim.su/data/' + data[0].ImgPath;
        this.updateMetaTags(
          "World's Largest eSIM Marketplace | ESimExpress Blog",
          'We give you all the information you need about eSIMs, the new international data SIM card for internet on your travels.',
          'https://www.esim.su/blogs',  
          imageUrl,
          'ESimExpress App Blog'
        );
      });
  }

  setActive(buttonName: string, categoryName: string): void {
    this.activeButton = buttonName;

    this.apiService.get_blog(categoryName, '1').subscribe((data: any) => {
      this.response = data;
      this.countblog = data.length;
    });
  }

  isActive(buttonName: string): boolean {
    return this.activeButton === buttonName;
  }

  updateMetaTags(
    title: string,
    description: string,
    url: string,
    image: string,
    imageAlt: string
  ): void {
    this.metaService.updateTag({
      property: 'og:title',
      content: title,
    });
    this.metaService.updateTag({
      property: 'og:description',
      content: description,
    });
    this.metaService.updateTag({
      property: 'og:image',
      content: image,
    });
    this.metaService.updateTag({
      property: 'og:url',
      content: url,
    });
    this.metaService.updateTag({
      property: 'og:image:alt',
      content: 'ESimExpress App Blog',
    });
    this.metaService.updateTag({
      property: 'og:type',
      content: 'Blog',
    });
  }
}
