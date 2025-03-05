import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-error-404',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './error-404.component.html',
  styleUrl: './error-404.component.css',
})
export class Error404Component {
  constructor(private metaService: Meta, private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('404 Page Not Found | ESimExpress');

    this.metaService.updateTag({
      name: 'description',
      content:
        'The page you are looking for is not found. Please check the URL or go back to the homepage.',
    });
    this.metaService.updateTag({
      name: 'keywords',
      content: '404, page not found, error 404, not found, page not found error',
    });
    this.metaService.updateTag({
      property: 'og:title',
      content: '404 Page Not Found | ESimExpress',
    });

    this.metaService.updateTag({
      property: 'og:description',
      content:
        'The page you are looking for is not found. Please check the URL or go back to the homepage.',
    });

  }
}
