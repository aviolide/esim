import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Title, Meta, DomSanitizer } from '@angular/platform-browser';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  providers: [ApiService],
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css'],
})
export class BlogDetailsComponent implements OnInit {
  slug: string = '';
  response: any;
  blogDetails: any;
  blogContent: any;

  constructor(
    private apiService: ApiService,
    private titleService: Title,
    private metaService: Meta,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    @Inject(DOCUMENT) private dom: Document,

    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.slug = params['slug'];
      this.fetchBlogDetails(this.slug);
      this.fetchRelatedBlogs();
    });
  }

  private fetchBlogDetails(slug: string): void {
    this.apiService.get_blogDeteails(slug).subscribe((data: any) => {
      this.blogDetails = data[0];
      this.processContent(this.blogDetails.PostContent);
      this.updateMetaTags(
        this.blogDetails.Description,
        slug,
        this.blogDetails.Title
      );
      this.updateOGTags();

      console.log('slug', slug);
      // Update robots tags
      if(slug == 'happy-chiness-new-year-esim-offers') {
        this.updateRobotsTags(slug);
      }
    });
  }

  private fetchRelatedBlogs(): void {
    this.apiService.get_blog('All', '2').subscribe((data: any) => {
      this.response = data;
    });
  }

  setCategory(categoryName: string, flag: string): void {
    localStorage.setItem('blogcategoryname', JSON.stringify(categoryName));
    localStorage.setItem('blogflag', JSON.stringify(flag));
    this.router.navigateByUrl('/blogs');
  }

  processContent(content: string | undefined): any {
    if (!content) return '';
    // Remove <p>&nbsp;</p>
    const processedContent = content.replace(/<p>&nbsp;<\/p>/g, '');
    // Return the sanitized HTML
    let c :any = this.sanitizer.bypassSecurityTrustHtml(processedContent);
    this.blogContent = c.changingThisBreaksApplicationSecurity;
  }

  private updateMetaTags(
    description: string,
    slug: string,
    title: string
  ): void {
    this.metaService.updateTag({
      name: 'description',
      content: description,
    });
    this.titleService.setTitle(title);
    this.metaService.updateTag({
      name: 'keywords',
      content:
        'ESimExpress App blog, eSIM technology, travel blog, eSIM news, eSIM trends, eSIM information, eSIM blog, ESimExpress App news',
    });
    this.updateCanonicalLink(slug);
  }

  updateCanonicalLink(slug: string): void {
    const head = this.dom.getElementsByTagName('head')[0];
    var element: HTMLLinkElement | null = this.dom.querySelector(
      `link[rel='canonical']`
    );
    if (element == null) {
      element = this.dom.createElement('link') as HTMLLinkElement;
      head.appendChild(element);
    }
    element.setAttribute('rel', 'canonical');
    element.setAttribute('href', 'https://www.esim.su/blogs/' + slug);

  }


  updateRobotsTags(slug: string): void {
    const head = this.dom.getElementsByTagName('head')[0];
      
      // Update or create meta robots tag
    let metaRobots: HTMLMetaElement | null = this.dom.querySelector(`meta[name='robots']`);
    if (!metaRobots) {
      metaRobots = this.dom.createElement('meta') as HTMLMetaElement;
      metaRobots.setAttribute('name', 'robots');
      head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', 'noindex, nofollow, max-image-preview:large');
  
    // Update or create meta googlebot tag
    let metaGooglebot: HTMLMetaElement | null = this.dom.querySelector(`meta[name='googlebot']`);
    if (!metaGooglebot) {
      metaGooglebot = this.dom.createElement('meta') as HTMLMetaElement;
      metaGooglebot.setAttribute('name', 'googlebot');
      head.appendChild(metaGooglebot);
    }
    metaGooglebot.setAttribute('content', 'noindex, nofollow');
  }
  

  updateOGTags(): void {
    const title = this.blogDetails.Title;
    const description = this.blogDetails.Description;
    const image =
      'https://bloglogin.esim.su/data/' + this.blogDetails.ImgPath;
    const url = 'https://www.esim.su/blogs/' + this.blogDetails.Slug;
    const imageAlt = this.blogDetails.Title;

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
      content: imageAlt,
    });
    this.metaService.updateTag({
      property: 'og:type',
      content: 'article',
    });
    this.metaService.updateTag({
      property: 'og:image:width',
      content: '725',
    });
    this.metaService.updateTag({
      property: 'og:image:height',
      content: '486',
    });

   

  }
}
