# Dataset Structure Documentation

## Overview

The Store Intelligence System organizes datasets into a standardized folder structure to support CCTV video analysis, store layout mapping, and POS transaction tracking.

## Directory Structure

```
dataset/
├── videos/
│   ├── CAM1.mp4
│   ├── CAM2.mp4
│   ├── CAM3.mp4
│   ├── CAM4.mp4
│   └── CAM5.mp4
├── layouts/
│   └── store_layout.png
└── transactions/
    └── pos_transactions.csv
```

## Components

### 1. Videos Directory (`dataset/videos/`)

Contains CCTV video files from different camera locations in the store.

**Files:**
- `CAM1.mp4` - Entrance camera feed
- `CAM2.mp4` - Main floor camera feed
- `CAM3.mp4` - Fragrance section camera feed
- `CAM4.mp4` - Makeup section camera feed
- `CAM5.mp4` - Cash counter camera feed

**Specifications:**
- Format: MP4 (H.264 codec recommended)
- Resolution: 1920x1080 (Full HD)
- Frame Rate: 30 FPS
- Duration: Variable (typically 1-8 hours per video)

### 2. Layouts Directory (`dataset/layouts/`)

Contains store layout visualization and zone mapping.

**Files:**
- `store_layout.png` - Visual representation of the store layout with zone boundaries

**Specifications:**
- Format: PNG
- Resolution: 1920x1080 (matches video resolution)
- Contains zone overlays for:
  - Entrance
  - Cash Counter
  - Fragrance Unit
  - Makeup Unit
  - Brand Zones (15+ brands)

### 3. Transactions Directory (`dataset/transactions/`)

Contains POS transaction data for correlation with video analytics.

**Files:**
- `pos_transactions.csv` - Point of Sale transaction records

**CSV Schema:**
```
order_id,invoice_number,store_id,store_name,customer_number,product_name,brand_name,qty,GMV,NMV,salesperson_name,transaction_timestamp
```

**Fields:**
- `order_id`: Unique order identifier
- `invoice_number`: Invoice reference number
- `store_id`: Store identifier
- `store_name`: Store name
- `customer_number`: Customer ID
- `product_name`: Product name
- `brand_name`: Brand name (EBT, FSG, VD, Derm, Minimalist, Aqualogica, Pilgrim, D&K, Maybelline, Faces, Lakme, Swiss, Mars, GoodLore, Beauty3)
- `qty`: Quantity purchased
- `GMV`: Gross Merchandise Value
- `NMV`: Net Merchandise Value
- `salesperson_name`: Sales representative name
- `transaction_timestamp`: Transaction date and time

## Store Layout Zones

### Primary Zones

1. **Entrance** (ZONE_ENTRANCE)
   - Location: Store entrance area
   - Coordinates: (0, 0) to (300, 200)
   - Purpose: Customer entry tracking

2. **Cash Counter** (ZONE_COUNTER)
   - Location: Billing area
   - Coordinates: (1600, 800) to (1920, 1080)
   - Purpose: Transaction monitoring

3. **Fragrance Unit** (ZONE_FRAGRANCE)
   - Location: Fragrance section
   - Coordinates: (300, 200) to (800, 600)
   - Purpose: Product category tracking

4. **Makeup Unit** (ZONE_MAKEUP)
   - Location: Makeup section
   - Coordinates: (800, 200) to (1300, 600)
   - Purpose: Product category tracking

### Brand Zones (15 Brands)

Each brand has a dedicated zone for tracking customer interactions:

1. **EBT** (ZONE_BRAND_EBT) - Coordinates: (300, 600) to (600, 900)
2. **FSG** (ZONE_BRAND_FSG) - Coordinates: (600, 600) to (900, 900)
3. **VD** (ZONE_BRAND_VD) - Coordinates: (900, 600) to (1200, 900)
4. **Derm** (ZONE_BRAND_DERM) - Coordinates: (1200, 600) to (1500, 900)
5. **Minimalist** (ZONE_BRAND_MINIMALIST) - Coordinates: (1500, 600) to (1800, 900)
6. **Aqualogica** (ZONE_BRAND_AQUALOGICA) - Coordinates: (300, 900) to (600, 1080)
7. **Pilgrim** (ZONE_BRAND_PILGRIM) - Coordinates: (600, 900) to (900, 1080)
8. **D&K** (ZONE_BRAND_DK) - Coordinates: (900, 900) to (1200, 1080)
9. **Maybelline** (ZONE_BRAND_MAYBELLINE) - Coordinates: (1200, 900) to (1500, 1080)
10. **Faces** (ZONE_BRAND_FACES) - Coordinates: (1500, 900) to (1800, 1080)
11. **Lakme** (ZONE_BRAND_LAKME) - Coordinates: (1300, 200) to (1600, 600)
12. **Swiss** (ZONE_BRAND_SWISS) - Coordinates: (1600, 200) to (1920, 600)
13. **Mars** (ZONE_BRAND_MARS) - Coordinates: (1800, 600) to (1920, 800)
14. **GoodLore** (ZONE_BRAND_GOODLORE) - Coordinates: (1300, 600) to (1600, 800)
15. **Beauty3** (ZONE_BRAND_BEAUTY3) - Coordinates: (1600, 600) to (1800, 800)

## Camera Registry

### Camera Specifications

Each camera is registered with the following information:

- **Camera ID**: Unique identifier (CAM1-CAM5)
- **Camera Name**: Descriptive name
- **Camera Location**: Physical location in store
- **Status**: active, inactive, or offline
- **Stream Type**: rtsp, http, file, or mock
- **Stream URL**: Connection URL (if applicable)

### Default Cameras

1. **CAM1** - Entrance Camera
2. **CAM2** - Main Floor Camera
3. **CAM3** - Fragrance Section Camera
4. **CAM4** - Makeup Section Camera
5. **CAM5** - Cash Counter Camera

## Dataset Registration

### Dataset Model

Each video dataset is registered with:

- **Dataset ID**: Unique identifier
- **Camera ID**: Associated camera
- **File Name**: Video file name
- **File Path**: Full path to video file
- **Status**: pending, registered, processing, completed, or failed
- **Duration**: Video duration in seconds
- **FPS**: Frames per second
- **Resolution**: Video resolution (e.g., 1920x1080)
- **File Size**: File size in bytes

### Status Lifecycle

1. **pending** - Dataset awaiting registration
2. **registered** - Dataset successfully registered
3. **processing** - Dataset being processed by AI service
4. **completed** - Processing completed successfully
5. **failed** - Processing failed

## API Endpoints

### Dataset APIs

- `GET /api/datasets` - Get all datasets
- `GET /api/datasets/:id` - Get specific dataset
- `GET /api/datasets/stats/summary` - Get dataset statistics

### Camera APIs

- `GET /api/cameras` - Get all cameras
- `GET /api/cameras/:id` - Get specific camera

### Store Layout APIs

- `GET /api/store-layout` - Get layout summary
- `GET /api/store-layout/zones/all` - Get all zones
- `GET /api/store-layout/zones/:id` - Get specific zone
- `GET /api/store-layout/type/:type` - Get zones by type
- `GET /api/store-layout/brand/:brandName` - Get zone by brand
- `GET /api/store-layout/brands/all` - Get all brand zones

## Data Flow

```
Videos (CAM1-5)
    ↓
Dataset Registration
    ↓
Store Layout Mapping
    ↓
Zone-based Analysis
    ↓
POS Transaction Correlation
    ↓
Analytics & Insights
```

## Future Enhancements

- Multi-resolution video support
- Dynamic zone configuration
- Real-time stream ingestion
- Batch dataset processing
- Dataset versioning and archival
