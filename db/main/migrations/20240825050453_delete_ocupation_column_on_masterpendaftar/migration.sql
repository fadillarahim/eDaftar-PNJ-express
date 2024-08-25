/*
  Warnings:

  - You are about to drop the column `occupation` on the `master_pendaftar` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [master].[master_pendaftar] DROP COLUMN [occupation];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
