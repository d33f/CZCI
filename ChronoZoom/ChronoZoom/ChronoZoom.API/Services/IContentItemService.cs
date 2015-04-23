using ChronoZoom.API.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChronoZoom.API.Services
{
    public interface IContentItemService
    {
        IEnumerable<ContentItem> FindContentItems(int parentContentItemID);
    }
}
