BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [master].[master_religion] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [master_religion_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [master].[master_pendaftar] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nationalIdNumber] NVARCHAR(1000) NOT NULL,
    [fullName] NVARCHAR(1000) NOT NULL,
    [idCardAddress] NVARCHAR(1000) NOT NULL,
    [currentAddress] NVARCHAR(1000) NOT NULL,
    [provinceIdAddress] NVARCHAR(1000) NOT NULL,
    [provinceNameAddress] NVARCHAR(1000) NOT NULL,
    [cityIdAddress] NVARCHAR(1000) NOT NULL,
    [cityNameAddress] NVARCHAR(1000) NOT NULL,
    [districtIdAddress] NVARCHAR(1000) NOT NULL,
    [districtNameAddress] NVARCHAR(1000) NOT NULL,
    [citizenship] NVARCHAR(1000) NOT NULL,
    [foreignCountry] NVARCHAR(1000),
    [placeOfBirth] NVARCHAR(1000) NOT NULL,
    [birthProvinceId] NVARCHAR(1000),
    [birthProvinceName] NVARCHAR(1000),
    [birthCityId] NVARCHAR(1000),
    [birthCityName] NVARCHAR(1000) NOT NULL,
    [bornAbroad] BIT,
    [birthCountry] NVARCHAR(1000),
    [dateOfBirth] DATETIME2 NOT NULL,
    [gender] NVARCHAR(1000) NOT NULL,
    [religionId] INT NOT NULL,
    [maritalStatus] NVARCHAR(1000) NOT NULL,
    [occupation] NVARCHAR(1000) NOT NULL,
    [phoneNumber] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [master_pendaftar_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [createdBy] NVARCHAR(1000),
    [updatedAt] DATETIME2,
    [updatedBy] NVARCHAR(1000),
    CONSTRAINT [master_pendaftar_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [master].[master_pendaftar] ADD CONSTRAINT [master_pendaftar_religionId_fkey] FOREIGN KEY ([religionId]) REFERENCES [master].[master_religion]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
