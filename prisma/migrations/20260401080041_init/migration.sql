-- DropForeignKey
ALTER TABLE "HotelImage" DROP CONSTRAINT "HotelImage_hotelId_fkey";

-- AlterTable
ALTER TABLE "Hotel" ALTER COLUMN "amenities" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "HotelImage" ADD CONSTRAINT "HotelImage_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
