CREATE TABLE [dbo].[Meeting] (
    [Id]           INT            NULL,
    [MeetingName]  NVARCHAR (100) NOT NULL,
    [MeetingType]  INT            NOT NULL,
    [DayOfTheWeek] INT            NULL,
    [Description]  NVARCHAR (MAX) NULL,
    [UsualTime]    DATETIME       NULL
);



