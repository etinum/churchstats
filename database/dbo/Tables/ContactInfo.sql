CREATE TABLE [dbo].[ContactInfo] (
    [Id]           INT            IDENTITY (1, 1) NOT NULL,
    [Email1]       NVARCHAR (30)  NULL,
    [Email2]       NVARCHAR (30)  NULL,
    [CellPhone]    NVARCHAR (20)  NULL,
    [HomePhone]    NVARCHAR (20)  NULL,
    [WorkPhone]    NVARCHAR (20)  NULL,
    [Notes]        NVARCHAR (300) NULL,
    [DateCreated]  DATETIME       NULL,
    [LastUpdated]  DATETIME       NULL,
    [LastEditedBy] INT            NULL,
    CONSTRAINT [PK_ContactInfo] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_ContactInfo_User] FOREIGN KEY ([LastEditedBy]) REFERENCES [dbo].[User] ([Id])
);

