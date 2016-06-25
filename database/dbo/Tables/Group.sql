CREATE TABLE [dbo].[Group] (
    [Id]          INT            NOT NULL,
    [Name]        NVARCHAR (100) NOT NULL,
    [CreatedDate] DATETIME       NULL,
    [LastUpdated] DATETIME       NULL,
    [Active]      BIT            CONSTRAINT [DF_Group_Active] DEFAULT ((1)) NULL,
    CONSTRAINT [PK_Groups] PRIMARY KEY CLUSTERED ([Id] ASC)
);



