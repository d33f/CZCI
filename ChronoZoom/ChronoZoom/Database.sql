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

CREATE PROCEDURE spAddContentItem
	-- Link to parent content item
	@parentId int, 

	-- The content item to insert
	@beginDate decimal(18, 0),
	@endDate decimal(18, 0),
	@title nvarchar(300),
	@hasChildren bit,
	@pictureURL text,
	@sourceURL text,
	@sourceRef bigint,

	-- Return the added Id
	@insertedId int OUTPUT
AS
	-- Get parent node and last child node
	DECLARE @parent hierarchyId = (SELECT Node FROM [dbo].[ContentItem] WHERE Id = @parentId)
	DECLARE @lastChild hierarchyId = (SELECT TOP 1 Node FROM [dbo].[ContentItem] WHERE Node.GetAncestor(1) = @parent order by Id desc)

	-- Insert the new content item
	INSERT INTO [dbo].[ContentItem] (Node, BeginDate, EndDate, Title, HasChildren, PictureURL, ParentId, SourceURL, SourceRef) 
	VALUES (@parent.GetDescendant(@lastChild, NULL), @beginDate, @endDate, @title, @hasChildren, @pictureURL, @parentId, @sourceURL, @sourceRef); 

	-- Get the Id of the inserted content item
	SELECT @insertedId = SCOPE_IDENTITY()
RETURN
GO