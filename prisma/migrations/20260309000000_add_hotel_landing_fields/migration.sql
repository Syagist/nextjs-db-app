-- Add new Hotel fields (nullable first to handle existing rows)
ALTER TABLE "Hotel" ADD COLUMN "slug" TEXT;
ALTER TABLE "Hotel" ADD COLUMN "heroImage" TEXT;
ALTER TABLE "Hotel" ADD COLUMN "amenities" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Hotel" ADD COLUMN "contactEmail" TEXT;
ALTER TABLE "Hotel" ADD COLUMN "contactPhone" TEXT;

-- Populate slug from existing name (lowercase, spaces→hyphens, strip non-alphanumeric)
UPDATE "Hotel"
SET "slug" = LOWER(REGEXP_REPLACE(REGEXP_REPLACE("name", '[^a-zA-Z0-9 ]', '', 'g'), '\s+', '-', 'g'));

-- Make slug required and unique
ALTER TABLE "Hotel" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "Hotel_slug_key" ON "Hotel"("slug");

-- HotelImage table
CREATE TABLE "HotelImage" (
    "id" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,

    CONSTRAINT "HotelImage_pkey" PRIMARY KEY ("id")
);

-- Add foreign key
ALTER TABLE "HotelImage" ADD CONSTRAINT "HotelImage_hotelId_fkey"
    FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Room.description column
ALTER TABLE "Room" ADD COLUMN "description" TEXT;

-- MenuItem new columns
ALTER TABLE "MenuItem" ADD COLUMN "description" TEXT;
ALTER TABLE "MenuItem" ADD COLUMN "image" TEXT;
