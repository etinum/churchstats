CREATE TABLE [dbo].[Meeting] (
    [Id]            INT            IDENTITY (1, 1) NOT NULL,
    [Name]          NVARCHAR (100) NOT NULL,
    [MeetingTypeId] INT            NOT NULL,
    [DayOfTheWeek]  INT            NULL,
    [Description]   NVARCHAR (MAX) NULL,
    [UsualTime]     DATETIME       NULL,
    CONSTRAINT [PK_Meeting] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Meeting_MeetingType] FOREIGN KEY ([MeetingTypeId]) REFERENCES [dbo].[MeetingType] ([Id])
);









