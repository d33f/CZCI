using System;
using ChronoZoom.Backend.Business;
using ChronoZoom.Backend.Business.Interfaces;
using ChronoZoom.Backend.Data.Interfaces;
using Microsoft.Practices.Unity;
using System.Diagnostics.CodeAnalysis;
using ChronoZoom.Backend.Data.MSSQL.Dao;

namespace ChronoZoom.Backend
{
    /// <summary>
    /// Specifies the Unity configuration for the main container.
    /// </summary>
    [ExcludeFromCodeCoverage]
    public class UnityConfig
    {
        #region Unity Container
        private static Lazy<IUnityContainer> container = new Lazy<IUnityContainer>(() =>
        {
            var container = new UnityContainer();
            RegisterTypes(container);
            return container;
        });

        /// <summary>
        /// Gets the configured Unity container.
        /// </summary>
        public static IUnityContainer GetConfiguredContainer()
        {
            return container.Value;
        }
        #endregion

        /// <summary>Registers the type mappings with the Unity container.</summary>
        /// <param name="container">The unity container to configure.</param>
        /// <remarks>There is no need to register concrete types such as controllers or API controllers (unless you want to 
        /// change the defaults), as Unity allows resolving a concrete type even if it was not previously registered.</remarks>
        public static void RegisterTypes(IUnityContainer container)
        {
            // NOTE: To load from web.config uncomment the line below. Make sure to add a Microsoft.Practices.Unity.Configuration to the using statements.
            // container.LoadConfiguration();

            container.RegisterType<ITimelineDao, TimelineDao>();
            container.RegisterType<IContentItemDao, ContentItemDao>();

            container.RegisterType<ITimelineService, TimelineService>();
            container.RegisterType<IContentItemService, ContentItemService>();
            container.RegisterType<IBatchService, BatchService>();
            container.RegisterType<IAccountService, AccountService>();
            container.RegisterType<IAccountDao, AccountDao>();
        }
    }
}
