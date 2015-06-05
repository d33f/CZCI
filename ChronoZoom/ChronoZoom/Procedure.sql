CREATE PROCEDURE spAddContentItem
	-- Link to parent content item
	@parentId int, 

	-- The content item to insert
	@beginDate decimal(18, 0),
	@endDate decimal(18, 0),
	@title nvarchar(300),
	@description text,
	@hasChildren bit,
	@pictureURLs nvarchar(max),
	@sourceURL nvarchar(max),
	@sourceRef bigint,

	-- Return the added Id
	@insertedId int OUTPUT
AS
	-- Get parent node and last child node
	DECLARE @parent hierarchyId = (SELECT Node FROM [dbo].[ContentItem] WHERE Id = @parentId)
	DECLARE @lastChild hierarchyId = (SELECT TOP 1 Node FROM [dbo].[ContentItem] WHERE Node.GetAncestor(1) = @parent order by Id desc)

	-- Insert the new content item
	INSERT INTO [dbo].[ContentItem] (Node, BeginDate, EndDate, Title, [Description], HasChildren, PictureURLs, ParentId, SourceURL, SourceRef) 
	VALUES (@parent.GetDescendant(@lastChild, NULL), @beginDate, @endDate, @title, @description, @hasChildren, @pictureURLs, @parentId, @sourceURL, @sourceRef); 

	-- Get the Id of the inserted content item
	SELECT @insertedId = SCOPE_IDENTITY()
RETURN
GO