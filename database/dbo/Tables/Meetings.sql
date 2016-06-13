﻿CREATE TABLE [dbo].[Meetings] (
    [Id]            INT            IDENTITY (1, 1) NOT NULL,
    [Name]          NVARCHAR (100) NOT NULL,
    [MeetingTypeId] INT            NOT NULL,
    [DayOfTheWeek]  INT            NULL,
    [Description]   NVARCHAR (MAX) NULL,
    [UsualTime]     DATETIME       NULL,
    CONSTRAINT [PK_Meetings] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Meeting_MeetingType] FOREIGN KEY ([MeetingTypeId]) REFERENCES [dbo].[MeetingTypes] ([Id])
);


GO
CREATE NONCLUSTERED INDEX [IX_FK_Meeting_MeetingType]
    ON [dbo].[Meetings]([MeetingTypeId] ASC);
