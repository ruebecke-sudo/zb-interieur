# ZB Interieur Connector

## Status
Pilot connector. Existing ZB functionality already provides the media API and Netlify-backed storage.

## Existing mapping
| Image Manager Pro | ZB Interieur |
|---|---|
| category1 | Marke |
| category2 | Produktart |
| category3 | Bereich |
| category4 | Stil |
| name | Bildname |
| text | Bildtext |
| width/height | Auflösung |
| color_space | Farbraum |
| format | Format |
| file_size | Dateigröße |
| url | Bild-URL |

## Existing API
- POST /api/images/upload
- GET /api/images
- GET /api/images/:id
- PUT /api/images/:id
- DELETE /api/images/:id
- GET /api/images/categories
- PUT /api/images/categories
- GET /api/health
- GET /api/images/openapi.json

## Security
The connector API uses a bearer/API key. The key belongs on the server-side connector configuration, never in frontend JavaScript.

## Product direction
The SaaS should treat this connector as one implementation of a generic connector interface. Future connectors can include WordPress, Shopify, custom REST APIs and native Image Manager Pro storage.
