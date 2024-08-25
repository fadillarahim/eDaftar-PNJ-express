BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [master].[pendaftar_rekap_nilai_map] ADD [createdAt] DATETIME2 NOT NULL CONSTRAINT [pendaftar_rekap_nilai_map_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
[createdBy] NVARCHAR(1000),
[updatedAt] DATETIME2,
[updatedBy] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
