CREATE TABLE [dbo].[Role] (
    [Id]            INT           IDENTITY (1, 1) NOT NULL,
    [Name]          NVARCHAR (50) NULL,
    [Assignable]    BIT           NULL,
    [DateCreated]   DATETIME      NULL,
    [LastUpdated]   DATETIME      NULL,
    [LastUpdatedBy] INT           NULL,
    CONSTRAINT [PK_Role] PRIMARY KEY CLUSTERED ([Id] ASC)
);

