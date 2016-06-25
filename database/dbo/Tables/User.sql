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
    [BaptizedDate] DATETIME        NULL,
    [SavedDate]    DATETIME        NULL,
    [Locality]     NVARCHAR (100)  NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC)
);



