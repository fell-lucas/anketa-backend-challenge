-- CreateTable
CREATE TABLE "media" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "display_name" VARCHAR(255) NOT NULL,
    "public_id" VARCHAR(255) NOT NULL,
    "asset_type" VARCHAR(50) NOT NULL,
    "format" VARCHAR(50) NOT NULL,
    "resource_type" VARCHAR(50) NOT NULL,
    "secure_url" TEXT NOT NULL,
    "size_in_bytes" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "duration" DOUBLE PRECISION,
    "metadata" JSONB,
    "user_id" UUID NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
