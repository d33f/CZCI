CREATE TABLE [dbo].[ContentItem] (
	[Node] HierarchyId PRIMARY KEY CLUSTERED,
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[BeginDate] [decimal](16, 2) NOT NULL,
	[EndDate] [decimal](16, 2) NOT NULL,
	[Title] [nvarchar](300) NOT NULL,
	[Description] [text] NULL,
	[HasChildren] [bit] NOT NULL,
	[PictureURLs] [nvarchar](max) NULL,
	[ParentId] [bigint] NOT NULL,
	[SourceURL] [nvarchar](max) NULL,
	[SourceRef] [nvarchar](100) NULL,
	[Timestamp] [timestamp] NOT NULL,
)
GO

Create NonClustered Index [ix_ContentItem_ID] on [dbo].[ContentItem]([ID])

ALTER TABLE [dbo].[ContentItem]
	ADD CONSTRAINT UC_ContentItem_Id UNIQUE (Id); 
GO


-- Create root of all content items
DECLARE @root HierarchyId = HierarchyId::GetRoot()
INSERT INTO [dbo].[ContentItem] (Node, BeginDate, EndDate, Title, HasChildren, ParentId) 
VALUES (@root.GetDescendant(NULL,NULL), 0, 0, '__ROOT__', 1, 1); 

CREATE TABLE dbo.Timeline
(
	[Id] bigint identity(1,1) PRIMARY KEY CLUSTERED,
	[RootContentItemId] bigint NOT NULL,
	[IsPublic] bit NOT NULL,
	[BackgroundURL] [nvarchar](200) NULL,
	[Timestamp] [timestamp] NOT NULL
)
GO

Create NonClustered Index [ix_Timeline_RootContentItemId] on [dbo].[Timeline]([RootContentItemId])

ALTER TABLE [dbo].[Timeline] 
	ADD CONSTRAINT FK_Timeline_ContentItem FOREIGN KEY ([RootContentItemId]) 
		REFERENCES [dbo].[ContentItem] (Id) 
		ON DELETE CASCADE
		ON UPDATE CASCADE
GO