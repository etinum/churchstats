CREATE TABLE [dbo].[Attendance] (
    [Id]           INT  NOT NULL,
    [UserId]       INT  NOT NULL,
    [MeetingId]    INT  NOT NULL,
    [RecorderId]   INT  NOT NULL,
    [DateRecorded] DATE NOT NULL,
    [LastUpdated]  DATE NOT NULL,
    [isAttend]     BIT  NOT NULL,
    CONSTRAINT [PK_Attendance] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Attendance_Meeting] FOREIGN KEY ([MeetingId]) REFERENCES [dbo].[Meeting] ([Id]),
    CONSTRAINT [FK_Attendance_Recorder] FOREIGN KEY ([RecorderId]) REFERENCES [dbo].[User] ([Id]),
    CONSTRAINT [FK_Attendance_User] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User] ([Id])
);





