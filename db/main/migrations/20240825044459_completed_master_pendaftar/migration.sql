/*
  Warnings:

  - Added the required column `telephoneNumber` to the `master_pendaftar` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [master].[master_pendaftar] ADD [status] NVARCHAR(1000) NOT NULL CONSTRAINT [master_pendaftar_status_df] DEFAULT 'DRAFT',
[telephoneNumber] NVARCHAR(1000) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
