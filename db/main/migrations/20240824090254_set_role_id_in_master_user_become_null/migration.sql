BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [master].[master_user] DROP CONSTRAINT [master_user_roleId_fkey];

-- AlterTable
ALTER TABLE [master].[master_user] ALTER COLUMN [roleId] INT NULL;

-- AddForeignKey
ALTER TABLE [master].[master_user] ADD CONSTRAINT [master_user_roleId_fkey] FOREIGN KEY ([roleId]) REFERENCES [master].[master_role]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
