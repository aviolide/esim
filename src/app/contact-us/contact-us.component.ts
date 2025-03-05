import { Component, Inject, PLATFORM_ID } from '@angular/core';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ApiService } from '../service/api.service';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  providers: [ApiService],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css'],
})
export class ContactUsComponent {
  registerForm: FormGroup | UntypedFormGroup | any;
  submitted = false;
  response: any = [];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private dbService: ApiService,
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private dom: Document,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  get f() {
    return this.registerForm?.controls || {};
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: [''],
      phone: ['', Validators.required],
      subject: ['', Validators.required],
      iccid: [''],
      comment: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.titleService.setTitle('Contact Us | ESimExpress');
    this.metaService.updateTag({
      name: 'description',
      content:
        'Get in touch with ESimExpress for support, inquiries, or partnerships. Reach out to our team for assistance with eSIM solutions and other services.',
    });
    this.metaService.updateTag({
      name: 'keywords',
      content:
        'Contact ESimExpress, eSIM support, ESimExpress inquiries, customer service, partnership with ESimExpress, eSIM contact, ESimExpress help, ESimExpress services',
    });

    this.metaService.updateTag({
      property: 'og:title',
      content: 'Contact Us | ESimExpress',
    });

    this.metaService.updateTag({
      property: 'og:description',
      content:
        'Get in touch with ESimExpress for support, inquiries, or partnerships. Reach out to our team for assistance with eSIM solutions and other services.',
    });

    this.metaService.updateTag({
      property: 'og:url',
      content: 'https://www.esim.su/info/contactus',
    });
    this.updateCanonicalLink();
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
    element.setAttribute('href', 'https://www.esim.su/info/contactus');
  }

  onSubmit() {
    this.submitted = true;
    const { firstName, lastName, email, phone, iccid, subject, comment } =
      this.registerForm?.value || {};

    if (this.registerForm?.invalid) {
      return;
    } else {
      const checkbox = isPlatformBrowser(this.platformId)
        ? (document.getElementById('agreement') as HTMLInputElement | null)
        : null;

      if (checkbox?.checked) {
        this.dbService
          .SaveContactus_Inquiry(
            firstName,
            lastName,
            email,
            phone,
            iccid,
            subject,
            comment
          )
          .subscribe({
            next: (data) => {
              alert('Form Submitted successfully');
            },
          });
      } else {
        alert('Please accept Terms & Conditions');
      }
    }
  }
}
