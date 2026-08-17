using EBroker.Api.Features.Auth.Commands.Register;
using EBroker.Api.Features.Auth.DTOs;
using EBroker.Api.Features.Auth.Queries.Login;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EBroker.Api.Controllers;

[AllowAnonymous]
public class AuthController : BaseApiController
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _mediator.Send(new LoginQuery(request.Email, request.Password));

        if (result is null)
            return Unauthorized(new { message = "Invalid email or password." });

        return Ok(result);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var command = new RegisterCommand { Email = request.Email, Password = request.Password };
        var result = await _mediator.Send(command);

        if (!result.Success)
            return BadRequest(result.Errors);

        return Ok();
    }
}
