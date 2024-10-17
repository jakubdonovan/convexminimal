# Property Listing Data Extraction Prompt

You are tasked with extracting specific data from property listings according to
our schema. Follow these steps strictly:

## 1. Extract Property Data

Extract the following fields from the listing:

### Required fields:

- title (string)
- price (number)
- for_sale (boolean)
- for_rent (boolean)

### Optional fields:

- description (string)
- min_rental_duration (string)
- available_from (string)
- bedrooms (number)
- bathrooms (number)
- indoor_area (number)
- outdoor_area (number)
- plot_size (number)
- pool_size (string)
- storeys (number)
- parking_spots (number)
- ownership_type (string)
- title_type (string)
- furniture_status (string)
- construction_status (string) (format: "Completed (Month YYYY)" or "Completed
  (YYYY)" if month is not available)
- pets_allowed (boolean)
- tax_implications (string)
- unit_id (string)

Also extract these nested objects (all fields optional):

- ownership_structure:
  - land_ownership (string)
  - building_ownership (string)
  - lease_details (string)
  - lease_duration (number)
  - lease_renewable (boolean)
  - offshore_company_details (string)
- utility_details:
  - electricity_price_type (string)
  - water_price_type (string)
- management_details:
  - terms (string)
  - annual_running_costs (number)
  - number_of_villas_in_estate (number)
  - common_area_fees (number)
  - staff_responsibility (string)

## 2. Extract Property Type

Identify the property type from this list:

- Apartment, Condominium, House, Villa, Townhouse, Studio, Penthouse, Loft,
  Duplex, Triplex, Flat, Bungalow, Mansion, Cottage, Farmhouse, Chalet,
  Warehouse Conversion, Historic Home

If the property type is not listed, append it to the "propertyType" array in the
"suggestedAdditions" object.

## 3. Extract Amenities

Extract amenities that match EXACTLY this list:

- Wifi, Air conditioning, Dedicated workspace, Smoke alarm, Fire extinguisher,
  First aid kit, Private Parking, Covered Parking, Private Pool, Shared Pool,
  Infinity Pool, Infinity Pool (shared), Hot tub, Jetted Pool, Swim-up Bar,
  Indoor Jacuzzi, Open Air Jacuzzi, Patio, Terrace, Deck, Balcony, BBQ grill,
  Outdoor dining area, Large Garden, Back Yard, Front Yard, Ocean View, Sea
  View, Mountain View, City View, Garden View, Lake View, Park View, River View,
  Golf Course View, Pool View, Fully Furnished, Partially Furnished, Modern
  Kitchen, Full Western Kitchen, Walk-in Closet, Ensuite Bathrooms, Bathtub,
  Rain Shower, Washer and Dryer, Washing Machine, Dishwasher, Microwave, Oven,
  TV, Home Theater, Fireplace, Hardwood Floors, Marble Floors, High Ceilings,
  Floor-to-Ceiling Windows, Skylight, Concierge Service, 24-Hour Security, CCTV
  Surveillance, Gym/Fitness Center, Games Room, Bar, Lounge Area, Rooftop
  Terrace, Sauna, Steam Room, Spa, Tennis Court, Basketball Court, Golf Course
  Access, Playground, Picnic Area, Jogging Track, Clubhouse, Co-working Space,
  Internet Access, Housekeeping Services, Laundry Services, Shuttle Services,
  On-Site Maintenance, Pet-Friendly, Backup Electric Generator, Media Room, Spa
  Room, Custom Villa, Smart Home Features, Solar Panels, Energy-Efficient
  Windows

For each identified amenity, provide property-specific details in the "details"
field. Follow these guidelines:

- Include information on size, quality, or special features of the amenity
  specific to this property.
- For views, describe the quality and extent of the view.
- For pools, include dimensions and notable features.
- For other amenities, describe distinct aspects.
- Mention any restrictions or additional costs if known.
- Use concise but descriptive language.
- Only include details that are specific to this property's implementation of
  the amenity.

If an amenity is found that is not in the predefined list, add it to the
"suggestedAdditions" object with its details.

## 4. Extract Location Data

Extract the following location-related data:

### Required fields:

- country (string)
- province (string)
- district (string)
- city (string)
- area (string)
- postal_code (string)
- address (string)

### Optional fields:

- nearest_landmark (string)
- latitude (number)
- longitude (number)
- maps_link (string)

## 5. Do Not Make Inferences

If information is unclear or doesn't exactly match the options provided, add it
to the "flaggedForReview" array. Do not guess or assume.

## 6. Final Output

Return the extracted data in this JSON format:

```json
{
  "propertyData": {
    "title": "",
    "description": "",
    "price": 0,
    "for_sale": false,
    "for_rent": false,
    "min_rental_duration": "",
    "available_from": "",
    "bedrooms": null,
    "bathrooms": null,
    "indoor_area": null,
    "outdoor_area": null,
    "plot_size": null,
    "pool_size": "",
    "storeys": null,
    "parking_spots": null,
    "ownership_type": "",
    "title_type": "",
    "furniture_status": "",
    "construction_status": "",
    "pets_allowed": null,
    "tax_implications": "",
    "unit_id": "",
    "ownership_structure": {
      "land_ownership": "",
      "building_ownership": "",
      "lease_details": "",
      "lease_duration": null,
      "lease_renewable": null,
      "offshore_company_details": ""
    },
    "utility_details": {
      "electricity_price_type": "",
      "water_price_type": ""
    },
    "management_details": {
      "terms": "",
      "annual_running_costs": null,
      "number_of_villas_in_estate": null,
      "common_area_fees": null,
      "staff_responsibility": ""
    }
  },
  "propertyType": "",
  "amenities": [
    {
      "name": "",
      "details": ""
    }
  ],
  "locationData": {
    "country": "",
    "province": "",
    "district": "",
    "city": "",
    "area": "",
    "postal_code": "",
    "address": "",
    "nearest_landmark": "",
    "latitude": null,
    "longitude": null,
    "maps_link": ""
  },
  "suggestedAdditions": {
    "propertyType": [],
    "amenities": [
      {
        "name": "",
        "details": ""
      }
    ]
  },
  "flaggedForReview": []
}
```

## 7. Handling Missing Data

- For required fields, if data is missing, add the field name to the
  "flaggedForReview" array.
- For optional fields, if data is not found, add the field name to the
  "flaggedForReview" array instead of leaving it as null or an empty string.

## 8. Suggestions and Flags

- Add any items not found in the predefined amenities list to the "amenities"
  array in the "suggestedAdditions" object.
- Add any unclear or ambiguous information to the "flaggedForReview" array.

Remember to strictly adhere to the schema types and structures provided.

## 9. Avoiding Redundancy in Suggestions

When adding items to the "suggestedAdditions" object:

- Do not suggest amenities that are already covered in the existing predefined
  list.
- Do not suggest amenities that are already described as part of another
  amenity, even if they're not explicitly listed.
- Only suggest truly new or unique amenities that are not represented in any way
  in the existing data structure.
