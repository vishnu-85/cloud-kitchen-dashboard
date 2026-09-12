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
}
