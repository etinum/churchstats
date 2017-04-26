CREATE TABLE [dbo].[User] (
    [Id]               INT             IDENTITY (1, 1) NOT NULL,
    [FirstName]        NVARCHAR (50)   NOT NULL,
    [MiddleName]       NVARCHAR (50)   NULL,
    [LastName]         NVARCHAR (50)   NOT NULL,
    [NickName]         NVARCHAR (50)   NULL,
    [Gender]           BIT             NULL,
    [BirthYear]        INT             NULL,
    [Picture]          VARBINARY (MAX) NULL,
    [IsSaved]          BIT             NULL,
    [IsBaptized]       BIT             NULL,
    [IsActive]         BIT             CONSTRAINT [DF_User_IsActive] DEFAULT ((1)) NOT NULL,
    [Notes]            NVARCHAR (MAX)  NULL,
    [BaptizedDate]     DATETIME        NULL,
    [SavedDate]        DATETIME        NULL,
    [AddressId]        INT             NULL,
    [ContactInfoId]    INT             NULL,
    [LocalityId]       INT             NULL,
    [UserType]         INT             NULL,
    [CreatedByUserId]  INT             NULL,
    [ModifiedByUserId] INT             NULL,
    [ModifiedDate]     DATETIME        NULL,
    [CreatedDate]      DATETIME        NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_User_Address] FOREIGN KEY ([AddressId]) REFERENCES [dbo].[Address] ([Id]),
    CONSTRAINT [FK_User_ContactInfo] FOREIGN KEY ([ContactInfoId]) REFERENCES [dbo].[ContactInfo] ([Id]),
    CONSTRAINT [FK_User_Locality] FOREIGN KEY ([LocalityId]) REFERENCES [dbo].[Locality] ([Id])
);













