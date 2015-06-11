using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Results;
using ChronoZoom.Backend.Business.Interfaces;
using ChronoZoom.Backend.DTO;
using ChronoZoom.Backend.Exceptions;

namespace ChronoZoom.Backend.Controllers
{
    public class AccountController : ApiController
    {
        private readonly IAccountService _service;

        public AccountController(IAccountService service)
        {
            _service = service;
        }

        [HttpPost]
        public IHttpActionResult Login([FromBody]LoginDto login)
        {
            try
            {
                Guid guid = _service.Login(login.Username, login.Password);
                return Ok(guid);
            }
            catch (LoginFailedException ex)
            {
                return NotFound();
            }
        }

        [HttpPost]
        public IHttpActionResult Logout([FromBody] string token)
        {
            bool loggedout = _service.Logout(token);
            if (loggedout)
            {
                return Ok();
            }
            return BadRequest();
        }

        [HttpPost]
        public IHttpActionResult Register([FromBody] RegisterDto register)
        {
            if (ModelState.IsValid)
            {
                bool registered = _service.Register(register.Email, register.Password, register.Screenname);
                if (registered)
                {
                    return Ok();
                }
            }
            else
            {
                return new InvalidModelStateResult(ModelState,this);
            }
            return BadRequest();
        }
    }
}