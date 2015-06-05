CREATE TABLE [dbo].[ContentItem] (
	[Node] HierarchyId PRIMARY KEY CLUSTERED,
	[Id] bigint IdENTITY(1,1) NOT NULL,
	[BeginDate] decimal(16, 2) NOT NULL,
	[EndDate] decimal(16, 2) NOT NULL,
	[Title] nvarchar(300) NOT NULL,
	[HasChildren] bit NOT NULL,
	[PictureURL] text NULL,
	[ParentId] bigint NOT NULL,
	[SourceURL] text NULL,
	[SourceRef] bigint NULL,
	[Timestamp] [timestamp] NOT NULL,
)
GO

Create NonClustered Index [ix_ContentItem_ID] on [dbo].[ContentItem]([ID])

-- Create root of all content items
DECLARE @root HierarchyId = HierarchyId::GetRoot()
INSERT INTO [dbo].[ContentItem] (Node, BeginDate, EndDate, Title, HasChildren, ParentId) 
VALUES (@root.GetDescendant(NULL,NULL), 0, 0, '__ROOT__', 1, 1); 