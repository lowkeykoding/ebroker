export interface ListingModel {
  id: number;
  mlsNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  listPrice: number;
  status: ListingStatusModel;
  offerDeadline: Date | null;
  offersReceived: number;
  daysOnMarket: number;
  listingExpiration: Date;
  publicLink: string;
}

export interface ListingDetailsModel {
  id: number;
  mlsNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  listPrice: number;
  status: ListingStatusModel;
  offerDeadline: Date | null;
  offersReceived: number;
  daysOnMarket: number;
  listingExpiration: Date;
  sellerName: string,
  sellerEmail: string;
  sellerPhone: string;
  notes: string;
  documents: File[];
  publicLink: string;
}

export interface ListingStatusModel {
  id: number;
  label: string;
}

export interface PropertyTypeModel {
  id: number;
  label: string;
}

export interface UpsertListingModel {
  id: number | null;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: number;
  yearBuilt: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  squareFootage: number | null;
  propertyImages: File[]
  mlsNumber: string;
  listPrice: number | null;
  status: number | null;
  offerDeadline: string | null;
  listingExpiration: string | null;
  sellerFirstName: string;
  sellerLastName: string;
  sellerEmail: string;
  sellerPhone: string;
  notes: string;
  documents: File[];
}
