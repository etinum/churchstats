CREATE TABLE [dbo].[Attendance] (
    [Id]               INT            IDENTITY (1, 1) NOT NULL,
    [UserId]           INT            NOT NULL,
    [MeetingId]        INT            NOT NULL,
    [RecorderId]       INT            NULL,
    [DateRecorded]     DATETIME       NOT NULL,
    [MeetingDate]      DATETIME       NULL,
    [AttendType]       INT            NULL,
    [MemberType]       INT            NULL,
    [Notes]            NVARCHAR (MAX) NULL,
    [IsArchive]        BIT            CONSTRAINT [DF_Attendance_IsArchive] DEFAULT ((0)) NULL,
    [CreatedByUserId]  INT            NULL,
    [ModifiedByUserId] INT            NULL,
    [ModifiedDate]     DATETIME       NULL,
    [CreatedDate]      DATETIME       NULL,
    CONSTRAINT [PK_Attendances] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_Attendance_Meeting] FOREIGN KEY ([MeetingId]) REFERENCES [dbo].[Meeting] ([Id]),
    CONSTRAINT [FK_Attendance_Recorder] FOREIGN KEY ([RecorderId]) REFERENCES [dbo].[User] ([Id]),
    CONSTRAINT [FK_Attendance_User] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User] ([Id]) ON DELETE CASCADE
);










GO
CREATE NONCLUSTERED INDEX [IX_FK_Attendance_Meeting]
    ON [dbo].[Attendance]([MeetingId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_FK_Attendance_Recorder]
    ON [dbo].[Attendance]([RecorderId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_FK_Attendance_User]
    ON [dbo].[Attendance]([UserId] ASC);

