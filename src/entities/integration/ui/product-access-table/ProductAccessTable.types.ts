export interface ProductAccessMap {
  [productId: string]: { writeData: boolean; readResults: boolean };
}
