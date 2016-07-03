CREATE TABLE [dbo].[Locality] (
    [Id]            INT             IDENTITY (1, 1) NOT NULL,
    [Name]          NVARCHAR (50)   NULL,
    [AddressId]     INT             NULL,
    [ContactInfoId] INT             NULL,
    [Notes]         NVARCHAR (MAX)  NULL,
    [Photo]         VARBINARY (MAX) NULL,
    [DateCreated]   DATETIME        NULL,
    [LastUpdated]   DATETIME        NULL,
    [LastEditedBy]  INT             NULL,
    CONSTRAINT [PK_Locality] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Locality_Address] FOREIGN KEY ([AddressId]) REFERENCES [dbo].[Address] ([Id]),
    CONSTRAINT [FK_Locality_ContactInfo] FOREIGN KEY ([ContactInfoId]) REFERENCES [dbo].[ContactInfo] ([Id]),
    CONSTRAINT [FK_Locality_User] FOREIGN KEY ([LastEditedBy]) REFERENCES [dbo].[User] ([Id])
);

