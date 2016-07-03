CREATE TABLE [dbo].[Address] (
    [Id]           INT            IDENTITY (1, 1) NOT NULL,
    [AddressLine1] NVARCHAR (50)  NULL,
    [AddressLine2] NVARCHAR (50)  NULL,
    [City]         NVARCHAR (25)  NULL,
    [ZipCode]      NVARCHAR (15)  NULL,
    [Country]      INT            NULL,
    [Notes]        NVARCHAR (300) NULL,
    [DateCreated]  DATETIME       NULL,
    [LastUpdated]  DATETIME       NULL,
    [LastEditedBy] INT            NULL,
    CONSTRAINT [PK_Address] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Address_User] FOREIGN KEY ([LastEditedBy]) REFERENCES [dbo].[User] ([Id])
);

