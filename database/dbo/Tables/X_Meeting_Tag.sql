CREATE TABLE [dbo].[X_Meeting_Tag] (
    [MeetingId]    INT      NOT NULL,
    [TagId]        INT      NOT NULL,
    [DateCreated]  DATETIME NULL,
    [LastEditedBy] INT      NULL,
    CONSTRAINT [PK_X_Meeting_Tag] PRIMARY KEY CLUSTERED ([MeetingId] ASC, [TagId] ASC),
    CONSTRAINT [FK_X_Meeting_Tag_Meeting] FOREIGN KEY ([MeetingId]) REFERENCES [dbo].[Meeting] ([Id]),
    CONSTRAINT [FK_X_Meeting_Tag_Tag] FOREIGN KEY ([TagId]) REFERENCES [dbo].[Tag] ([Id])
);

