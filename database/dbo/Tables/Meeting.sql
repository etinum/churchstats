CREATE TABLE [dbo].[Meeting] (
    [Id]           INT            NOT NULL,
    [MeetingName]  NVARCHAR (100) NOT NULL,
    [MeetingType]  INT            NOT NULL,
    [DayOfTheWeek] INT            NULL,
    [Description]  NVARCHAR (MAX) NULL,
    [UsualTime]    DATETIME       NULL,
    CONSTRAINT [PK_Meeting] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Meeting_MeetingType] FOREIGN KEY ([MeetingType]) REFERENCES [dbo].[MeetingType] ([Id])
);





