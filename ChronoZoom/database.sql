CREATE TABLE [dbo].[Timeline] (
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[BeginDate] [bigint] NOT NULL,
	[EndDate] [bigint] NOT NULL,
	[Title] [text] NOT NULL,
	[Description] [text] NOT NULL,
CONSTRAINT [PK_Timeline] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

CREATE TABLE [dbo].[ContentItem](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Title] [text] NOT NULL,
	[BeginDate] [bigint] NOT NULL,
	[EndDate] [bigint] NOT NULL,
	[Source] [text] NULL,
	[HasChildren] [int] NOT NULL,
	[Priref] [bigint] NOT NULL,
	[ParentId] [bigint] NOT NULL,
	[TimelineId] [bigint] NULL,
CONSTRAINT [PK_ContentItem] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
