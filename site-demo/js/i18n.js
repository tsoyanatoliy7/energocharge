/* EnerGo demo — RU / UZ / EN.
   Russian is the source text in the markup. This layer swaps every text node and the
   user-facing attributes, including content that scripts render later (map, popups, toasts).
   For production the same dictionary moves into the site's i18n files. */
(() => {
  // RU: [UZ (lotin), EN]
  const D = {
    'Перейти к содержимому': ['Asosiy qismga o‘tish', 'Skip to content'],
    'Станции': ['Stansiyalar', 'Stations'],
    'Как зарядить': ['Qanday quvvatlash', 'How to charge'],
    'Видео': ['Video', 'Videos'],
    'Партнёрам': ['Hamkorlarga', 'Partners'],
    'Поддержка': ['Yordam', 'Support'],
    'Скачать приложение': ['Ilovani yuklab olish', 'Get the app'],
    'Кошелёк': ['Hamyon', 'Wallet'],
    'Пополните баланс': ['Balansni to‘ldiring', 'Top up your balance'],
    'Банковской картой или через Click': ['Bank kartasi yoki Click orqali', 'By bank card or via Click'],
    'Баланс': ['Balans', 'Balance'],
    'сум': ['so‘m', 'UZS'],
    'Карта': ['Karta', 'Card'],
    'Пополнить': ['To‘ldirish', 'Top up'],
    'СХЕМА ИНТЕРФЕЙСА': ['INTERFEYS SXEMASI', 'INTERFACE MOCKUP'],
    'Зарядка': ['Quvvatlash', 'Charging'],
    'Идёт зарядка': ['Quvvatlanmoqda', 'Charging in progress'],
    'Получено': ['Olindi', 'Delivered'],
    'кВт·ч': ['kVt·soat', 'kWh'],
    'Коннектор': ['Konnektor', 'Connector'],
    'Завершить': ['Yakunlash', 'Finish'],
    'Сеть зарядных станций · Узбекистан': ['Quvvatlash stansiyalari tarmog‘i · O‘zbekiston', 'EV charging network · Uzbekistan'],
    'Включайся в движение. Находите станцию, заряжайтесь и платите в одном приложении EnerGo.': ['Stansiyani toping, quvvatlang va to‘lovni bitta EnerGo ilovasida qiling.', 'Join the movement. Find a station, charge and pay in one app: EnerGo.'],
    'Найти зарядку': ['Stansiya topish', 'Find a charger'],
    'ШАГ 01': ['1-QADAM', 'STEP 01'], 'ШАГ 02': ['2-QADAM', 'STEP 02'], 'ШАГ 03': ['3-QADAM', 'STEP 03'],
    'Отсканируйте QR на экране станции': ['Stansiya ekranidagi QR kodni skanerlang', 'Scan the QR code on the station screen'],
    'Наведите камеру телефона на QR и скачайте приложение EnerGo прямо у зарядки.': ['Telefon kamerasini QR kodga qarating va EnerGo ilovasini shu yerning o‘zida yuklab oling.', 'Point your phone camera at the QR code and get the EnerGo app right at the charger.'],
    'Банковской картой или через Click, в разделе «Кошелёк».': ['Bank kartasi yoki Click orqali, «Hamyon» bo‘limida.', 'By bank card or via Click, in the Wallet section.'],
    'Подключите и заряжайтесь': ['Ulang va quvvatlang', 'Plug in and charge'],
    'Выберите коннектор и запустите зарядку в приложении. Поддержка 24/7: +998 55 517 07 00.': ['Konnektorni tanlang va ilovada quvvatlashni boshlang. Yordam 24/7: +998 55 517 07 00.', 'Choose a connector and start charging in the app. Support 24/7: +998 55 517 07 00.'],
    'Скачать': ['Yuklab olish', 'Download'],
    'Зарядить': ['Quvvatlash', 'Charge'],
    'Листайте': ['Pastga suring', 'Scroll'],
    'Инструкции': ['Yo‘riqnomalar', 'How-to'],
    'Наведите': ['Kursorni olib boring', 'Hover over'],
    'Нажмите': ['Bosing', 'Tap'],
    'на часть станции, и она': ['— stansiya qismining o‘zi', 'a part of the station and it will'],
    'покажет, что делать': ['nima qilishni ko‘rsatadi', 'show you what to do'],
    'Как начать зарядку, взять и вернуть коннектор, остановить станцию в экстренной ситуации и связаться с поддержкой.': ['Quvvatlashni qanday boshlash, konnektorni olish va joyiga qo‘yish, favqulodda vaziyatda stansiyani to‘xtatish va yordam xizmatiga murojaat qilish.', 'How to start charging, take and return the connector, stop the station in an emergency and reach support.'],
    'Нажмите фиксатор': ['Qulfni bosing', 'Press the latch'],
    'В разъём авто до щелчка': ['Avtomobil raz’yomiga chiqillagancha', 'Into the car inlet until it clicks'],
    '«Завершить» в приложении': ['Ilovada «Yakunlash»', '“Finish” in the app'],
    'Верните в держатель': ['Ushlagichga qaytaring', 'Return it to the holder'],
    'Выберите коннектор': ['Konnektorni tanlang', 'Choose a connector'],
    '«Начать зарядку»': ['«Quvvatlashni boshlash»', '“Start charging”'],
    'Экран': ['Ekran', 'Screen'],
    'Поддержка 24/7': ['Yordam 24/7', 'Support 24/7'],
    'Нажмите кнопку': ['Tugmani bosing', 'Press the button'],
    'Зарядка остановлена': ['Quvvatlash to‘xtatildi', 'Charging stopped'],
    'Позвоните в поддержку': ['Yordam xizmatiga qo‘ng‘iroq qiling', 'Call support'],
    'Фото станции на объекте': ['Stansiyaning joydagi surati', 'On-site photo of the station'],
    'Потяните, чтобы осмотреть станцию': ['Stansiyani ko‘rish uchun torting', 'Drag to look around the station'],
    'Повернуть: аварийная кнопка': ['Burish: favqulodda tugma', 'Rotate: emergency button'],
    'Повернуть обратно': ['Ortga burish', 'Rotate back'],
    'Аварийная кнопка': ['Favqulodda tugma', 'Emergency stop'],
    'Помощь': ['Yordam', 'Help'],
    'Как начать зарядку': ['Quvvatlashni qanday boshlash', 'How to start charging'],
    'Всё управление зарядкой в приложении EnerGo.': ['Quvvatlash to‘liq EnerGo ilovasi orqali boshqariladi.', 'Charging is fully controlled in the EnerGo app.'],
    'Отсканируйте QR на экране': ['Ekrandagi QR kodni skanerlang', 'Scan the QR code on the screen'],
    'Или откройте приложение, если оно уже установлено': ['Yoki ilova o‘rnatilgan bo‘lsa, uni oching', 'Or open the app if you already have it'],
    'Выберите станцию и коннектор': ['Stansiya va konnektorni tanlang', 'Choose the station and connector'],
    'На карте видно, свободен ли коннектор': ['Xaritada konnektor bo‘shligi ko‘rinadi', 'The map shows whether a connector is free'],
    'Нажмите «Начать зарядку»': ['«Quvvatlashni boshlash»ni bosing', 'Tap “Start charging”'],
    'Предварительно подключите коннектор к автомобилю': ['Avval konnektorni avtomobilga ulang', 'Plug the connector into the car first'],
    'Видео: как начать зарядку': ['Video: quvvatlashni qanday boshlash', 'Video: how to start charging'],
    'Взять': ['Olish', 'Take'],
    'Вернуть': ['Qaytarish', 'Return'],
    'Нажмите фиксатор на рукояти': ['Dastadagi qulfni bosing', 'Press the latch on the handle'],
    'Возьмите коннектор за рукоять': ['Konnektorni dastasidan ushlang', 'Hold the connector by its handle'],
    'Потяните коннектор на себя': ['Konnektorni o‘zingizga torting', 'Pull the connector towards you'],
    'Плавно, не дёргая за кабель': ['Sekin, kabeldan tortmasdan', 'Smoothly, without yanking the cable'],
    'Вставьте в разъём автомобиля': ['Avtomobil raz’yomiga kiriting', 'Insert it into the car inlet'],
    'До щелчка, затем запустите зарядку в приложении': ['Chiqillagancha, so‘ng ilovada quvvatlashni boshlang', 'Until it clicks, then start charging in the app'],
    'Нажмите «Завершить» в приложении': ['Ilovada «Yakunlash»ni bosing', 'Tap “Finish” in the app'],
    'Зарядка остановится, оплата спишется автоматически': ['Quvvatlash to‘xtaydi, to‘lov avtomatik yechiladi', 'Charging stops and payment is taken automatically'],
    'Дождитесь разблокировки': ['Qulf ochilishini kuting', 'Wait for it to unlock'],
    'Нажмите фиксатор и извлеките коннектор из автомобиля': ['Qulfni bosing va konnektorni avtomobildan chiqaring', 'Press the latch and remove the connector from the car'],
    'Верните коннектор в держатель': ['Konnektorni ushlagichga qaytaring', 'Return the connector to its holder'],
    'Кабель не оставляйте на земле': ['Kabelni yerda qoldirmang', 'Don’t leave the cable on the ground'],
    'Видео: как закончить зарядку': ['Video: quvvatlashni qanday yakunlash', 'Video: how to finish charging'],
    'Экстренная остановка': ['Favqulodda to‘xtatish', 'Emergency stop'],
    'Красная кнопка на боковой панели станции. Только для опасных ситуаций.': ['Stansiyaning yon panelidagi qizil tugma. Faqat xavfli vaziyatlar uchun.', 'The red button on the side panel of the station. For dangerous situations only.'],
    'Нажмите красную кнопку': ['Qizil tugmani bosing', 'Press the red button'],
    'Она на левой боковой панели, рядом с коннектором': ['U chap yon panelda, konnektor yonida', 'It is on the left side panel, next to the connector'],
    'Зарядка остановится': ['Quvvatlash to‘xtaydi', 'Charging will stop'],
    'Отойдите от станции и автомобиля': ['Stansiya va avtomobildan uzoqlashing', 'Step away from the station and the car'],
    'Позвоните в поддержку 24/7': ['Yordam xizmatiga qo‘ng‘iroq qiling 24/7', 'Call support 24/7'],
    '+998 55 517 07 00, назовите номер станции': ['+998 55 517 07 00, stansiya raqamini ayting', '+998 55 517 07 00, give the station number'],
    'Видеоинструкция на YouTube': ['YouTube’dagi video yo‘riqnoma', 'Video guide on YouTube'],
    'SOS-кнопка': ['SOS tugmasi', 'SOS button'],
    'Позвонить 24/7': ['Qo‘ng‘iroq qilish 24/7', 'Call 24/7'],
    'Нужна помощь?': ['Yordam kerakmi?', 'Need help?'],
    'Если коннектор не отсоединяется или что-то пошло не так.': ['Konnektor ajralmasa yoki biror narsa noto‘g‘ri ketsa.', 'If the connector won’t release or something went wrong.'],
    'Проверьте, что зарядка завершена': ['Quvvatlash yakunlanganini tekshiring', 'Check that charging has finished'],
    'В приложении должна быть нажата кнопка «Завершить»': ['Ilovada «Yakunlash» tugmasi bosilgan bo‘lishi kerak', 'The “Finish” button must be tapped in the app'],
    'Нажмите SOS в приложении': ['Ilovada SOS ni bosing', 'Tap SOS in the app'],
    'Сразу свяжет с технической поддержкой': ['Darhol texnik yordam bilan bog‘laydi', 'Connects you to tech support right away'],
    'Или позвоните по номеру на корпусе': ['Yoki korpusdagi raqamga qo‘ng‘iroq qiling', 'Or call the number on the station body'],
    'Круглосуточно, 24/7': ['Kecha-kunduz, 24/7', 'Around the clock, 24/7'],
    'Видео: когда застрял коннектор': ['Video: konnektor tiqilib qolsa', 'Video: when the connector is stuck'],
    'Тексты инструкций черновые: сверить с командой эксплуатации перед запуском.': ['Yo‘riqnoma matnlari qoralama: ishga tushirishdan oldin ekspluatatsiya jamoasi bilan tekshirish kerak.', 'Instruction texts are drafts: to be checked with the operations team before launch.'],
    'Видеоинструкции': ['Video yo‘riqnomalar', 'Video guides'],
    'Короткие ролики от команды EnerGo по каждому шагу.': ['EnerGo jamoasidan har bir qadam bo‘yicha qisqa videolar.', 'Short videos from the EnerGo team for every step.'],
    'Как закончить зарядку': ['Quvvatlashni qanday yakunlash', 'How to finish charging'],
    'Статус зарядной станции': ['Stansiya holati', 'Charging station status'],
    'Пополнение кошелька': ['Hamyonni to‘ldirish', 'Topping up the wallet'],
    'Когда застрял коннектор': ['Konnektor tiqilib qolganda', 'When the connector is stuck'],
    'Приобретение абонемента': ['Abonement sotib olish', 'Buying a subscription'],
    'Заряжайтесь по всему': ['Butun', 'Charge all across'],
    'Узбекистану': ['O‘zbekiston bo‘ylab quvvatlang', 'Uzbekistan'],
    'Найдите ближайшую станцию, посмотрите свободные коннекторы и постройте маршрут. Запуск зарядки в приложении EnerGo.': ['Eng yaqin stansiyani toping, bo‘sh konnektorlarni ko‘ring va yo‘nalish tuzing. Quvvatlash EnerGo ilovasida boshlanadi.', 'Find the nearest station, see free connectors and build a route. Charging starts in the EnerGo app.'],
    'Демо-данные': ['Demo maʼlumotlar', 'Demo data'],
    'Поиск станции': ['Stansiya qidirish', 'Search stations'],
    'Рядом со мной': ['Yaqin atrofda', 'Near me'],
    'Все': ['Hammasi', 'All'],
    'Ташкент': ['Toshkent', 'Tashkent'], 'Самарканд': ['Samarqand', 'Samarkand'], 'Фергана': ['Farg‘ona', 'Fergana'],
    'Кашкадарья': ['Qashqadaryo', 'Kashkadarya'], 'Навои': ['Navoiy', 'Navoi'], 'Сырдарья': ['Sirdaryo', 'Syrdarya'],
    'Андижан': ['Andijon', 'Andijan'], 'Бухара': ['Buxoro', 'Bukhara'], 'Хорезм': ['Xorazm', 'Khorezm'],
    'Наманган': ['Namangan', 'Namangan'], 'Джизак': ['Jizzax', 'Jizzakh'], 'Сурхандарья': ['Surxondaryo', 'Surkhandarya'],
    'Каракалпакстан': ['Qoraqalpog‘iston', 'Karakalpakstan'],
    'Только свободные': ['Faqat bo‘shlari', 'Free only'],
    'станций': ['ta stansiya', 'stations'], 'станция': ['ta stansiya', 'station'], 'станции': ['ta stansiya', 'stations'],
    'Ничего не': ['Hech narsa', 'Nothing'], 'найдено': ['topilmadi', 'found'],
    'Ctrl + колесо мыши для масштаба': ['Masshtab uchun Ctrl + sichqoncha g‘ildiragi', 'Ctrl + mouse wheel to zoom'],
    'Есть свободные': ['Bo‘sh joy bor', 'Available'],
    'Все заняты': ['Hammasi band', 'All busy'],
    'Не работает': ['Ishlamayapti', 'Out of service'],
    'Демо': ['Demo', 'Demo'],
    'Актуальные статусы и запуск зарядки: в приложении EnerGo.': ['Dolzarb holatlar va quvvatlashni boshlash: EnerGo ilovasida.', 'Live statuses and charging start: in the EnerGo app.'],
    'Для разработчиков: станции подставляются через': ['Dasturchilar uchun: stansiyalar quyidagi orqali beriladi', 'For developers: stations are passed in via'],
    'или заменой': ['yoki almashtirish orqali', 'or by replacing'],
    'в': ['faylida:', 'in'],
    'на API действующей карты приложения. Формат данных описан там же. Эта плашка в продакшене скрывается.': ['ilovaning amaldagi xaritasi API’siga. Maʼlumotlar formati o‘sha yerda yozilgan. Bu blok prodakshnda yashiriladi.', 'with the live app map API. The data format is documented there. This note is hidden in production.'],
    'На карте': ['Xaritada', 'On the map'],
    'В приложении': ['Ilovada', 'In the app'],
    'Маршрут ↗': ['Yo‘nalish ↗', 'Route ↗'],
    'Закрыть': ['Yopish', 'Close'],
    'кВт': ['kVt', 'kW'],
    'сум/кВт·ч': ['so‘m/kVt·soat', 'UZS/kWh'],
    'Геолокация недоступна, показываем от центра Ташкента': ['Geolokatsiya mavjud emas, Toshkent markazidan ko‘rsatamiz', 'Location unavailable, showing from central Tashkent'],
    'Для бизнеса': ['Biznes uchun', 'For business'],
    'Станьте партнёром': ['Hamkor bo‘ling —', 'Become a partner of'],
    'Выберите формат: станция на вашей территории или абонементы для автопарка. Мы свяжемся с вами и подготовим условия.': ['Formatni tanlang: hududingizda stansiya yoki avtopark uchun abonementlar. Biz siz bilan bog‘lanamiz va shartlarni tayyorlaymiz.', 'Pick a format: a station on your premises or subscriptions for your fleet. We will get in touch and prepare the terms.'],
    'Станция на вашей территории': ['Hududingizda stansiya', 'A station on your premises'],
    'Станция и строительно-монтажные работы за счёт EnerGo': ['Stansiya va qurilish-montaj ishlari EnerGo hisobidan', 'Station and installation works paid by EnerGo'],
    'Обслуживание и техническая поддержка': ['Xizmat ko‘rsatish va texnik yordam', 'Maintenance and technical support'],
    'Дополнительный поток клиентов на вашу локацию': ['Joyingizga qo‘shimcha mijozlar oqimi', 'Extra customer traffic to your location'],
    'Для ТРЦ, бизнес-центров, АЗС, отелей, кафе и парковок': ['SEM, biznes-markazlar, AYoQSH, mehmonxonalar, kafe va avtoturargohlar uchun', 'For malls, business centres, fuel stations, hotels, cafés and car parks'],
    'Абонементы для автопарков': ['Avtoparklar uchun abonementlar', 'Fleet subscriptions'],
    'Специальная цена за кВт·ч': ['kVt·soat uchun maxsus narx', 'Special price per kWh'],
    'Единый абонемент на весь автопарк': ['Butun avtopark uchun yagona abonement', 'One subscription for the whole fleet'],
    'Контроль расходов на зарядку': ['Quvvatlash xarajatlari nazorati', 'Control of charging costs'],
    'Условия под объём потребления': ['Isteʼmol hajmiga mos shartlar', 'Terms tailored to your volume'],
    'Для такси, доставки, каршеринга и корпоративных автопарков': ['Taksi, yetkazib berish, karsharing va korporativ avtoparklar uchun', 'For taxi, delivery, car sharing and corporate fleets'],
    'Ваш объект': ['Sizning obyektingiz', 'Your property'],
    'ТРЦ · бизнес-центр · АЗС · отель': ['SEM · biznes-markaz · AYoQSH · mehmonxona', 'mall · office · fuel station · hotel'],
    'ТП': ['TP', 'Substation'],
    'Хаб EnerGo': ['EnerGo xabi', 'EnerGo hub'],
    'Станция и монтаж за счёт EnerGo': ['Stansiya va montaj EnerGo hisobidan', 'Station and installation by EnerGo'],
    'Подключение к ТП': ['TPga ulanish', 'Grid connection'],
    'Гости заряжаются, пока они у вас': ['Mehmonlar sizda bo‘lganda quvvatlanadi', 'Guests charge while they visit you'],
    'Пример отчёта автопарка': ['Avtopark hisobotiga misol', 'Sample fleet report'],
    'Расход по машинам': ['Mashinalar bo‘yicha sarf', 'Usage by vehicle'],
    'Схема для примера': ['Misol uchun sxema', 'Illustrative diagram'],
    'Как это работает': ['Bu qanday ishlaydi', 'How it works'],
    'Заявка': ['Ariza', 'Request'],
    'Оставьте контакты и адрес площадки, это займёт минуту.': ['Kontaktlar va maydon manzilini qoldiring, bu bir daqiqa oladi.', 'Leave your contacts and the site address, it takes a minute.'],
    'Осмотр площадки': ['Maydonni ko‘zdan kechirish', 'Site survey'],
    'Инженер EnerGo оценит место и мощность подключения к ТП.': ['EnerGo muhandisi joyni va TPga ulanish quvvatini baholaydi.', 'An EnerGo engineer assesses the site and the available grid power.'],
    'Договор': ['Shartnoma', 'Contract'],
    'Согласуем условия, сроки монтажа и размещение.': ['Shartlar, montaj muddatlari va joylashuvni kelishamiz.', 'We agree the terms, installation timing and placement.'],
    'Запуск': ['Ishga tushirish', 'Launch'],
    'Монтаж и подключение, станция появляется на карте приложения.': ['Montaj va ulanish, stansiya ilova xaritasida paydo bo‘ladi.', 'Installation and connection, then the station appears on the app map.'],
    'Расскажите о размере автопарка и городах работы.': ['Avtopark hajmi va ishlaydigan shaharlar haqida ayting.', 'Tell us about your fleet size and cities of operation.'],
    'Расчёт': ['Hisob-kitob', 'Quote'],
    'Подберём объём кВт·ч и цену под ваш расход.': ['Sarfingizga mos kVt·soat hajmi va narxni tanlaymiz.', 'We size the kWh volume and price to your usage.'],
    'Фиксируем условия и подключаем водителей к абонементу.': ['Shartlarni qayd etamiz va haydovchilarni abonementga ulaymiz.', 'We fix the terms and add your drivers to the subscription.'],
    'Старт': ['Start', 'Go live'],
    'Водители заряжаются на любой станции EnerGo, вы видите расходы.': ['Haydovchilar istalgan EnerGo stansiyasida quvvatlanadi, siz xarajatlarni ko‘rasiz.', 'Drivers charge at any EnerGo station and you see the costs.'],
    'Обсудим вашу площадку или автопарк': ['Maydoningiz yoki avtoparkingizni muhokama qilamiz', 'Let’s talk about your site or fleet'],
    'Оставьте заявку, и менеджер свяжется с вами в рабочее время. Можно сразу позвонить или написать.': ['Ariza qoldiring, menejer ish vaqtida siz bilan bog‘lanadi. Darhol qo‘ng‘iroq qilish yoki yozish ham mumkin.', 'Leave a request and a manager will contact you during business hours. You can also call or message right away.'],
    'Телефон': ['Telefon', 'Phone'],
    'Почта': ['Pochta', 'Email'],
    'Оставить заявку': ['Ariza qoldirish', 'Send a request'],
    'Формат': ['Format', 'Format'],
    'Станция на территории': ['Hududda stansiya', 'Station on premises'],
    'Абонементы для автопарка': ['Avtopark uchun abonementlar', 'Fleet subscriptions'],
    'Имя и фамилия *': ['Ism va familiya *', 'Full name *'],
    'Компания': ['Kompaniya', 'Company'],
    'Телефон *': ['Telefon *', 'Phone *'],
    'Город и адрес': ['Shahar va manzil', 'City and address'],
    'Есть ли возможность подключения к ТП?': ['TPga ulanish imkoniyati bormi?', 'Is a grid connection available?'],
    'Да': ['Ha', 'Yes'], 'Нет': ['Yo‘q', 'No'], 'Не знаю': ['Bilmayman', 'Not sure'],
    'Сколько машин в автопарке?': ['Avtoparkda nechta mashina bor?', 'How many vehicles in the fleet?'],
    'до 10': ['10 tagacha', 'up to 10'], 'больше 50': ['50 dan ortiq', 'over 50'],
    'Я согласен на обработку персональных данных и принимаю': ['Shaxsiy maʼlumotlarimni qayta ishlashga roziman va qabul qilaman:', 'I agree to the processing of personal data and accept the'],
    'политику конфиденциальности': ['maxfiylik siyosati', 'privacy policy'],
    'Отправить заявку': ['Ariza yuborish', 'Send request'],
    'Демо: заявка никуда не отправляется': ['Demo: ariza hech qayerga yuborilmaydi', 'Demo: the request is not sent anywhere'],
    'Заявка принята': ['Ariza qabul qilindi', 'Request received'],
    'Спасибо! Менеджер EnerGo свяжется с вами, чтобы обсудить детали.': ['Rahmat! EnerGo menejeri tafsilotlarni muhokama qilish uchun siz bilan bog‘lanadi.', 'Thank you! An EnerGo manager will contact you to discuss the details.'],
    'Демо-режим: данные не отправлены. В рабочей версии заявка уходит в CRM.': ['Demo rejim: maʼlumotlar yuborilmadi. Ishchi versiyada ariza CRM’ga tushadi.', 'Demo mode: nothing was sent. In production the request goes to the CRM.'],
    'Отправить ещё одну': ['Yana bittasini yuborish', 'Send another'],
    'Тексты и условия партнёрства черновые: сверить с отделом развития перед запуском.': ['Hamkorlik matnlari va shartlari qoralama: ishga tushirishdan oldin rivojlanish bo‘limi bilan tekshirish kerak.', 'Partnership texts and terms are drafts: to be checked with business development before launch.'],
    'Например, Ташкент, ул. Амира Темура': ['Masalan, Toshkent, Amir Temur ko‘chasi', 'e.g. Tashkent, Amir Temur street'],
    'Название, город или адрес': ['Nomi, shahar yoki manzil', 'Name, city or address'],
    // aria / tooltips
    'EnerGo, на главную': ['EnerGo, bosh sahifa', 'EnerGo, home'], 'Основное меню': ['Asosiy menyu', 'Main menu'], 'Разделы': ['Bo‘limlar', 'Sections'],
    'Язык': ['Til', 'Language'], 'Меню': ['Menyu', 'Menu'], 'Зарядная станция EnerGo': ['EnerGo quvvatlash stansiyasi', 'EnerGo charging station'],
    'Скачать в Google Play': ['Google Play’dan yuklab olish', 'Get it on Google Play'], 'Скачать в App Store': ['App Store’dan yuklab olish', 'Download on the App Store'],
    'Открыть Telegram-канал': ['Telegram kanalni ochish', 'Open the Telegram channel'], 'Открыть Instagram': ['Instagramni ochish', 'Open Instagram'],
    'Инструкции на станции': ['Stansiyadagi yo‘riqnomalar', 'On-station instructions'], 'Станция EnerGo спереди': ['EnerGo stansiyasi old tomondan', 'EnerGo station, front view'],
    'Экран: как начать зарядку': ['Ekran: quvvatlashni qanday boshlash', 'Screen: how to start charging'], 'Коннектор: как взять и вернуть': ['Konnektor: qanday olish va qaytarish', 'Connector: how to take and return it'],
    'Станция EnerGo сбоку, аварийная кнопка на боковой панели': ['EnerGo stansiyasi yon tomondan, favqulodda tugma yon panelda', 'EnerGo station, side view with the emergency button'],
    'Части станции': ['Stansiya qismlari', 'Station parts'], 'Действие': ['Harakat', 'Action'],
    'Видеоинструкции, листайте вбок': ['Video yo‘riqnomalar, yon tomonga suring', 'Video guides, swipe sideways'], 'Назад': ['Orqaga', 'Back'], 'Вперёд': ['Oldinga', 'Next'],
    'Карта станций EnerGo': ['EnerGo stansiyalari xaritasi', 'EnerGo station map'], 'Город': ['Shahar', 'City'], 'Фильтры': ['Filtrlar', 'Filters'],
    'Карта станций. Перетаскивайте, чтобы двигать; кнопки плюс и минус меняют масштаб.': ['Stansiyalar xaritasi. Surish uchun torting; plyus va minus masshtabni o‘zgartiradi.', 'Station map. Drag to move; plus and minus change the zoom.'],
    'Карта Узбекистана со станциями EnerGo': ['EnerGo stansiyalari bilan O‘zbekiston xaritasi', 'Map of Uzbekistan with EnerGo stations'],
    'Приблизить': ['Yaqinlashtirish', 'Zoom in'], 'Отдалить': ['Uzoqlashtirish', 'Zoom out'], 'Весь Узбекистан': ['Butun O‘zbekiston', 'All of Uzbekistan'],
    'Станция': ['Stansiya', 'Station'], 'Как стать партнёром EnerGo': ['Qanday qilib EnerGo hamkori bo‘lish', 'How to become an EnerGo partner'], 'Формат партнёрства': ['Hamkorlik formati', 'Partnership format'],
    'Вариант C — Кино': ['EnerGo', 'EnerGo'],
    'Геолокация недоступна в этом браузере': ['Bu brauzerda geolokatsiya mavjud emas', 'Location is not available in this browser'],
    'Определяем местоположение…': ['Joylashuv aniqlanmoqda…', 'Finding your location…'],
    'Нет доступа к геолокации. Выберите город.': ['Geolokatsiyaga ruxsat yo‘q. Shaharni tanlang.', 'No access to location. Choose a city.'],
    'Это просмотр без анимаций. Откройте файл в Safari или Chrome: «Поделиться» → «Открыть в…» · Open in Safari or Chrome for the full demo': ['Bu animatsiyasiz ko‘rinish. To‘liq demo uchun Safari yoki Chrome’da oching', 'This preview has no animations. Open the file in Safari or Chrome for the full demo'],
    'EnerGo — новый сайт (демо)': ['EnerGo — yangi sayt (demo)', 'EnerGo — new website (demo)'],
    'EnerGo — зарядные станции для электромобилей в Узбекистане': ['EnerGo — Oʻzbekistonda elektromobillar uchun quvvatlash stansiyalari', 'EnerGo — EV charging stations in Uzbekistan'],
    'Быстрая зарядка электромобилей EnerGo по всему Узбекистану: карта станций, запуск зарядки в приложении, поддержка 24/7. Станьте партнёром и установите станцию на своём объекте.': ['EnerGo elektromobillarni butun Oʻzbekiston boʻylab tez quvvatlash: stansiyalar xaritasi, ilovada quvvatlashni boshlash, 24/7 yordam. Hamkor boʻling va obyektingizga stansiya oʻrnating.', 'Fast EV charging with EnerGo across Uzbekistan: station map, start charging in the app, 24/7 support. Become a partner and install a station at your site.'],
  };
  const IDX = { uz: 0, en: 1 };
  const city = (c, L) => (D[c] ? D[c][IDX[L]] : c);
  // dynamic strings rendered by scripts
  const P = [
    [/^(\d+) станци(?:й|я|и), приблизить$/, (m, L) => L === 'uz' ? `${m[1]} ta stansiya, yaqinlashtirish` : `${m[1]} stations, zoom in`],
    [/^Свободно (\d+) из (\d+)$/, (m, L) => L === 'uz' ? `Bo‘sh: ${m[1]} / ${m[2]}` : `${m[1]} of ${m[2]} free`],
    [/^Все заняты · 0 из (\d+)$/, (m, L) => L === 'uz' ? `Hammasi band · 0 / ${m[1]}` : `All busy · 0 of ${m[1]}`],
    [/^Демо-адрес · (.+), точка (\d+)$/, (m, L) => L === 'uz' ? `Demo manzil · ${city(m[1], L)}, ${m[2]}-nuqta` : `Demo address · ${city(m[1], L)}, point ${m[2]}`],
    [/^(.+) · ([\d.]+) км$/, (m, L) => `${tr(m[1], L)} · ${m[2]} ${L === 'uz' ? 'km' : 'km'}`],
    [/^(EnerGo \d+), (.+)$/, (m, L) => `${m[1]}, ${tr(m[2], L)}`],
    [/^Открываем карту станций EnerGo: (.+)$/, (m, L) => (L === 'uz' ? 'EnerGo xaritasini ochamiz: ' : 'Opening the EnerGo map: ') + city(m[1], L)],
    [/^Показать все (\d+)$/, (m, L) => L === 'uz' ? `Hammasini ko‘rsatish (${m[1]})` : `Show all ${m[1]}`],
  ];
  const norm = (s) => s.replace(/\s+/g, ' ').trim();
  function tr(src, L) {
    if (L === 'ru') return src;
    const k = norm(src);
    if (D[k]) return D[k][IDX[L]];
    for (const [re, f] of P) { const m = k.match(re); if (m) return f(m, L); }
    return null;
  }

  let lang = 'ru';
  const ATTRS = ['placeholder', 'aria-label', 'data-tip', 'title', 'alt'];
  const T = new WeakMap(); // text node -> { ru, set }
  function doText(n) {
    const v = n.nodeValue; if (!v || !/\S/.test(v)) return;
    let r = T.get(n);
    if (!r || v !== r.set) { r = { ru: v }; T.set(n, r); } // new node, or a script changed it (in Russian)
    const t = tr(r.ru, lang);
    const out = t == null ? r.ru : r.ru.replace(norm(r.ru), t);
    r.set = out; if (v !== out) n.nodeValue = out;
  }
  function doEl(el) {
    let store = el.__i18n;
    for (const a of ATTRS) {
      const v = el.getAttribute(a); if (v == null) continue;
      store = store || (el.__i18n = {});
      if (!store[a] || v !== store[a].set) store[a] = { ru: v };
      const t = tr(store[a].ru, lang), out = t == null ? store[a].ru : t;
      store[a].set = out; if (v !== out) el.setAttribute(a, out);
    }
  }
  const SKIP = 'script,style,code';
  function walk(root) {
    if (root.nodeType === 3) { if (!root.parentElement || !root.parentElement.closest(SKIP)) doText(root); return; }
    if (root.nodeType !== 1 || root.closest(SKIP)) return;
    doEl(root); root.querySelectorAll('*').forEach(doEl);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: (n) => n.parentElement.closest(SKIP) ? 2 : 1 });
    let n; while ((n = w.nextNode())) doText(n);
  }
  let busy = false;
  const mo = new MutationObserver((list) => {
    if (busy) return; busy = true;
    for (const m of list) {
      if (m.type === 'characterData') doText(m.target);
      else if (m.type === 'attributes') doEl(m.target);
      else m.addedNodes.forEach(walk);
    }
    mo.takeRecords(); busy = false;
  });

  const TITLE = document.title;
  const DESC = (document.querySelector('meta[name="description"]') || {}).content || '';
  function setLang(L, { save = true } = {}) {
    if (!(L in IDX) && L !== 'ru') L = 'ru';
    lang = L; busy = true;
    document.documentElement.lang = L === 'uz' ? 'uz-Latn' : L;
    document.title = L === 'ru' ? TITLE : (tr(TITLE, L) || TITLE);
    // SEO / share tags follow the language: description, OG, canonical
    const meta = (sel, attr, v) => { const m = document.querySelector(sel); if (m) m.setAttribute(attr, v); };
    const tx = (k) => (L === 'ru' ? k : tr(k, L) || k);
    meta('meta[name="description"]', 'content', tx(DESC)); meta('meta[property="og:description"]', 'content', tx(DESC));
    meta('meta[property="og:title"]', 'content', document.title);
    meta('meta[property="og:locale"]', 'content', { ru: 'ru_RU', uz: 'uz_UZ', en: 'en_US' }[L]);
    const alt = document.querySelector('link[rel="alternate"][hreflang="' + L + '"]');
    if (alt) meta('link[rel="canonical"]', 'href', alt.href);
    walk(document.body);
    document.querySelectorAll('.lang a').forEach((a) => { const on = a.textContent.trim().toLowerCase() === L; on ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'); });
    mo.takeRecords(); busy = false;
    if (save) { try { localStorage.setItem('energo-lang', L); } catch (e) { /* private mode */ } }
    // copy length changes: let layout-dependent scenes re-measure
    requestAnimationFrame(() => dispatchEvent(new Event('resize')));
  }
  document.querySelectorAll('.lang a').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); setLang(a.textContent.trim().toLowerCase()); }));
  mo.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  let start = 'ru';
  const q = new URLSearchParams(location.search).get('lang');
  if (q) start = q; else { try { start = localStorage.getItem('energo-lang') || 'ru'; } catch (e) { /* ignore */ } }
  window.EnerGoI18n = { setLang, t: (s) => tr(s, lang) || s, get lang() { return lang; } };
  if (start !== 'ru') setLang(start, { save: false });
})();
