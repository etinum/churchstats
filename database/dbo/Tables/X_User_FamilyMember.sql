CREATE TABLE [dbo].[X_User_FamilyMember] (
    [UserId]             INT      NOT NULL,
    [FamilyMemberUserId] INT      NOT NULL,
    [CreatedByUserId]    INT      NULL,
    [ModifiedByUserId]   INT      NULL,
    [ModifiedDate]       DATETIME NULL,
    [CreatedDate]        DATETIME NULL,
    CONSTRAINT [PK_X_User_FamilyMember] PRIMARY KEY CLUSTERED ([UserId] ASC, [FamilyMemberUserId] ASC),
    CONSTRAINT [FK_X_User_FamilyMember_User] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User] ([Id]),
    CONSTRAINT [FK_X_User_FamilyMember_User1] FOREIGN KEY ([FamilyMemberUserId]) REFERENCES [dbo].[User] ([Id])
);

