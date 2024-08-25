BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [master].[master_user] (
    [id] INT NOT NULL IDENTITY(1,1),
    [username] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000),
    [roleId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [master_user_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [createdBy] NVARCHAR(1000),
    [updatedAt] DATETIME2,
    [updatedBy] NVARCHAR(1000),
    [status] BIT CONSTRAINT [master_user_status_df] DEFAULT 1,
    CONSTRAINT [master_user_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [master_user_username_key] UNIQUE NONCLUSTERED ([username])
);

-- CreateTable
CREATE TABLE [master].[master_role] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [isAdmin] BIT CONSTRAINT [master_role_isAdmin_df] DEFAULT 0,
    [createdAt] DATETIME2 CONSTRAINT [master_role_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [createdBy] NVARCHAR(1000),
    [status] BIT CONSTRAINT [master_role_status_df] DEFAULT 1,
    CONSTRAINT [master_role_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [master_role_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [master].[master_permission] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [master_permission_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [master_permission_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [master].[role_permission_map] (
    [id] INT NOT NULL IDENTITY(1,1),
    [roleId] INT NOT NULL,
    [permissionId] INT NOT NULL,
    CONSTRAINT [role_permission_map_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [role_permission_map_roleId_permissionId_key] UNIQUE NONCLUSTERED ([roleId],[permissionId])
);

-- AddForeignKey
ALTER TABLE [master].[master_user] ADD CONSTRAINT [master_user_roleId_fkey] FOREIGN KEY ([roleId]) REFERENCES [master].[master_role]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [master].[role_permission_map] ADD CONSTRAINT [role_permission_map_permissionId_fkey] FOREIGN KEY ([permissionId]) REFERENCES [master].[master_permission]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [master].[role_permission_map] ADD CONSTRAINT [role_permission_map_roleId_fkey] FOREIGN KEY ([roleId]) REFERENCES [master].[master_role]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
