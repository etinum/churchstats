CREATE TABLE [dbo].[User] (
    [Id]           INT             IDENTITY (1, 1) NOT NULL,
    [FirstName]    NVARCHAR (50)   NOT NULL,
    [LastName]     NVARCHAR (50)   NOT NULL,
    [Gender]       NVARCHAR (10)   NULL,
    [BirthYear]    INT             NULL,
    [Picture]      VARBINARY (MAX) NULL,
    [isSaved]      BIT             NULL,
    [isBaptized]   BIT             NULL,
    [MiddleName]   NVARCHAR (50)   NULL,
    [Notes]        NVARCHAR (MAX)  NULL,
    [Email]        NVARCHAR (MAX)  NULL,
    [PhoneNumber]  INT             NULL,
    [BaptizedDate] DATETIME        NULL,
    [SavedDate]    DATETIME        NULL,
    [Locality]     NVARCHAR (MAX)  NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC)
);

