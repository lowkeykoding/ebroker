import {Component, EventEmitter, Output, ViewChild, inject, signal, output, input} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {ListingStatus} from '../../../../../core/models/listing.model';

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
  imports: [ReactiveFormsModule],
  templateUrl: 'create-listing-sheet.component.html',
})
export class CreateListingSheetComponent {
  listingStatuses = input.required<ListingStatus[]>();
  listingCreated = output<CreateListingFormValue>();

  open(): void {
  }

  onCancel(): void {
  }

  onSubmit(): void {
  }
}
