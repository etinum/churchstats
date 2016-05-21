CREATE TABLE [dbo].[X_User_Group] (
    [UserId]  INT NOT NULL,
    [GroupId] INT NOT NULL,
    CONSTRAINT [FK_X_User_Group_Group] FOREIGN KEY ([GroupId]) REFERENCES [dbo].[Group] ([Id]),
    CONSTRAINT [FK_X_User_Group_User] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User] ([Id])
);



