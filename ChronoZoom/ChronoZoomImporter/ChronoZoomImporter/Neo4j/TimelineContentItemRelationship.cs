using Neo4jClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChronoZoomImporter.Neo4j
{
    public class TimelineContentItemRelationship : Relationship, IRelationshipAllowingSourceNode<Timeline>, IRelationshipAllowingTargetNode<ContentItem>
    {
        private static readonly string _typeKey = "contains";

        public TimelineContentItemRelationship(NodeReference targetNode) : base(targetNode) { }

        public override string RelationshipTypeKey { get { return _typeKey; } }
    }
}
