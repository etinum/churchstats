CREATE TABLE [dbo].[Attendances] (
    [Id]           INT      IDENTITY (1, 1) NOT NULL,
    [UserId]       INT      NOT NULL,
    [MeetingId]    INT      NOT NULL,
    [RecorderId]   INT      NOT NULL,
    [DateRecorded] DATETIME NOT NULL,
    [LastUpdated]  DATETIME NOT NULL,
    [isAttend]     BIT      NOT NULL,
    CONSTRAINT [PK_Attendances] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Attendance_Meeting] FOREIGN KEY ([MeetingId]) REFERENCES [dbo].[Meetings] ([Id]),
    CONSTRAINT [FK_Attendance_Recorder] FOREIGN KEY ([RecorderId]) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_Attendance_User] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([Id])
);


GO
CREATE NONCLUSTERED INDEX [IX_FK_Attendance_User]
    ON [dbo].[Attendances]([UserId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_FK_Attendance_Recorder]
    ON [dbo].[Attendances]([RecorderId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_FK_Attendance_Meeting]
    ON [dbo].[Attendances]([MeetingId] ASC);

