CREATE TABLE [dbo].[UserNote] (
    [Id]               INT            IDENTITY (1, 1) NOT NULL,
    [UserId]           INT            NOT NULL,
    [Note]             NVARCHAR (MAX) NULL,
    [CreatedDate]      DATETIME       NULL,
    [ModifiedDate]     DATETIME       NULL,
    [CreatedByUserId]  INT            NULL,
    [ModifiedByUserId] INT            NULL,
    CONSTRAINT [PK_UserNote] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_UserNote_User] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User] ([Id])
);

