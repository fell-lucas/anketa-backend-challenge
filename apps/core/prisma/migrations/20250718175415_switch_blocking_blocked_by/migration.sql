-- AlterTable
ALTER TABLE "_ChannelToPost" ADD CONSTRAINT "_ChannelToPost_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ChannelToPost_AB_unique";

-- AlterTable
ALTER TABLE "_ChannelToUser" ADD CONSTRAINT "_ChannelToUser_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ChannelToUser_AB_unique";

-- AlterTable
ALTER TABLE "_CircleToPost" ADD CONSTRAINT "_CircleToPost_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_CircleToPost_AB_unique";

-- AlterTable
ALTER TABLE "_PollOptionMedia" ADD CONSTRAINT "_PollOptionMedia_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_PollOptionMedia_AB_unique";

-- AlterTable
ALTER TABLE "_PostMedia" ADD CONSTRAINT "_PostMedia_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_PostMedia_AB_unique";
