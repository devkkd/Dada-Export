# Bulk Upload Guide — Dada Exports

## Flow

```
1. Download Template  →  2. Fill Excel  →  3. Upload Images (optional)  →  4. Upload Excel
```

---

## Step 1 — Download Template

Go to **Admin → Bulk Upload**, select **B2B** or **Retail**, click **Download Template**.

---

## Step 2 — Fill Excel

### Required columns (both B2B & Retail)

| Column | Required | Example |
|--------|----------|---------|
| `SKU` | ✅ | `SKU001` |
| `name` | ✅ | `Women Olive Floral Maxi Dress` |
| `description` | ✅ | `Elegant halter maxi dress...` |
| `category` | ✅ | `Dresses` (must match admin category name exactly) |
| `price` | ✅ | `1899` |

### Optional columns

| Column | Example | Notes |
|--------|---------|-------|
| `breadcrumbLabel` | `Tie-Up Drawstring Summer Dress` | Subtitle under product name |
| `subcategory` | `Maxi Dress` | Must exist in admin |
| `fabric` | `100% Premium Rayon` | |
| `tags` | `summer,floral,maxi` | Comma-separated |
| `isActive` | `true` | Default: `true` |
| `isFeatured` | `false` | Default: `false` |
| `isNewArrival` | `true` | Shows in New Arrivals section |
| `imageUrl` | `https://r2.dev/img.jpg` | Direct URL (comma-sep for multiple) |

### slug
Leave **blank** — auto-generated from product name. No need to fill.

---

## Multi-value Column Formats

### colors
```
Olive Green:#4A7043,Black:#1F1F1F,Rose:#E11D48
```
Format: `Color Name:#hexcode` — comma-separated

### highlights
```
Color:Olive Green|Fabric:Rayon|Occasion:Casual|Length:Maxi
```
Format: `Label:Value` — pipe `|` separated

### keyFeatures & careInstructions
```
Premium quality 100% rayon|Breathable fabric|Adjustable strap
```
Format: pipe `|` separated bullet points

---

## B2B Only

| Column | Example |
|--------|---------|
| `moq` | `50` (minimum order qty) |
| `sizes` | `XS,S,M,L,XL,2XL` (comma-separated) |

---

## Retail Only

| Column | Example |
|--------|---------|
| `mrp` | `2499` (original price before discount) |
| `variants` | `S:20,M:30,L:25,XL:15` (size:stock) |
| `prints` | `Floral,Paisley,Block Print` (comma-separated) |

---

## Step 3 — Images

### Option A — Already on Cloudflare R2
Skip Step 3. System auto-fetches by SKU from R2.

Images must be named:
```
SKU001-1.jpg   ← main image
SKU001-2.jpg   ← second image
SKU001-3.jpg   ← etc.
SKU001.jpg     ← single image (no number needed)
```

Stored at: `bulk-images/b2b/SKU001-1.jpg` or `bulk-images/retail/SKU001-1.jpg`

### Option B — Upload Images Now
Drag & drop files or select folder in **Step 3** of Bulk Upload page. Images upload to R2 automatically before Excel processing.

### Option C — Direct URL in Excel
Fill `imageUrl` column with comma-separated public URLs:
```
https://pub-xxx.r2.dev/img1.jpg,https://pub-xxx.r2.dev/img2.jpg
```

---

## Step 4 — Upload Mode

| Mode | Behavior |
|------|----------|
| **Create only** | Skips products with duplicate names (safe default) |
| **Upsert** | Overwrites existing products with same slug |

---

## Category Names

Category names in Excel **must match exactly** (case-insensitive) with categories in Admin → Categories.

If category not found → product is **skipped with error**.

---

## Example Row (B2B)

| SKU | name | description | category | subcategory | price | moq | sizes | colors | highlights |
|-----|------|-------------|----------|-------------|-------|-----|-------|--------|------------|
| SKU001 | Botanical Halter Maxi | Elegant flowy dress... | Dresses | Maxi Dress | 1899 | 50 | XS,S,M,L,XL | Olive:#4A7043,Black:#1F1F1F | Color:Olive\|Fabric:Rayon |

---

## After Upload

Results show:
- ✓ **Created** — successfully added
- ⊘ **Skipped** — duplicate (create mode)
- ✗ **Failed** — error with reason (fix and re-upload only failed rows)
