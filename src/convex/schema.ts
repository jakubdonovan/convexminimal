import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const propertyTypeFields = {
  name: v.union(
    v.literal("Apartment"),
    v.literal("Condominium"),
    v.literal("House"),
    v.literal("Villa"),
    v.literal("Townhouse"),
    v.literal("Studio"),
    v.literal("Penthouse"),
    v.literal("Loft"),
    v.literal("Duplex"),
    v.literal("Triplex"),
    v.literal("Flat"),
    v.literal("Bungalow"),
    v.literal("Mansion"),
    v.literal("Cottage"),
    v.literal("Farmhouse"),
    v.literal("Chalet"),
    v.literal("Warehouse Conversion"),
    v.literal("Historic Home"),
  ),
};

export const propertyAmenitiesFields = {
  name: v.union(
    // Essential amenities (Airbnb-style)
    v.literal("Wifi"),
    v.literal("Air conditioning"),
    v.literal("Dedicated workspace"),
    v.literal("Smoke alarm"),
    v.literal("Fire extinguisher"),
    v.literal("First aid kit"),
    // Parking
    v.literal("Private Parking"),
    v.literal("Covered Parking"),
    // Pools and Hot Tubs
    v.literal("Private Pool"),
    v.literal("Shared Pool"),
    v.literal("Infinity Pool"),
    v.literal("Infinity Pool (shared)"),
    v.literal("Hot tub"),
    v.literal("Jetted Pool"),
    v.literal("Swim-up Bar"),
    v.literal("Indoor Jacuzzi"),
    v.literal("Open Air Jacuzzi"),
    // Outdoor areas
    v.literal("Patio"),
    v.literal("Terrace"),
    v.literal("Deck"),
    v.literal("Balcony"),
    v.literal("BBQ grill"),
    v.literal("Outdoor dining area"),
    v.literal("Large Garden"),
    v.literal("Back Yard"),
    v.literal("Front Yard"),
    // Views
    v.literal("Ocean View"),
    v.literal("Sea View"),
    v.literal("Mountain View"),
    v.literal("City View"),
    v.literal("Garden View"),
    v.literal("Lake View"),
    v.literal("Park View"),
    v.literal("River View"),
    v.literal("Golf Course View"),
    v.literal("Pool View"),
    // Furnishing & Interiors
    v.literal("Fully Furnished"),
    v.literal("Partially Furnished"),
    v.literal("Modern Kitchen"),
    v.literal("Full Western Kitchen"),
    v.literal("Walk-in Closet"),
    v.literal("Ensuite Bathrooms"),
    v.literal("Bathtub"),
    v.literal("Rain Shower"),
    v.literal("Washer and Dryer"),
    v.literal("Washing Machine"),
    v.literal("Dishwasher"),
    v.literal("Microwave"),
    v.literal("Oven"),
    v.literal("TV"),
    v.literal("Home Theater"),
    v.literal("Fireplace"),
    v.literal("Hardwood Floors"),
    v.literal("Marble Floors"),
    v.literal("High Ceilings"),
    v.literal("Floor-to-Ceiling Windows"),
    v.literal("Skylight"),
    // Additional amenities
    v.literal("Concierge Service"),
    v.literal("24-Hour Security"),
    v.literal("CCTV Surveillance"),
    v.literal("Gym/Fitness Center"),
    v.literal("Games Room"),
    v.literal("Bar"),
    v.literal("Lounge Area"),
    v.literal("Rooftop Terrace"),
    v.literal("Sauna"),
    v.literal("Steam Room"),
    v.literal("Spa"),
    v.literal("Tennis Court"),
    v.literal("Basketball Court"),
    v.literal("Golf Course Access"),
    v.literal("Playground"),
    v.literal("Picnic Area"),
    v.literal("Jogging Track"),
    v.literal("Clubhouse"),
    v.literal("Co-working Space"),
    v.literal("Internet Access"),
    v.literal("Housekeeping Services"),
    v.literal("Laundry Services"),
    v.literal("Shuttle Services"),
    v.literal("On-Site Maintenance"),
    v.literal("Pet-Friendly"),
    v.literal("Backup Electric Generator"),
    // Standout features
    v.literal("Media Room"),
    v.literal("Spa Room"),
    v.literal("Custom Villa"),
    v.literal("Smart Home Features"),
    v.literal("Solar Panels"),
    v.literal("Energy-Efficient Windows"),
  ),
  details: v.optional(v.string()),
};

export const propertyAssetsFields = {
  property_id: v.id("properties"),
  asset_url: v.string(),
  asset_blurhash: v.optional(v.string()),
  asset_type: v.union(
    v.literal("document"),
    v.literal("image"),
    v.literal("video"),
  ),
  asset_category: v.union(
    v.literal("property_image"),
    v.literal("floor_plan"),
    v.literal("brochure"),
    v.literal("video"),
    v.literal("other"),
  ),
  is_primary: v.optional(v.boolean()),
  display_order: v.optional(v.number()),
  description: v.optional(v.string()),
};

export default defineSchema({
  properties: defineTable({
    slug: v.string(),
    title: v.string(),
    property_title: v.optional(v.string()),
    description: v.optional(v.string()),
    // relationships
    property_type_id: v.id("property_type_options"),
    property_location_id: v.id("property_locations"),
    // sale and rental details
    for_sale: v.boolean(),
    for_rent: v.boolean(),
    price: v.number(),
    min_rental_duration: v.optional(v.string()),
    available_from: v.optional(v.string()),
    // property details
    bedrooms: v.optional(v.number()),
    bathrooms: v.optional(v.number()),
    indoor_area: v.optional(v.number()),
    outdoor_area: v.optional(v.number()),
    plot_size: v.optional(v.number()),
    // additional property features
    pool_size: v.optional(v.string()),
    storeys: v.optional(v.number()),
    parking_spots: v.optional(v.number()),
    // ownership and legal details
    ownership_type: v.optional(v.string()),
    title_type: v.optional(v.string()),
    ownership_structure: v.optional(
      v.object({
        land_ownership: v.string(),
        building_ownership: v.string(),
        lease_details: v.optional(v.string()),
        lease_duration: v.optional(v.number()),
        lease_renewable: v.optional(v.boolean()),
        offshore_company_details: v.optional(v.string()),
      }),
    ),
    // furniture and construction status
    furniture_status: v.optional(v.string()),
    construction_status: v.optional(v.string()),
    // pets and utilities
    pets_allowed: v.optional(v.boolean()),
    utility_details: v.optional(
      v.object({
        electricity_price_type: v.optional(v.string()),
        water_price_type: v.optional(v.string()),
      }),
    ),
    // property management
    management_details: v.optional(
      v.object({
        terms: v.optional(v.string()),
        annual_running_costs: v.optional(v.number()),
        number_of_villas_in_estate: v.optional(v.number()),
        common_area_fees: v.optional(v.number()),
        staff_responsibility: v.optional(v.string()),
      }),
    ),
    // additional property info
    tax_implications: v.optional(v.string()),
    unit_id: v.optional(v.string()),

    updated_at: v.optional(v.number()),
    // listed_by: v.optional(v.id()),
    // owner_id: v.optional(v.id())
  })
    .index("by_property_type_id", ["property_type_id"])
    .index("by_property_location_id", ["property_location_id"])
    .index("by_for_sale", ["for_sale"])
    .index("by_for_rent", ["for_rent"])
    .index("by_slug", ["slug"])
    .index("by_price", ["price"])
    .index("by_bedrooms", ["bedrooms"])
    .index("by_updated_at", ["updated_at"]),

  property_type_options: defineTable(propertyTypeFields).index("by_name", [
    "name",
  ]),

  amenities: defineTable(propertyAmenitiesFields).index("by_name", ["name"]),

  property_amenities: defineTable({
    amenity_id: v.id("amenities"),
    property_id: v.id("properties"),
    details: v.optional(v.string()),
  })
    .index("by_amenity_id", ["amenity_id"])
    .index("by_property_id", ["property_id"]),

  regions: defineTable({
    country: v.string(),
    province: v.string(),
    district: v.string(),
    city: v.string(),
    area: v.string(),
  })
    .index("by_province", ["province"])
    .index("by_district", ["district"])
    .index("by_city", ["city"])
    .index("by_city_area", ["city", "area"]),

  property_locations: defineTable({
    country: v.string(),
    province: v.string(),
    district: v.string(),
    city: v.string(),
    area: v.string(),
    postal_code: v.string(),
    address: v.string(),
    nearest_landmark: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    maps_link: v.optional(v.string()),
  })
    .index("by_country", ["country"])
    .index("by_province", ["province"])
    .index("by_district", ["district"])
    .index("by_city", ["city"])
    .index("by_city_area", ["city", "area"]),

  property_assets: defineTable(propertyAssetsFields)
    .index("by_property_id", ["property_id"])
    .index("by_asset_type", ["asset_type"])
    .index("by_asset_category", ["property_id", "asset_category"]),
  // users: defineTable({
  // 	email: v.string(),
  // 	first_name: v.optional(v.string()),
  // 	last_name: v.optional(v.string()),
  // 	is_agent: v.optional(v.boolean()),
  // 	phone_number: v.optional(v.string()),
  // 	password_hash: v.string(),
  // 	updated_at: v.optional(v.number())
  // }),
  // bookings: defineTable({
  // 	start_date: v.string(),
  // 	end_date: v.string(),
  // 	status: v.string(),
  // 	total_price: v.number(),
  // 	updated_at: v.optional(v.string()),
  // 	property_id: v.optional(v.id('properties')),
  // 	user_id: v.optional(v.id('users'))
  // })
  // 	.index('by_user_id', ['user_id'])
  // 	.index('by_property_id', ['property_id'])
});
