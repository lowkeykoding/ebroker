import { Component, computed, inject, signal, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ListingStatus, PropertyType } from '../../../../../core/models/listing.model';
import { FileUploadComponent, UploadedFile } from '../../../../../shared/components/file-upload/file-upload.component';
import { FormFieldComponent } from '../../../../../shared/components/form-field/form-field.component';
import { FormSelectComponent, SelectOption } from '../../../../../shared/components/form-select/form-select.component';

export interface CreateListingFormValue {
  // Property details
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  yearBuilt: number;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  propertyImages: File[]

  // Listing Details
  mlsNumber: string;
  listPrice: number;
  status: number;
  offerDeadline: Date | undefined;
  listingExpiration: Date | undefined;

  // Seller Information
  sellerFirstName: string;
  sellerLastName: string;
  sellerEmail: string;
  sellerPhone: string;

  // Notes
  notes: string;

  // Documents
  documents: File[];
}

@Component({
  selector: 'app-create-listing-sheet',
  standalone: true,
  imports: [ReactiveFormsModule, FileUploadComponent, FormFieldComponent, FormSelectComponent],
  templateUrl: 'create-listing-sheet.component.html',
})
export class CreateListingSheetComponent {
  listingStatuses = input.required<ListingStatus[]>();
  propertyTypes = input.required<PropertyType[]>();
  listingCreated = output<CreateListingFormValue>();

  private fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    // Property Details
    address: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zipCode: ['', Validators.required],
    propertyType: ['single_family', Validators.required],
    yearBuilt: [null as unknown as number, Validators.required],
    bedrooms: [null as unknown as number, Validators.required],
    bathrooms: [null as unknown as number, Validators.required],
    squareFootage: [null as unknown as number, Validators.required],

    // Listing Details
    mlsNumber: ['', Validators.required],
    listPrice: [null as unknown as number, Validators.required],
    status: [null as unknown as number, Validators.required],
    offerDeadline: [null as unknown as string],
    listingExpiration: [null as unknown as string],

    // Seller Information
    sellerFirstName: ['', Validators.required],
    sellerLastName: ['', Validators.required],
    sellerEmail: ['', [Validators.required, Validators.email]],
    sellerPhone: [''],

    // Notes
    notes: [''],
  });

  readonly allowedImageTypes = ['image/png', 'image/jpeg', 'image/webp'];
  readonly allowedDocumentTypes = ['application/pdf'];
  readonly maxImageSizeBytes = 10 * 1024 * 1024;
  readonly maxDocumentSizeBytes = 25 * 1024 * 1024;

  propertyTypeOptions = computed<SelectOption[]>(() =>
    this.propertyTypes().map(t => ({ value: t.id, label: t.label }))
  );

  listingStatusOptions = computed<SelectOption[]>(() =>
    this.listingStatuses().map(s => ({ value: s.id, label: s.label }))
  );

  private propertyImages = signal<File[]>([]);
  private documents = signal<File[]>([]);

  onPropertyImagesChanged(files: UploadedFile[]): void {
    this.propertyImages.set(files.map(f => f.file));
  }

  onDocumentsChanged(files: UploadedFile[]): void {
    this.documents.set(files.map(f => f.file));
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    this.listingCreated.emit({
      ...raw,
      yearBuilt: Number(raw.yearBuilt),
      bedrooms: Number(raw.bedrooms),
      bathrooms: Number(raw.bathrooms),
      squareFootage: Number(raw.squareFootage),
      listPrice: Number(raw.listPrice),
      status: Number(raw.status),
      offerDeadline: raw.offerDeadline ? new Date(raw.offerDeadline) : undefined,
      listingExpiration: raw.listingExpiration ? new Date(raw.listingExpiration) : undefined,
      propertyImages: this.propertyImages(),
      documents: this.documents(),
    });
  }
}
