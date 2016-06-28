CREATE TABLE [dbo].[X_User_Meeting] (
    [UserId]    INT      NOT NULL,
    [MeetingId] INT      NOT NULL,
    [Active]    BIT      NOT NULL,
    [DateAdded] DATETIME NULL,
    CONSTRAINT [PK_X_User_Meeting] PRIMARY KEY CLUSTERED ([UserId] ASC, [MeetingId] ASC),
    CONSTRAINT [FK_X_User_Meeting_Meeting] FOREIGN KEY ([MeetingId]) REFERENCES [dbo].[Meeting] ([Id]),
    CONSTRAINT [FK_X_User_Meeting_User] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User] ([Id])
);










GO
CREATE NONCLUSTERED INDEX [IX_FK_X_User_Meeting_Meeting]
    ON [dbo].[X_User_Meeting]([MeetingId] ASC);

