-- AlterTable
ALTER TABLE "polls" ADD COLUMN     "section_id" UUID;

-- AddForeignKey
ALTER TABLE "polls" ADD CONSTRAINT "polls_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "post_sections"("id") ON DELETE SET NULL ON UPDATE CASCADE;
