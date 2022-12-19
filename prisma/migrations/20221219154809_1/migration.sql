/*
  Warnings:

  - Made the column `handle` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "handle" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_id_fkey" FOREIGN KEY ("id") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
