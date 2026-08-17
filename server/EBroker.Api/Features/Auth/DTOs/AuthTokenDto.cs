namespace EBroker.Api.Features.Auth.DTOs;

public class AuthTokenDto
{
    public string AccessToken { get; init; } = string.Empty;
    public string RefreshToken { get; init; } = string.Empty;
    public int ExpiresIn { get; init; }
    public string UserId { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
}
