CREATE TABLE [dbo].[X_User_Tag] (
    [UserId]           INT      NOT NULL,
    [TagId]            INT      NOT NULL,
    [DateAdded]        DATETIME NULL,
    [CreatedByUserId]  INT      NULL,
    [ModifiedByUserId] INT      NULL,
    [ModifiedDate]     DATETIME NULL,
    [CreatedDate]      DATETIME NULL,
    CONSTRAINT [PK_X_User_Tag] PRIMARY KEY CLUSTERED ([UserId] ASC, [TagId] ASC),
    CONSTRAINT [FK_X_User_Tag_Tag] FOREIGN KEY ([TagId]) REFERENCES [dbo].[Tag] ([Id]),
    CONSTRAINT [FK_X_User_Tag_User] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User] ([Id])
);



