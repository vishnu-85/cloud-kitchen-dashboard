import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Category } from '../../core/models/category.model';
import { CategoriesService } from '../../core/services/categories.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {
  private readonly service = inject(CategoriesService);
  private readonly fb = inject(FormBuilder);

  categories: any = signal([]);
  loading = false;
  showForm = false;
  errorMessage = '';

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    slug: ['', Validators.required],
    image: []
  });

  ngOnInit(): void {
    this.loadCategories();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  loadCategories(): void {
    this.loading = true;
    this.errorMessage = '';
    this.service.getAll().subscribe({
      next: (data:any) => {
        this.categories.set(data.data);
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load categories.';
        this.loading = false;
      }
    });
  }

//   onFileSelected(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files.length > 0) {
//       const file = input.files[0];
//       this.form.patchValue({ image: file });
//     }
//   }

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
        this.resetForm();
        this.showForm = false;
        this.loadCategories();
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Unable to create category.';
      }
    });
  }

  deleteCategory(id: string): void {
    this.loading = true;
    this.errorMessage = '';
    this.service.remove(id).subscribe({
      next: () => {
        this.loading = false;
        this.loadCategories();
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Unable to delete category.';
      }
    });
  }

  resetForm(): void {
    this.form.reset({
      name: '',
      description: ''
    });
  }
}
