-- CreateEnum
CREATE TYPE "LinkResponseType" AS ENUM ('NONE', 'SECTION', 'POLL');

-- AlterTable
ALTER TABLE "polls" ADD COLUMN     "add_open_ended_option" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "link_response_poll_id" UUID,
ADD COLUMN     "link_response_section_id" UUID,
ADD COLUMN     "link_response_type" "LinkResponseType" DEFAULT 'NONE',
ADD COLUMN     "mark_as_optional_question" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "has_multiple_answers" SET DEFAULT false;

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "restrict_access_to_analytics" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "post_sections" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "post_id" UUID NOT NULL,

    CONSTRAINT "post_sections_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "polls" ADD CONSTRAINT "polls_link_response_section_id_fkey" FOREIGN KEY ("link_response_section_id") REFERENCES "post_sections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "polls" ADD CONSTRAINT "polls_link_response_poll_id_fkey" FOREIGN KEY ("link_response_poll_id") REFERENCES "polls"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_sections" ADD CONSTRAINT "post_sections_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
