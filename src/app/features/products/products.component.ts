import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Product } from '../../core/models/product.model';
import { ProductsService } from '../../core/services/products.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {
  private readonly service = inject(ProductsService);
  private readonly fb = inject(FormBuilder);

  columns:string[]=[];
  displayColumns:string[]=[];
  products:any = signal([]);
  loading = false;
  showForm = false;
  errorMessage = '';
  form: FormGroup;
  
  constructor() {

    this.form = this.fb.group({
    name: ['', Validators.required],
    sku: ['', Validators.required],
    categoryId: ['', Validators.required],
    category: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    status: ['available', Validators.required],
    available: [true, Validators.required]
  });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.form.reset();
    }
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';
    this.service.getAll().subscribe({
      next: (data:any) => {
        this.columns = Object.keys(data.data[0] || {});

        this.columns = this.columns.filter(e=> e != "_id" &&  e != "__v")
        this.displayColumns = this.columns.map(el => el.charAt(0).toUpperCase()+ el.slice(1))
        this.products.set(data.data);
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load products.';
        this.loading = false;
      }
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.service.create(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading = false;
        this.showForm = false;
        this.form.reset();
        this.loadProducts();
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Unable to create product.';
      }
    });
  }

  deleteProduct(id: string): void {
    this.loading = true;
    this.service.remove(id).subscribe({
      next: () => {
        this.loading = false;
        this.loadProducts();
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Unable to delete product.';
      }
    });
  }


  downloadTemplate(): void {
    this.service.downloadTemplate().subscribe({
      next: (blob: Blob) => {
 
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download =  `product_template_${Date.now()}.xlsx`;
         document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.errorMessage = 'Unable to download template.';
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file && file.size > 0) {
        const formData = new FormData();
        formData.append('file', file);
        this.uploadProducts(formData);
    }
  }

  uploadProducts(formData: FormData): void {
    this.service.uploadProducts(formData).subscribe({
      next: () => {
        console.log('Products uploaded successfully');
        this.loadProducts();
      },
      error: () => {
        this.errorMessage = 'Unable to upload products.';
      }
    }); 
  }


}
