CREATE TABLE [dbo].[ContactInfo] (
    [Id]               INT            IDENTITY (1, 1) NOT NULL,
    [Email1]           NVARCHAR (50)  NULL,
    [Email2]           NVARCHAR (50)  NULL,
    [CellPhone]        NVARCHAR (50)  NULL,
    [HomePhone]        NVARCHAR (50)  NULL,
    [WorkPhone]        NVARCHAR (50)  NULL,
    [Notes]            NVARCHAR (300) NULL,
    [CreatedByUserId]  INT            NULL,
    [ModifiedByUserId] INT            NULL,
    [ModifiedDate]     DATETIME       NULL,
    [CreatedDate]      DATETIME       NULL,
    CONSTRAINT [PK_ContactInfo] PRIMARY KEY CLUSTERED ([Id] ASC)
);





