CREATE TABLE [dbo].[User] (
    [Id]            INT             IDENTITY (1, 1) NOT NULL,
    [FirstName]     NVARCHAR (50)   NOT NULL,
    [LastName]      NVARCHAR (50)   NOT NULL,
    [Gender]        BIT             NULL,
    [BirthYear]     INT             NULL,
    [Picture]       VARBINARY (MAX) NULL,
    [IsSaved]       BIT             NULL,
    [IsBaptized]    BIT             NULL,
    [MiddleName]    NVARCHAR (50)   NULL,
    [Notes]         NVARCHAR (MAX)  NULL,
    [BaptizedDate]  DATETIME        NULL,
    [SavedDate]     DATETIME        NULL,
    [AddressId]     INT             NULL,
    [ContactInfoId] INT             NULL,
    [LocalityId]    INT             NULL,
    [DateCreated]   DATETIME        NULL,
    [LastUpdated]   DATETIME        NULL,
    [LastEditedBy]  INT             NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_User_Address] FOREIGN KEY ([AddressId]) REFERENCES [dbo].[Address] ([Id]),
    CONSTRAINT [FK_User_ContactInfo] FOREIGN KEY ([ContactInfoId]) REFERENCES [dbo].[ContactInfo] ([Id]),
    CONSTRAINT [FK_User_Locality] FOREIGN KEY ([LocalityId]) REFERENCES [dbo].[Locality] ([Id]),
    CONSTRAINT [FK_User_User] FOREIGN KEY ([LastEditedBy]) REFERENCES [dbo].[User] ([Id])
);









