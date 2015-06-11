using System;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Results;
using ChronoZoom.Backend.Business.Interfaces;
using ChronoZoom.Backend.DTO;
using ChronoZoom.Backend.Exceptions;

namespace ChronoZoom.Backend.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class AccountController : ApiController
    {
        private readonly IAccountService _service;

        public AccountController(IAccountService service)
        {
            _service = service;
        }

        [HttpPost]
        [ActionName("login")]
        public IHttpActionResult Login(LoginDto login)
        {
            try
            {
                Guid guid = _service.Login(login.Email, login.Password);
                return Ok(guid);
            }
            catch (LoginFailedException ex)
            {
                return NotFound();
            }
        }

        [HttpPost]
        [ActionName("logout")]
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
        [ActionName("register")]
        public IHttpActionResult Register(RegisterDto register)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    bool registered = _service.Register(register.Email, register.Password, register.Screenname);
                    if (registered)
                    {
                        return Ok();
                    }
                }
                catch (AlreadyExistsException)
                {
                    return Ok("Not allowed, email or screenname already exists");
                }
                
            }
            else
            {
                return new InvalidModelStateResult(ModelState, this);
            }
            return BadRequest();
        }
    }
}