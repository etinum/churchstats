CREATE TABLE [dbo].[X_User_Group] (
    [Groups_Id] INT NOT NULL,
    [Users_Id]  INT NOT NULL,
    CONSTRAINT [PK_X_User_Group] PRIMARY KEY CLUSTERED ([Groups_Id] ASC, [Users_Id] ASC),
    CONSTRAINT [FK_X_User_Group_Group] FOREIGN KEY ([Groups_Id]) REFERENCES [dbo].[Groups] ([Id]),
    CONSTRAINT [FK_X_User_Group_User] FOREIGN KEY ([Users_Id]) REFERENCES [dbo].[Users] ([Id])
);








GO
CREATE NONCLUSTERED INDEX [IX_FK_X_User_Group_User]
    ON [dbo].[X_User_Group]([Users_Id] ASC);

