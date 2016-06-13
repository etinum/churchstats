
-- --------------------------------------------------
-- Entity Designer DDL Script for SQL Server 2005, 2008, 2012 and Azure
-- --------------------------------------------------
-- Date Created: 06/12/2016 19:34:04
-- Generated from EDMX file: C:\Users\ddelam\Documents\Git\churchstats\data\ChurchStatsModel.edmx
-- --------------------------------------------------

SET QUOTED_IDENTIFIER OFF;
GO
USE [churchstats];
GO
IF SCHEMA_ID(N'dbo') IS NULL EXECUTE(N'CREATE SCHEMA [dbo]');
GO

-- --------------------------------------------------
-- Dropping existing FOREIGN KEY constraints
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[FK_Attendance_Meeting]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[Attendance] DROP CONSTRAINT [FK_Attendance_Meeting];
GO
IF OBJECT_ID(N'[dbo].[FK_Attendance_Recorder]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[Attendance] DROP CONSTRAINT [FK_Attendance_Recorder];
GO
IF OBJECT_ID(N'[dbo].[FK_Attendance_User]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[Attendance] DROP CONSTRAINT [FK_Attendance_User];
GO
IF OBJECT_ID(N'[dbo].[FK_Meeting_MeetingType]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[Meeting] DROP CONSTRAINT [FK_Meeting_MeetingType];
GO
IF OBJECT_ID(N'[dbo].[FK_X_User_Group_Group]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[X_User_Group] DROP CONSTRAINT [FK_X_User_Group_Group];
GO
IF OBJECT_ID(N'[dbo].[FK_X_User_Group_User]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[X_User_Group] DROP CONSTRAINT [FK_X_User_Group_User];
GO
IF OBJECT_ID(N'[dbo].[FK_X_User_Meeting_Meeting]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[X_User_Meeting] DROP CONSTRAINT [FK_X_User_Meeting_Meeting];
GO
IF OBJECT_ID(N'[dbo].[FK_X_User_Meeting_User]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[X_User_Meeting] DROP CONSTRAINT [FK_X_User_Meeting_User];
GO

-- --------------------------------------------------
-- Dropping existing tables
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[Attendance]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Attendance];
GO
IF OBJECT_ID(N'[dbo].[Group]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Group];
GO
IF OBJECT_ID(N'[dbo].[Meeting]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Meeting];
GO
IF OBJECT_ID(N'[dbo].[MeetingType]', 'U') IS NOT NULL
    DROP TABLE [dbo].[MeetingType];
GO
IF OBJECT_ID(N'[dbo].[User]', 'U') IS NOT NULL
    DROP TABLE [dbo].[User];
GO
IF OBJECT_ID(N'[dbo].[X_User_Group]', 'U') IS NOT NULL
    DROP TABLE [dbo].[X_User_Group];
GO
IF OBJECT_ID(N'[dbo].[X_User_Meeting]', 'U') IS NOT NULL
    DROP TABLE [dbo].[X_User_Meeting];
GO

-- --------------------------------------------------
-- Creating all tables
-- --------------------------------------------------

-- Creating table 'Attendances'
CREATE TABLE [dbo].[Attendances] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [UserId] int  NOT NULL,
    [MeetingId] int  NOT NULL,
    [RecorderId] int  NOT NULL,
    [DateRecorded] datetime  NOT NULL,
    [LastUpdated] datetime  NOT NULL,
    [isAttend] bit  NOT NULL
);
GO

-- Creating table 'Groups'
CREATE TABLE [dbo].[Groups] (
    [Id] int  NOT NULL,
    [Name] nvarchar(100)  NOT NULL
);
GO

-- Creating table 'Meetings'
CREATE TABLE [dbo].[Meetings] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Name] nvarchar(100)  NOT NULL,
    [MeetingTypeId] int  NOT NULL,
    [DayOfTheWeek] int  NULL,
    [Description] nvarchar(max)  NULL,
    [UsualTime] datetime  NULL
);
GO

-- Creating table 'MeetingTypes'
CREATE TABLE [dbo].[MeetingTypes] (
    [Id] int  NOT NULL,
    [Name] nvarchar(100)  NOT NULL
);
GO

-- Creating table 'Users'
CREATE TABLE [dbo].[Users] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [FirstName] nvarchar(50)  NOT NULL,
    [LastName] nvarchar(50)  NOT NULL,
    [Gender] nvarchar(10)  NULL,
    [BirthYear] int  NULL,
    [Picture] varbinary(max)  NULL,
    [isSaved] bit  NULL,
    [isBaptized] bit  NULL,
    [MiddleName] nvarchar(50)  NULL,
    [Notes] nvarchar(max)  NULL,
    [Email] nvarchar(max)  NULL,
    [PhoneNumber] int  NULL,
    [BaptizedDate] datetime  NULL,
    [SavedDate] datetime  NULL,
    [Locality] nvarchar(max)  NULL
);
GO

-- Creating table 'X_User_Meeting'
CREATE TABLE [dbo].[X_User_Meeting] (
    [UserId] int  NOT NULL,
    [MeetingId] int  NOT NULL,
    [Active] bit  NOT NULL
);
GO

-- Creating table 'X_User_Group'
CREATE TABLE [dbo].[X_User_Group] (
    [Groups_Id] int  NOT NULL,
    [Users_Id] int  NOT NULL
);
GO

-- --------------------------------------------------
-- Creating all PRIMARY KEY constraints
-- --------------------------------------------------

-- Creating primary key on [Id] in table 'Attendances'
ALTER TABLE [dbo].[Attendances]
ADD CONSTRAINT [PK_Attendances]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Groups'
ALTER TABLE [dbo].[Groups]
ADD CONSTRAINT [PK_Groups]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Meetings'
ALTER TABLE [dbo].[Meetings]
ADD CONSTRAINT [PK_Meetings]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'MeetingTypes'
ALTER TABLE [dbo].[MeetingTypes]
ADD CONSTRAINT [PK_MeetingTypes]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Users'
ALTER TABLE [dbo].[Users]
ADD CONSTRAINT [PK_Users]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [UserId], [MeetingId] in table 'X_User_Meeting'
ALTER TABLE [dbo].[X_User_Meeting]
ADD CONSTRAINT [PK_X_User_Meeting]
    PRIMARY KEY CLUSTERED ([UserId], [MeetingId] ASC);
GO

-- Creating primary key on [Groups_Id], [Users_Id] in table 'X_User_Group'
ALTER TABLE [dbo].[X_User_Group]
ADD CONSTRAINT [PK_X_User_Group]
    PRIMARY KEY CLUSTERED ([Groups_Id], [Users_Id] ASC);
GO

-- --------------------------------------------------
-- Creating all FOREIGN KEY constraints
-- --------------------------------------------------

-- Creating foreign key on [MeetingId] in table 'Attendances'
ALTER TABLE [dbo].[Attendances]
ADD CONSTRAINT [FK_Attendance_Meeting]
    FOREIGN KEY ([MeetingId])
    REFERENCES [dbo].[Meetings]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_Attendance_Meeting'
CREATE INDEX [IX_FK_Attendance_Meeting]
ON [dbo].[Attendances]
    ([MeetingId]);
GO

-- Creating foreign key on [RecorderId] in table 'Attendances'
ALTER TABLE [dbo].[Attendances]
ADD CONSTRAINT [FK_Attendance_Recorder]
    FOREIGN KEY ([RecorderId])
    REFERENCES [dbo].[Users]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_Attendance_Recorder'
CREATE INDEX [IX_FK_Attendance_Recorder]
ON [dbo].[Attendances]
    ([RecorderId]);
GO

-- Creating foreign key on [UserId] in table 'Attendances'
ALTER TABLE [dbo].[Attendances]
ADD CONSTRAINT [FK_Attendance_User]
    FOREIGN KEY ([UserId])
    REFERENCES [dbo].[Users]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_Attendance_User'
CREATE INDEX [IX_FK_Attendance_User]
ON [dbo].[Attendances]
    ([UserId]);
GO

-- Creating foreign key on [MeetingTypeId] in table 'Meetings'
ALTER TABLE [dbo].[Meetings]
ADD CONSTRAINT [FK_Meeting_MeetingType]
    FOREIGN KEY ([MeetingTypeId])
    REFERENCES [dbo].[MeetingTypes]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_Meeting_MeetingType'
CREATE INDEX [IX_FK_Meeting_MeetingType]
ON [dbo].[Meetings]
    ([MeetingTypeId]);
GO

-- Creating foreign key on [MeetingId] in table 'X_User_Meeting'
ALTER TABLE [dbo].[X_User_Meeting]
ADD CONSTRAINT [FK_X_User_Meeting_Meeting]
    FOREIGN KEY ([MeetingId])
    REFERENCES [dbo].[Meetings]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_X_User_Meeting_Meeting'
CREATE INDEX [IX_FK_X_User_Meeting_Meeting]
ON [dbo].[X_User_Meeting]
    ([MeetingId]);
GO

-- Creating foreign key on [UserId] in table 'X_User_Meeting'
ALTER TABLE [dbo].[X_User_Meeting]
ADD CONSTRAINT [FK_X_User_Meeting_User]
    FOREIGN KEY ([UserId])
    REFERENCES [dbo].[Users]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating foreign key on [Groups_Id] in table 'X_User_Group'
ALTER TABLE [dbo].[X_User_Group]
ADD CONSTRAINT [FK_X_User_Group_Group]
    FOREIGN KEY ([Groups_Id])
    REFERENCES [dbo].[Groups]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating foreign key on [Users_Id] in table 'X_User_Group'
ALTER TABLE [dbo].[X_User_Group]
ADD CONSTRAINT [FK_X_User_Group_User]
    FOREIGN KEY ([Users_Id])
    REFERENCES [dbo].[Users]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_X_User_Group_User'
CREATE INDEX [IX_FK_X_User_Group_User]
ON [dbo].[X_User_Group]
    ([Users_Id]);
GO

-- --------------------------------------------------
-- Script has ended
-- --------------------------------------------------