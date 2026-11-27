// ⚠️ ДЕМО-ДАННЫЕ. Это не реальные станции EnerGo, а примеры для вёрстки карточек.
// В продакшене заменить на API станций (статус, коннекторы, мощность, цена, координаты).
export type DemoStation = {
  id: string;
  name: string;
  cityIndex: number; // индекс в dictionary.stations.cities
  address: string;
  free: number;
  total: number;
  connectors: string[];
  pricePerKwh: number;
  lat: number;
  lng: number;
};

export const demoStations: DemoStation[] = [
  { id: "d1", name: "EnerGo Demo 01", cityIndex: 0, address: "Demo: Tashkent, Yunusobod", free: 2, total: 2, connectors: ["GB/T", "CCS2"], pricePerKwh: 1800, lat: 41.364, lng: 69.288 },
  { id: "d2", name: "EnerGo Demo 02", cityIndex: 0, address: "Demo: Tashkent, Chilonzor", free: 1, total: 4, connectors: ["GB/T"], pricePerKwh: 2000, lat: 41.285, lng: 69.204 },
  { id: "d3", name: "EnerGo Demo 03", cityIndex: 0, address: "Demo: Tashkent, Mirzo Ulug‘bek", free: 0, total: 2, connectors: ["GB/T", "Type 2"], pricePerKwh: 2000, lat: 41.325, lng: 69.335 },
  { id: "d4", name: "EnerGo Demo 04", cityIndex: 1, address: "Demo: Samarkand, centre", free: 2, total: 2, connectors: ["GB/T"], pricePerKwh: 1800, lat: 39.654, lng: 66.959 },
  { id: "d5", name: "EnerGo Demo 05", cityIndex: 2, address: "Demo: Fergana, centre", free: 1, total: 2, connectors: ["GB/T", "CCS2"], pricePerKwh: 1800, lat: 40.384, lng: 71.786 },
  { id: "d6", name: "EnerGo Demo 06", cityIndex: 7, address: "Demo: Bukhara, centre", free: 2, total: 4, connectors: ["GB/T"], pricePerKwh: 2000, lat: 39.767, lng: 64.423 },
];
