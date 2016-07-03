CREATE TABLE [dbo].[Meeting] (
    [Id]            INT            IDENTITY (1, 1) NOT NULL,
    [Name]          NVARCHAR (100) NOT NULL,
    [MeetingTypeId] INT            NOT NULL,
    [DayOfTheWeek]  INT            NULL,
    [LeadUserId]    INT            NULL,
    [AddressId]     INT            NULL,
    [ContactInfoId] INT            NULL,
    [Notes]         NVARCHAR (MAX) NULL,
    [UsualTime]     DATETIME       NULL,
    [DateCreated]   DATETIME       NULL,
    [LastUpdated]   DATETIME       NULL,
    [LastEditedBy]  INT            NULL,
    CONSTRAINT [PK_Meetings] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Meeting_Address] FOREIGN KEY ([AddressId]) REFERENCES [dbo].[Address] ([Id]),
    CONSTRAINT [FK_Meeting_ContactInfo] FOREIGN KEY ([ContactInfoId]) REFERENCES [dbo].[ContactInfo] ([Id]),
    CONSTRAINT [FK_Meeting_MeetingType] FOREIGN KEY ([MeetingTypeId]) REFERENCES [dbo].[MeetingType] ([Id]),
    CONSTRAINT [FK_Meeting_User] FOREIGN KEY ([LeadUserId]) REFERENCES [dbo].[User] ([Id]),
    CONSTRAINT [FK_Meeting_User1] FOREIGN KEY ([LastEditedBy]) REFERENCES [dbo].[User] ([Id])
);






GO
CREATE NONCLUSTERED INDEX [IX_FK_Meeting_MeetingType]
    ON [dbo].[Meeting]([MeetingTypeId] ASC);

