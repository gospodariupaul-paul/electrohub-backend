/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropIndex
DROP INDEX "Category_name_key";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "description" TEXT,
ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "description" TEXT,
ADD COLUMN     "images" TEXT[],
ALTER COLUMN "stock" SET DEFAULT 0,
ALTER COLUMN "categoryId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "refreshToken",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "imageUrl" TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user',
ALTER COLUMN "name" SET NOT NULL;

-- DropEnum
DROP TYPE "Role";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
