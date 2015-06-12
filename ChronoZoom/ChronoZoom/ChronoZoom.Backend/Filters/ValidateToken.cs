using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using ChronoZoom.Backend.Business.Interfaces;
using ChronoZoom.Backend.Entities;

namespace ChronoZoom.Backend.Filters
{
    public class ValidateToken : AuthorizationFilterAttribute
    {
        private IAccountService _accountService;
        public ValidateToken()
        {
            _accountService =
                (IAccountService)
                    GlobalConfiguration.Configuration.DependencyResolver.GetService(typeof (IAccountService));
        }

        public override void OnAuthorization(HttpActionContext actionContext)
        {
            IEnumerable<string> tokens;
            var foundInHeader = actionContext.Request.Headers.TryGetValues("token", out tokens);
            if (tokens != null)
            {
                if (tokens.Any())
                {
                    if (_accountService.IsTokenValid(tokens.First()))
                    {
                        Account account = _accountService.GetAccountByToken(tokens.First());
                        HttpContext.Current.User = account;
                        Thread.CurrentPrincipal = account;
                        base.OnAuthorization(actionContext);
                    }
                    else
                    {
                        actionContext.Response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
                    }
                }
                else
                {
                    actionContext.Response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
                }
            }
            else
            {
                actionContext.Response = new HttpResponseMessage(HttpStatusCode.Unauthorized);

            }
        }
    }
}