# Specification

## Summary
**Goal:** Ensure the catalog shows real product photos for all products, expand the seeded collections (especially Sarees, Kurtas, Men’s T‑shirts, and Men’s shirts), and add XXL/XXXL size support.

**Planned changes:**
- Add static product image assets for all seeded catalog products and ensure product cards and product detail pages always load working images.
- Store new product images under `frontend/public/assets/generated` (or subfolders) and update backend seed data to reference these static paths via each product’s `imageUrls` array.
- Expand the backend size variants to include `XXL` and `XXXL`, update seeded products’ `availableSizes` where applicable, and ensure the frontend size selector displays and uses these sizes correctly.
- Expand the seeded catalog with additional products across key categories (Sarees, Kurtas, Men’s T‑shirts, Men’s shirts), each including full product info, appropriate sizes, and at least one valid image URL.

**User-visible outcome:** Users can browse category pages and product details with real, non-broken product photos, see more items in the requested collections, and select XXL/XXXL sizes when available.
