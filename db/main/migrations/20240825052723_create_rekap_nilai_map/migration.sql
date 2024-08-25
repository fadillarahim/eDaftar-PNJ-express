BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [master].[pendaftar_rekap_nilai_map] (
    [id] INT NOT NULL IDENTITY(1,1),
    [pendaftarId] INT NOT NULL,
    [matematika] FLOAT(53) NOT NULL,
    [bahasaInggris] FLOAT(53) NOT NULL,
    [bahasaIndonesia] FLOAT(53) NOT NULL,
    CONSTRAINT [pendaftar_rekap_nilai_map_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [master].[pendaftar_rekap_nilai_map] ADD CONSTRAINT [pendaftar_rekap_nilai_map_pendaftarId_fkey] FOREIGN KEY ([pendaftarId]) REFERENCES [master].[master_pendaftar]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
