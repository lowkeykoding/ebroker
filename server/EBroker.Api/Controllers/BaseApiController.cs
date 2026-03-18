using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EBroker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseApiController : ControllerBase
{
    // Supabase puts the user ID in the "sub" claim.
    // ASP.NET Core's JWT Bearer handler may expose it as ClaimTypes.NameIdentifier
    // or as the raw "sub" string depending on the token handler version — check both.
    protected string GetUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub");

        if (string.IsNullOrEmpty(userId))
        {
            throw new InvalidOperationException("User ID claim not found on token.");
        }

        return userId;
    }
}
