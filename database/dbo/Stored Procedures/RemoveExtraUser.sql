-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE RemoveExtraUser 
	-- Add the parameters for the stored procedure here
    @UserIdToRemove INT ,
    @UserIdToReplace INT = 201
AS
    BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
        SET NOCOUNT ON;

    -- Insert statements for procedure here
        BEGIN TRY	
            UPDATE  dbo.X_User_Meeting
            SET     UserId = @UserIdToReplace
            WHERE   UserId = @UserIdToRemove;
        END TRY
        BEGIN CATCH
            PRINT 'error trying to replace in x_user_meeting table -- deleting instead';
            DELETE  FROM dbo.X_User_Meeting
            WHERE   UserId = @UserIdToRemove;
        END CATCH;

        UPDATE  dbo.X_User_Meeting
        SET     UserId = @UserIdToReplace
        WHERE   UserId = @UserIdToRemove;

        UPDATE  dbo.Attendance
        SET     RecorderId = @UserIdToReplace
        WHERE   RecorderId = @UserIdToRemove;
        UPDATE  dbo.Attendance
        SET     UserId = @UserIdToReplace
        WHERE   UserId = @UserIdToRemove;
        DELETE  FROM dbo.[User]
        WHERE   Id = @UserIdToRemove;
	
    END;
DELETE FROM dbo.[User] WHERE id = 283