// Пакеты EnerGo Club из драфта команды (Frame.png, 16.11.2026).
// ⚠️ Не проверено: сверить цены, сроки и названия с приложением/биллингом перед запуском.
export type ClubPlan = { id: string; name: string; kwh: number; days: number; pricePerKwh: number; promo?: boolean };

export const clubPlans: ClubPlan[] = [
  { id: "start", name: "Start", kwh: 100, days: 30, pricePerKwh: 1750 },
  { id: "maxsus", name: "Maxsus", kwh: 300, days: 30, pricePerKwh: 1650 },
  { id: "explore", name: "Explore", kwh: 500, days: 60, pricePerKwh: 1550 },
  { id: "travel", name: "Travel", kwh: 1000, days: 90, pricePerKwh: 1450 },
  { id: "yaqin-taxi", name: "Yaqin Taxi", kwh: 125, days: 7, pricePerKwh: 1600, promo: true },
];
