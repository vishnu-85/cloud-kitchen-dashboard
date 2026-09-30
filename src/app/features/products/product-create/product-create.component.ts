import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormArray, FormBuilder, FormControl, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Category } from '../../../core/models/category.model';
import { Product, ProductCreatePayload } from '../../../core/models/product.model';
import { CategoriesService } from '../../../core/services/categories.service';
import { ProductsService } from '../../../core/services/products.service';

const discountPriceValidator: ValidatorFn = (control: AbstractControl) => {
  const price = control.get('price')?.value;
  const discountPrice = control.get('discountPrice')?.value;

  return typeof price === 'number' && typeof discountPrice === 'number' && discountPrice > price
    ? { discountPriceExceedsPrice: true }
    : null;
};

@Component({
  selector: 'app-product-create',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.css'
})
export class ProductCreateComponent implements OnInit {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly destroyRef = inject(DestroyRef);
  private readonly categoriesService = inject(CategoriesService);
  private readonly productsService = inject(ProductsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly productId = signal<string | null>(null);
  readonly categories = signal<Category[]>([]);
  readonly isLoadingCategories = signal(false);
  readonly isLoadingProduct = signal(false);
  readonly isSaving = signal(false);
  readonly categoryError = signal('');
  readonly errorMessage = signal('');
  private slugManuallyEdited = false;

  readonly form = this.fb.group({
    categoryId: ['', Validators.required],
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    slug: ['', [
      Validators.required,
      Validators.maxLength(120),
      Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    ]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
    price: [0, [Validators.required, Validators.min(0)]],
    discountPrice: this.fb.control<number | null>(null, Validators.min(0)),
    image: [''],
    images: this.fb.array<string>([]),
    foodType: this.fb.control<'veg' | 'non-veg'>('veg'),
    isSpicy: [false],
    spiceLevel: this.fb.control<'mild' | 'medium' | 'hot'>('mild'),
    preparationTime: [1, [Validators.required, Validators.min(1)]],
    isAvailable: [true],
    isFeatured: [false],
    isBestseller: [false],
    stock: [0, [Validators.required, Validators.min(0)]]
  }, { validators: discountPriceValidator });

  get imagePaths(): FormArray<FormControl<string>> {
    return this.form.controls.images;
  }

  ngOnInit(): void {
    this.form.controls.name.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((name) => {
        if (!this.slugManuallyEdited) {
          this.form.controls.slug.setValue(this.createSlug(name), { emitEvent: false });
        }
      });

    this.form.controls.slug.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.form.controls.slug.dirty) {
          this.slugManuallyEdited = true;
        }
      });

    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const id = params.get('id');
        this.productId.set(id);
        if (id) {
          const navigationProduct = this.router.getCurrentNavigation()?.extras.state?.['product'] as Product | undefined;
          const historyProduct = (history.state as { product?: Product }).product;
          const product = navigationProduct ?? historyProduct;
          if (product?._id === id) {
            this.populateForm(product);
          } else {
            this.loadProduct(id);
          }
        }
      });

    this.loadCategories();
  }

  addImagePath(): void {
    this.imagePaths.push(this.fb.control(''));
  }

  removeImagePath(index: number): void {
    this.imagePaths.removeAt(index);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue();
    const payload: ProductCreatePayload = {
      ...values,
      discountPrice: values.discountPrice ?? 0,
      image: values.image.trim(),
      images: values.images.map((path) => path.trim()).filter(Boolean)
    };

    this.isSaving.set(true);
    this.errorMessage.set('');
    const productId = this.productId();
    const request = productId
      ? this.productsService.update(productId, payload)
      : this.productsService.create(payload);

    request.subscribe({
      next: () => {
        this.isSaving.set(false);
        void this.router.navigate(['/admin/products']);
      },
      error: () => {
        this.isSaving.set(false);
        this.errorMessage.set(`Unable to ${productId ? 'update' : 'create'} product. Please try again.`);
      }
    });
  }

  private loadProduct(id: string): void {
    this.isLoadingProduct.set(true);
    this.productsService.getAll().subscribe({
      next: (response) => {
        const envelope = response as unknown as { data?: Product[] };
        const products = envelope.data ?? response;
        const product = products.find((item) => item._id === id);
        this.isLoadingProduct.set(false);
        if (product) {
          this.populateForm(product);
        } else {
          this.errorMessage.set('Product not found. Return to the products list and try again.');
        }
      },
      error: () => {
        this.isLoadingProduct.set(false);
        this.errorMessage.set('Unable to load this product. Please return to the products list and try again.');
      }
    });
  }

  private populateForm(product: Product): void {
    this.slugManuallyEdited = true;
    this.imagePaths.clear();
    for (const image of product.images ?? []) {
      this.imagePaths.push(this.fb.control(image));
    }

    this.form.patchValue({
      categoryId: typeof product.categoryId === 'string' ? product.categoryId : product.categoryId?._id ?? '',
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice ?? null,
      image: product.image ?? '',
      foodType: product.foodType,
      isSpicy: product.isSpicy,
      spiceLevel: product.spiceLevel,
      preparationTime: product.preparationTime,
      isAvailable: product.isAvailable,
      isFeatured: product.isFeatured,
      isBestseller: product.isBestseller,
      stock: product.stock
    });
    this.form.markAsPristine();
  }

  private loadCategories(): void {
    this.isLoadingCategories.set(true);
    this.categoryError.set('');
    this.categoriesService.getAll().subscribe({
      next: (response) => {
        const envelope = response as unknown as { data?: Category[] };
        this.categories.set(envelope.data ?? response);
        this.isLoadingCategories.set(false);
      },
      error: () => {
        this.categoryError.set('Unable to load categories. Refresh the page to try again.');
        this.isLoadingCategories.set(false);
      }
    });
  }

  private createSlug(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
}