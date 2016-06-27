CREATE TABLE [dbo].[MeetingType] (
    [Id]     INT            IDENTITY (1, 1) NOT NULL,
    [Name]   NVARCHAR (100) NOT NULL,
    [Active] BIT            CONSTRAINT [DF_MeetingType_Active] DEFAULT ((1)) NOT NULL,
    CONSTRAINT [PK_MeetingTypes] PRIMARY KEY CLUSTERED ([Id] ASC)
);





