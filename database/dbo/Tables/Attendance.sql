CREATE TABLE [dbo].[Attendance] (
    [Id]           INT  NULL,
    [UserId]       INT  NOT NULL,
    [MeetingId]    INT  NOT NULL,
    [RecorderId]   INT  NOT NULL,
    [DateRecorded] DATE NOT NULL,
    [isAttend]     BIT  NOT NULL
);

