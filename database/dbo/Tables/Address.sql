CREATE TABLE [dbo].[Address] (
    [Id]               INT            IDENTITY (1, 1) NOT NULL,
    [AddressLine1]     NVARCHAR (50)  NULL,
    [AddressLine2]     NVARCHAR (50)  NULL,
    [City]             NVARCHAR (50)  NULL,
    [ZipCode]          NVARCHAR (50)  NULL,
    [Country]          INT            NULL,
    [Notes]            NVARCHAR (300) NULL,
    [CreatedByUserId]  INT            NULL,
    [ModifiedByUserId] INT            NULL,
    [ModifiedDate]     DATETIME       NULL,
    [CreatedDate]      DATETIME       NULL,
    CONSTRAINT [PK_Address] PRIMARY KEY CLUSTERED ([Id] ASC)
);





