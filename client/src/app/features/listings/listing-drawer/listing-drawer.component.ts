import { Component, computed, signal, input, output } from '@angular/core';
import { form, required, email, submit, FormRoot, FormField } from '@angular/forms/signals';
import {UpsertListingModel, ListingStatusModel, PropertyTypeModel} from '../../../core/models/listing.model';
import { FileUploadComponent, UploadedFile } from '../../../shared/components/file-upload/file-upload.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { FormSelectComponent, SelectOption } from '../../../shared/components/form-select/form-select.component';

const INITIAL_MODEL: UpsertListingModel = {
  id: null,
  address: '',
  city: '',
  state: '',
  zipCode: '',
  propertyType: 1,
  yearBuilt: null,
  bedrooms: null,
  bathrooms: null,
  squareFootage: null,
  propertyImages: [],
  mlsNumber: '',
  listPrice: null,
  status: null,
  offerDeadline: null,
  listingExpiration: null,
  sellerFirstName: '',
  sellerLastName: '',
  sellerEmail: '',
  sellerPhone: '',
  notes: '',
  documents: [],
};

@Component({
  selector: 'app-listing-drawer',
  standalone: true,
  imports: [FileUploadComponent, FormFieldComponent, FormSelectComponent, FormRoot, FormField],
  templateUrl: 'listing-drawer.component.html',
})
export class ListingDrawerComponent {
  listingStatuses = input.required<ListingStatusModel[]>();
  propertyTypes = input.required<PropertyTypeModel[]>();
  listingSaved = output<UpsertListingModel>();

  private readonly model = signal<UpsertListingModel>(INITIAL_MODEL);
  private propertyImages = signal<File[]>([]);
  private documents = signal<File[]>([]);

  readonly listingForm = form(this.model, (p) => {
    required(p.address);
    required(p.city);
    required(p.state);
    required(p.zipCode);
    required(p.propertyType);
    required(p.yearBuilt);
    required(p.bedrooms);
    required(p.bathrooms);
    required(p.squareFootage);
    required(p.mlsNumber);
    required(p.listPrice);
    required(p.status);
    required(p.sellerFirstName);
    required(p.sellerLastName);
    required(p.sellerEmail);
    email(p.sellerEmail);
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

  onPropertyImagesChanged(files: UploadedFile[]): void {
    this.propertyImages.set(files.map(f => f.file));
  }

  onDocumentsChanged(files: UploadedFile[]): void {
    this.documents.set(files.map(f => f.file));
  }

  async onSave(): Promise<void> {
    await submit(this.listingForm, async (field) => {
      const raw = field().value();
      this.listingSaved.emit({
        ...raw,
        yearBuilt: Number(raw.yearBuilt),
        bedrooms: Number(raw.bedrooms),
        bathrooms: Number(raw.bathrooms),
        squareFootage: Number(raw.squareFootage),
        listPrice: Number(raw.listPrice),
        status: Number(raw.status),
        offerDeadline: raw.offerDeadline ? new Date(raw.offerDeadline).toISOString() : null,
        listingExpiration: raw.listingExpiration ? new Date(raw.listingExpiration).toISOString() : null,
        propertyImages: this.propertyImages(),
        documents: this.documents(),
      });
      return null;
    });
  }

  onCancel(): void {
    this.model.set({ ...INITIAL_MODEL });
  }
}
