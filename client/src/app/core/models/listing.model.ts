export interface Listing {
  id: string;
  mlsNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  listPrice: number;
  status: ListingStatus;
  offerDeadline: Date | null;
  offersReceived: number;
  daysOnMarket: number;
  sellerName: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  propertyType: 'single_family' | 'condo' | 'townhouse' | 'multi_family';
  yearBuilt: number;
  listingExpiration: Date;
  notes: string | null;
  publicLink: string;
}

export interface ListingStatus {
  id: number;
  label: string;
}
