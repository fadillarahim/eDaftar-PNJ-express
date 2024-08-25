/*
  Warnings:

  - You are about to drop the `master_kabupaten` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [master].[master_kabupaten] DROP CONSTRAINT [master_kabupaten_provinsiId_fkey];

-- DropTable
DROP TABLE [master].[master_kabupaten];

-- CreateTable
CREATE TABLE [master].[master_kabupaten_kota] (
    [id] INT NOT NULL IDENTITY(1,1),
    [provinsiId] INT NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [master_kabupaten_kota_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [master].[master_kabupaten_kota] ADD CONSTRAINT [master_kabupaten_kota_provinsiId_fkey] FOREIGN KEY ([provinsiId]) REFERENCES [master].[master_provinsi]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
