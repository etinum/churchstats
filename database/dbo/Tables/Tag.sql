CREATE TABLE [dbo].[Tag] (
    [Id]               INT            NOT NULL,
    [Name]             NVARCHAR (100) NOT NULL,
    [Active]           BIT            CONSTRAINT [DF_Group_Active] DEFAULT ((1)) NULL,
    [TagType]          INT            NULL,
    [CreatedByUserId]  INT            NULL,
    [ModifiedByUserId] INT            NULL,
    [ModifiedDate]     DATETIME       NULL,
    [CreatedDate]      DATETIME       NULL,
    CONSTRAINT [PK_Groups] PRIMARY KEY CLUSTERED ([Id] ASC)
);





