-- AlterTable
ALTER TABLE "media" ADD COLUMN     "alt_text" VARCHAR(255),
ADD COLUMN     "description" TEXT,
ALTER COLUMN "asset_type" DROP NOT NULL,
ALTER COLUMN "format" DROP NOT NULL,
ALTER COLUMN "size_in_bytes" DROP NOT NULL;
