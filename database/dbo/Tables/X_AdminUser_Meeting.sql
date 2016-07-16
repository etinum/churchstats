CREATE TABLE [dbo].[X_AdminUser_Meeting] (
    [UserId]           INT      NOT NULL,
    [MeetingId]        INT      NOT NULL,
    [CreatedBy]        INT      NULL,
    [CreatedByUserId]  INT      NULL,
    [ModifiedByUserId] INT      NULL,
    [ModifiedDate]     DATETIME NULL,
    [CreatedDate]      DATETIME NULL,
    CONSTRAINT [PK_X_AdminUser_Meeting] PRIMARY KEY CLUSTERED ([UserId] ASC, [MeetingId] ASC),
    CONSTRAINT [FK_X_AdminUser_Meeting_Meeting] FOREIGN KEY ([MeetingId]) REFERENCES [dbo].[Meeting] ([Id]),
    CONSTRAINT [FK_X_AdminUser_Meeting_User] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User] ([Id])
);



