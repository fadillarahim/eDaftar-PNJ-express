/*
  Warnings:

  - Added the required column `agama` to the `pendaftar_rekap_nilai_map` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ipa` to the `pendaftar_rekap_nilai_map` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ips` to the `pendaftar_rekap_nilai_map` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [master].[pendaftar_rekap_nilai_map] ADD [agama] FLOAT(53) NOT NULL,
[ipa] FLOAT(53) NOT NULL,
[ips] FLOAT(53) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
