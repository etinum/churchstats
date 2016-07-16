﻿CREATE TABLE [dbo].[Role] (
    [Id]               INT           IDENTITY (1, 1) NOT NULL,
    [Name]             NVARCHAR (50) NULL,
    [Assignable]       BIT           NULL,
    [CreatedByUserId]  INT           NULL,
    [ModifiedByUserId] INT           NULL,
    [ModifiedDate]     DATETIME      NULL,
    [CreatedDate]      DATETIME      NULL,
    CONSTRAINT [PK_Role] PRIMARY KEY CLUSTERED ([Id] ASC)
);



