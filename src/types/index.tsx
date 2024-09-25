export type TData = {
  id: number;
  ip: string;
  location: string;
  timezone: string;
  isp: string;
};

export type TLocationInfo = {
  ip: string;
  location: string;
  utc: string;
  isp: string;
};

export type TContext = {
  info: TLocationInfo | undefined;
  image: number | undefined;
  changeInfo: (newInfo: TLocationInfo) => void;
  changeImage: (newImage: number) => void;
};

export type ErrorCustom = {errorMessage: string};

export interface ProductDataRequest {
  name: string;
  data: {
    year: number;
    price: number;
    'CPU model': string;
    'Hard disk size': string;
  };
}
export interface ProductAddResponse {
  id: string;
  name: string;
  data: ProductData | null;
  createdAt: string; // ISO 8601 date string
}
export interface Product {
  id: string;
  name: string;
  data: ProductData | null;
}

export type ProductData =
  | ColorCapacityData
  | PriceColorData
  | PriceData
  | GenerationPriceData
  | YearPriceCpuDiskData
  | StrapCaseData
  | ColorDescriptionData
  | CapacityScreenSizeData
  | GenerationPriceCapacityData;

// Define specific interfaces for different types of data
interface ColorCapacityData {
  color: string;
  capacity: string;
}

interface PriceColorData {
  price: number;
  color: string;
}

interface PriceData {
  price: number;
}

interface GenerationPriceData {
  generation: string;
  price: number;
}

interface YearPriceCpuDiskData {
  year: number;
  price: number;
  CPU_model: string;
  Hard_disk_size: string;
}

interface StrapCaseData {
  Strap_Colour: string;
  Case_Size: string;
}

interface ColorDescriptionData {
  Color: string;
  Description: string;
}

interface CapacityScreenSizeData {
  Capacity: string;
  Screen_size: number;
}

interface GenerationPriceCapacityData {
  Generation: string;
  Price: string;
  Capacity: string;
}
