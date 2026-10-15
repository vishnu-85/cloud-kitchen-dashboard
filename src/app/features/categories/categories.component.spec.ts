import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideIcons } from '@ng-icons/core';
import { heroPencilSquare, heroTrash } from '@ng-icons/heroicons/outline';
import { Observable, of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { Category } from '../../core/models/category.model';
import { CategoriesService } from '../../core/services/categories.service';
import { CategoriesComponent } from './categories.component';

describe('CategoriesComponent', () => {
  const categories: Category[] = [
    {
      _id: 'category-1',
      name: 'Breakfast',
      slug: 'breakfast',
      description: 'Breakfast dishes',
      isActive: true
    }
  ];
  const emptyCategories: Category[] = [];
  const categoriesService = {
    getAll: vi.fn<() => Observable<{ data: Category[] }>>(
      () => of({ data: emptyCategories })
    ),
    create: vi.fn(() => of({})),
    update: vi.fn(() => of({})),
    remove: vi.fn(() => of(undefined))
  };

  let fixture: ComponentFixture<CategoriesComponent>;
  let component: CategoriesComponent;

  beforeEach(async () => {
    vi.clearAllMocks();
    categoriesService.getAll.mockReturnValue(of({ data: emptyCategories }));

    await TestBed.configureTestingModule({
      imports: [CategoriesComponent],
      providers: [
        { provide: CategoriesService, useValue: categoriesService },
        provideIcons({ heroPencilSquare, heroTrash })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component and loads categories on initialization', () => {
    expect(component).toBeTruthy();
    expect(categoriesService.getAll).toHaveBeenCalledOnce();
    expect(component.categories()).toEqual(emptyCategories);
    expect(component.loading).toBe(false);
  });

  it('stores loaded categories and renders their names', () => {
    categoriesService.getAll.mockReturnValue(of({ data: categories }));

    component.loadCategories();
    fixture.detectChanges();

    expect(component.categories()).toEqual(categories);
    expect(fixture.nativeElement.textContent).toContain('Breakfast');
    expect(component.errorMessage).toBe('');
    expect(component.loading).toBe(false);
  });

  it('shows an error when categories cannot be loaded', () => {
    categoriesService.getAll.mockReturnValue(
      throwError(() => new Error('Request failed'))
    );

    component.loadCategories();

    expect(component.errorMessage).toBe('Unable to load categories.');
    expect(component.loading).toBe(false);
  });

  it('opens and closes the form, resetting it when closed', () => {
    component.form.setValue({
      name: 'Breakfast',
      description: 'Breakfast dishes',
      slug: 'breakfast',
      image: ''
    });

    component.toggleForm();
    expect(component.showForm).toBe(true);

    component.toggleForm();
    expect(component.showForm).toBe(false);
    expect(component.form.getRawValue()).toEqual({
      name: '',
      description: '',
      slug: '',
      image: ''
    });
  });

  it('does not submit an invalid form and marks its fields touched', () => {
    component.save();

    expect(categoriesService.create).not.toHaveBeenCalled();
    expect(component.form.controls.name.touched).toBe(true);
    expect(component.loading).toBe(false);
  });

  it('creates a category and reloads the list after success', () => {
    const payload = {
      name: 'Breakfast',
      description: 'Breakfast dishes',
      slug: 'breakfast',
      image: ''
    };
    component.form.setValue(payload);
    vi.clearAllMocks();
    categoriesService.create.mockReturnValue(of({}));
    categoriesService.getAll.mockReturnValue(of({ data: categories }));

    component.save();

    expect(categoriesService.create).toHaveBeenCalledWith(payload);
    expect(categoriesService.getAll).toHaveBeenCalledOnce();
    expect(component.categories()).toEqual(categories);
    expect(component.showForm).toBe(false);
    expect(component.editingCategoryId).toBeNull();
    expect(component.loading).toBe(false);
  });

  it('shows an error when creating a category fails', () => {
    component.form.setValue({
      name: 'Breakfast',
      description: 'Breakfast dishes',
      slug: 'breakfast',
      image: ''
    });
    categoriesService.create.mockReturnValue(
      throwError(() => new Error('Request failed'))
    );

    component.save();

    expect(component.errorMessage).toBe('Unable to create category.');
    expect(component.loading).toBe(false);
  });

  it('fills the form for editing and updates the selected category', () => {
    component.editCategory(categories[0]);

    expect(component.editingCategoryId).toBe('category-1');
    expect(component.showForm).toBe(true);
    expect(component.form.getRawValue()).toEqual({
      name: 'Breakfast',
      description: 'Breakfast dishes',
      slug: 'breakfast',
      image: ''
    });

    vi.clearAllMocks();
    categoriesService.update.mockReturnValue(of({}));
    categoriesService.getAll.mockReturnValue(of({ data: categories }));
    const payload = component.form.getRawValue();
    component.save();

    expect(categoriesService.update).toHaveBeenCalledWith(
      'category-1',
      payload
    );
    expect(categoriesService.getAll).toHaveBeenCalledOnce();
    expect(component.editingCategoryId).toBeNull();
    expect(component.loading).toBe(false);
  });

  it('shows an error when updating a category fails', () => {
    component.editCategory(categories[0]);
    categoriesService.update.mockReturnValue(
      throwError(() => new Error('Request failed'))
    );

    component.save();

    expect(component.errorMessage).toBe('Unable to update category.');
    expect(component.loading).toBe(false);
  });

  it('deletes a category and reloads the list after success', () => {
    categoriesService.remove.mockReturnValue(of(undefined));

    component.deleteCategory('category-1');

    expect(categoriesService.remove).toHaveBeenCalledWith('category-1');
    expect(categoriesService.getAll).toHaveBeenCalledTimes(2);
    expect(component.loading).toBe(false);
  });

  it('shows an error when deleting a category fails', () => {
    categoriesService.remove.mockReturnValue(
      throwError(() => new Error('Request failed'))
    );

    component.deleteCategory('category-1');

    expect(component.errorMessage).toBe('Unable to delete category.');
    expect(component.loading).toBe(false);
  });

  it('updates a category active status and reloads the list', () => {
    const event = { target: { checked: false } };
    categoriesService.update.mockReturnValue(of({}));

    component.updateStatus('category-1', event);

    expect(categoriesService.update).toHaveBeenCalledWith('category-1', {
      isActive: false
    });
    expect(categoriesService.getAll).toHaveBeenCalledTimes(2);
    expect(component.loading).toBe(false);
  });

  it('shows an error when updating the category status fails', () => {
    const event = { target: { checked: false } };
    categoriesService.update.mockReturnValue(
      throwError(() => new Error('Request failed'))
    );

    component.updateStatus('category-1', event);

    expect(component.errorMessage).toBe('Unable to delete category.');
    expect(component.loading).toBe(false);
  });
});
