namespace EBroker.Api.Features.Auth.DTOs;

public class RegisterRequest
{
    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
}
