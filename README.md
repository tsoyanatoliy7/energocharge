# EnerGo — новый сайт energocharge.uz

> **Актуальный сайт находится в папке [`site-demo/`](site-demo/).** Это утверждённая версия. Инструкция для разработчиков: [site-demo/README.md](site-demo/README.md) (API карты, CRM, переводы, SEO).

Живое демо: https://tsoyanatoliy7.github.io/energocharge/

## Запуск

Сборка не нужна, это статический сайт:

```bash
npm run dev            # откроется http://localhost:3000
# или
cd site-demo && python3 -m http.server 3000
```

> Из `file://` сайт целиком не откроется: ES-модулям нужен http(s).

## Структура

| Путь | Что там |
|---|---|
| `site-demo/` | весь сайт: `index.html`, `js/`, `media/`, `brand/`, `robots.txt`, `sitemap.xml` |
| `site-demo/README.md` | что подключить перед продом |

Первый прототип на Next.js (v0.1, не утверждён) убран из `main` и лежит в ветке [`legacy-nextjs`](https://github.com/tsoyanatoliy7/energocharge/tree/legacy-nextjs). Использовать его не нужно.

Ветка `gh-pages` содержит собранную однофайловую копию для демо-ссылки, разработчикам её трогать не нужно.
