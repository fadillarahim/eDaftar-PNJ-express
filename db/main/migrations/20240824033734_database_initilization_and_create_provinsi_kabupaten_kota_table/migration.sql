BEGIN TRY

BEGIN TRAN;

-- CreateSchema
EXEC sp_executesql N'CREATE SCHEMA [master];';;

-- CreateTable
CREATE TABLE [master].[master_provinsi] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [master_provinsi_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [master].[master_kabupaten] (
    [id] INT NOT NULL IDENTITY(1,1),
    [provinsiId] INT NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [master_kabupaten_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [master].[master_kabupaten] ADD CONSTRAINT [master_kabupaten_provinsiId_fkey] FOREIGN KEY ([provinsiId]) REFERENCES [master].[master_provinsi]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
