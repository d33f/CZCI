using Neo4jClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChronoZoomImporter.Neo4j
{
    public class ContentItemChildrenRelationship : Relationship, IRelationshipAllowingSourceNode<ContentItem>, IRelationshipAllowingTargetNode<ContentItem>
    {
        private readonly string _typeKey = "children";

        public ContentItemChildrenRelationship(NodeReference targetNode) : base(targetNode) { }

        public override string RelationshipTypeKey { get { return _typeKey; } }
    }
}
