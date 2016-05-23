CREATE TABLE [dbo].[X_User_Meeting] (
    [UserId]    INT NOT NULL,
    [MeetingId] INT NOT NULL,
    [Active]    BIT CONSTRAINT [DF_X_User_Meeting_Active] DEFAULT ((1)) NOT NULL,
    CONSTRAINT [PK_X_User_Meeting] PRIMARY KEY CLUSTERED ([UserId] ASC, [MeetingId] ASC),
    CONSTRAINT [FK_X_User_Meeting_Meeting] FOREIGN KEY ([MeetingId]) REFERENCES [dbo].[Meeting] ([Id]),
    CONSTRAINT [FK_X_User_Meeting_User] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User] ([Id])
);



