CREATE TABLE [dbo].[User] (
    [Id]           INT             IDENTITY (1, 1) NOT NULL,
    [FirstName]    NVARCHAR (50)   NOT NULL,
    [LastName]     NVARCHAR (50)   NOT NULL,
    [Gender]       BIT             NULL,
    [BirthYear]    INT             NULL,
    [Picture]      VARBINARY (MAX) NULL,
    [IsSaved]      BIT             NULL,
    [IsBaptized]   BIT             NULL,
    [MiddleName]   NVARCHAR (50)   NULL,
    [Notes]        NVARCHAR (MAX)  NULL,
    [Email]        NVARCHAR (50)   NULL,
    [PhoneNumber]  NVARCHAR (50)   NULL,
    [OtherNumber]  NVARCHAR (50)   NULL,
    [Address]      NVARCHAR (50)   NULL,
    [City]         NVARCHAR (50)   NULL,
    [ZipCode]      NVARCHAR (50)   NULL,
    [BaptizedDate] DATETIME        NULL,
    [SavedDate]    DATETIME        NULL,
    [Locality]     NVARCHAR (100)  NULL,
    [DateCreated]  DATETIME        NULL,
    [LastUpdated]  DATETIME        NULL,
    [LastEditedBy] INT             NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_User_User] FOREIGN KEY ([LastEditedBy]) REFERENCES [dbo].[User] ([Id])
);







