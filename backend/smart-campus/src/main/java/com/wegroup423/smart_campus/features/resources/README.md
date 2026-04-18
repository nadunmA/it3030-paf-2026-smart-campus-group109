# Resources Feature Folder Structure

This folder contains all files related to the Facilities & Assets Catalogue feature.

## Folder Organization

```
backend/smart-campus/src/main/java/com/wegroup423/smart_campus/features/resources/
├── controller/
│   ├── PublicResourceController.java    (Public QR/resource lookups)
│   └── ResourceApiController.java       (Admin resource management)
├── service/
│   ├── ResourceService.java             (Service interface)
│   └── impl/
│       └── ResourceServiceImpl.java      (Implementation - kept in admin for now)
├── repository/
│   └── ResourceRepository.java          (MongoDB data access)
└── model/
    ├── entity/
    │   └── Resource.java                (Resource entity)
    └── dto/
        ├── request/
        │   ├── CreateResourceRequest.java
        │   └── UpdateResourceRequest.java
        └── response/
            └── ResourceResponse.java
```

## Key Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/public/resources/{id}` | GET | None | Get resource by ID (public) |
| `/api/public/resources/lookup?qrCode=` | GET | None | Lookup resource by QR code (public) |
| `/api/resources` | GET | ADMIN/USER/TECHNICIAN | Search resources |
| `/api/resources` | POST | ADMIN | Create new resource |
| `/api/resources/{id}` | GET | ADMIN/USER/TECHNICIAN | Get resource details |
| `/api/resources/{id}` | PUT | ADMIN | Update resource |
| `/api/resources/{id}` | DELETE | ADMIN | Delete resource |
| `/api/resources/{id}/status` | PATCH | ADMIN | Update resource status |
| `/api/resources/export/csv` | GET | ADMIN | Export resources as CSV |

## Implementation Notes

- **No conflicts**: Original files remain in `admin/` and `publicapi/` folders for backward compatibility
- **QR Code**: Resources have unique QR codes for public lookups
- **Frontend Integration**: QR codes are generated locally using the `qrcode` package and contain resource URLs
- **Fallback Lookup**: If QR lookup fails, system tries lookup by resource ID (Mongo ID pattern)
- **Security**: Public endpoints require no authentication; admin endpoints protected with role-based access

## Service Implementation

The actual service implementation (`ResourceServiceImpl`) handles:
- Resource creation with QR code generation
- Resource lookup by ID or QR code
- Search and filtering by type, location, capacity
- CSV export for reporting
- Resource status management
