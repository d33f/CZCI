using ChronoZoom.Backend.Business.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChronoZoom.Backend.Business
{
    public class ContentItemServiceMock : IContentItemService
    {
        public IEnumerable<Entities.ContentItem> GetAll(int parentContentItemID)
        {
            switch(parentContentItemID)
            {
                case 1:
                    return WorldWarI();
                case 2:
                    return WorldWarII();
                case 24:
                    return AnneFrank();
                default:
                    return null;
            }
        }

        private IEnumerable<Entities.ContentItem> WorldWarI()
        {
            return new Entities.ContentItem[]
            { 
                new Entities.ContentItem()
                {
                    Id = 11,
                    BeginDate = 1914M,
                    EndDate = 1914M,
                    HasChildren = false,
                    Title = "German soldiers in a railway goods wagon on the way to the front in 1914",
                    Source = "http://upload.wikimedia.org/wikipedia/commons/c/c0/German_soldiers_in_a_railroad_car_on_the_way_to_the_front_during_early_World_War_I%2C_taken_in_1914._Taken_from_greatwar.nl_site.jpg",
                    Depth = 2,
                    ParentId = 1
                },
                new Entities.ContentItem()
                {
                    Id = 12,
                    BeginDate = 1914M,
                    EndDate = 1914M,
                    HasChildren = false,
                    Title = "Melbourne recruiting WWI",
                    Source = "http://upload.wikimedia.org/wikipedia/commons/b/bd/Melbourne_recruiting_WWI.jpg",
                    Depth = 2,
                    ParentId = 1
                },
                new Entities.ContentItem()
                {
                    Id = 13,
                    BeginDate = 1916M,
                    EndDate = 1916M,
                    HasChildren = false,
                    Title = "Royal Irish Rifles ration party",
                    Source = "http://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Royal_Irish_Rifles_ration_party_Somme_July_1916.jpg/800px-Royal_Irish_Rifles_ration_party_Somme_July_1916.jpg",
                    Depth = 2,
                    ParentId = 1
                },
                new Entities.ContentItem()
                {
                    Id = 14,
                    BeginDate = 1916M,
                    EndDate = 1916M,
                    HasChildren = false,
                    Title = "British 55th Division gas casualties",
                    Source = "http://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/British_55th_Division_gas_casualties_10_April_1918.jpg/800px-British_55th_Division_gas_casualties_10_April_1918.jpg",
                    Depth = 2,
                    ParentId = 1
                }
            };
        }

        private IEnumerable<Entities.ContentItem> WorldWarII()
        {
            return new Entities.ContentItem[]
            { 
                new Entities.ContentItem()
                {
                    Id = 21,
                    BeginDate = 1940M,
                    EndDate = 1940M,
                    HasChildren = false,
                    Title = "View from St Paul's Cathedral after the Blitz",
                    Source = "http://upload.wikimedia.org/wikipedia/commons/5/5d/View_from_St_Paul%27s_Cathedral_after_the_Blitz.jpg",
                    Depth = 2,
                    ParentId = 2
                },
                new Entities.ContentItem()
                {
                    Id = 22,
                    BeginDate = 1940M,
                    EndDate = 1940M,
                    HasChildren = false,
                    Title = "Australians at Tobruk",
                    Source = "http://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/AustraliansAtTobruk.jpg/587px-AustraliansAtTobruk.jpg",
                    Depth = 2,
                    ParentId = 2
                },
                new Entities.ContentItem()
                {
                    Id = 23,
                    BeginDate = 1943M,
                    EndDate = 1943M,
                    HasChildren = false,
                    Title = "SBD VB-16 over USS Washington",
                    Source = "http://upload.wikimedia.org/wikipedia/commons/thumb/0/07/SBD_VB-16_over_USS_Washington_1943.jpg/771px-SBD_VB-16_over_USS_Washington_1943.jpg", 
                    Depth = 2,
                    ParentId = 2
                },
                new Entities.ContentItem()
                {
                    Id = 24,
                    BeginDate = 1941M,
                    EndDate = 1944M,
                    HasChildren = true,
                    Title = "Anne Frank",
                    Source = "http://en.wikipedia.org/wiki/File:Anne_Frank.jpg",
                    Depth = 2,
                    ParentId = 2
                }
            };
        }

        private IEnumerable<Entities.ContentItem> AnneFrank()
        {
            return new Entities.ContentItem[]
            { 
                new Entities.ContentItem()
                {
                    Id = 31,
                    BeginDate = 1944M,
                    EndDate = 1944M,
                    HasChildren = false,
                    Title = "Anne Frank House Bookcase",
                    Source = "http://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/AnneFrankHouse_Bookcase.jpg/430px-AnneFrankHouse_Bookcase.jpg",
                    Depth = 3,
                    ParentId = 24
                },
                new Entities.ContentItem()
                {
                    Id = 32,
                    BeginDate = 1941M,
                    EndDate = 1941M,
                    HasChildren = false,
                    Title = "Hut AnneFrank Westerbork",
                    Source = "http://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Hut-AnneFrank-Westerbork.jpg/800px-Hut-AnneFrank-Westerbork.jpg",
                    Depth = 3,
                    ParentId = 24
                },
                new Entities.ContentItem()
                {
                    Id = 33,
                    BeginDate = 1945M,
                    EndDate = 1945M,
                    HasChildren = false,
                    Title = "Diary Anne Frank",
                    Source = "http://upload.wikimedia.org/wikipedia/en/thumb/4/47/Het_Achterhuis_%28Diary_of_Anne_Frank%29_-_front_cover%2C_first_edition.jpg/220px-Het_Achterhuis_%28Diary_of_Anne_Frank%29_-_front_cover%2C_first_edition.jpg", 
                    Depth = 3,
                    ParentId = 24
                }
            };
        }
    }
}