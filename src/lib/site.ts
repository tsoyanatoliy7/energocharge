// Единая точка для внешних ссылок и контактов. Меняйте здесь, а не в компонентах.
export const site = {
  url: "https://energocharge.uz",
  phone: "+998 55 517 07 00",
  phoneHref: "tel:+998555170700",
  email: "info@energocharge.uz",
  telegram: "https://t.me/energo_support",
  instagram: "https://www.instagram.com/energocharge",
  appStore: "https://apps.apple.com/uz/app/energo/id6748807616",
  googlePlay: "https://play.google.com/store/apps/details?id=uz.energocharge.energocharge",
  map: "https://yandex.uz/maps/?text=EnerGo%20Ташкент",
  // Встраиваемый виджет Яндекс Карт с поиском «EnerGo». Заменить на собственную карту + API станций.
  mapWidget: "https://yandex.uz/map-widget/v1/?text=EnerGo%20%D0%A2%D0%B0%D1%88%D0%BA%D0%B5%D0%BD%D1%82&ll=69.279737%2C41.311151&z=11",
  videoGuide: "https://www.youtube.com/shorts/-I3tNgsv_uQ",
  // TODO(product): заменить на новые страницы форм, когда они будут готовы.
  installStationForm: "https://energocharge.uz/install-station.html",
  corporateForm: "https://energocharge.uz/corporate-passes.html",
  privacy: "https://energocharge.uz/politics.html",
} as const;
