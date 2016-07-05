CREATE TABLE [dbo].[Tag] (
    [Id]           INT            NOT NULL,
    [Name]         NVARCHAR (100) NOT NULL,
    [Active]       BIT            CONSTRAINT [DF_Group_Active] DEFAULT ((1)) NULL,
    [TagType]      INT            NULL,
    [CreatedDate]  DATETIME       NULL,
    [LastUpdated]  DATETIME       NULL,
    [LastEditedBy] INT            NULL,
    CONSTRAINT [PK_Groups] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Group_User] FOREIGN KEY ([LastEditedBy]) REFERENCES [dbo].[User] ([Id])
);



