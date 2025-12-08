-- CreateEnum
CREATE TYPE "FollowStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "UserVisibilityEnum" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "follows" ADD COLUMN     "status" "FollowStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "visibility" "UserVisibilityEnum" DEFAULT 'PUBLIC';
