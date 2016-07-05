CREATE TABLE [dbo].[ContactInfo] (
    [Id]           INT            IDENTITY (1, 1) NOT NULL,
    [Email1]       NVARCHAR (50)  NULL,
    [Email2]       NVARCHAR (50)  NULL,
    [CellPhone]    NVARCHAR (50)  NULL,
    [HomePhone]    NVARCHAR (50)  NULL,
    [WorkPhone]    NVARCHAR (50)  NULL,
    [Notes]        NVARCHAR (300) NULL,
    [DateCreated]  DATETIME       NULL,
    [LastUpdated]  DATETIME       NULL,
    [LastEditedBy] INT            NULL,
    CONSTRAINT [PK_ContactInfo] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_ContactInfo_User] FOREIGN KEY ([LastEditedBy]) REFERENCES [dbo].[User] ([Id])
);



