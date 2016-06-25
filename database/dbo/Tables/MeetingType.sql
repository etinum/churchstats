CREATE TABLE [dbo].[MeetingType] (
    [Id]     INT            NOT NULL,
    [Name]   NVARCHAR (100) NOT NULL,
    [Active] BIT            NULL,
    CONSTRAINT [PK_MeetingTypes] PRIMARY KEY CLUSTERED ([Id] ASC)
);



