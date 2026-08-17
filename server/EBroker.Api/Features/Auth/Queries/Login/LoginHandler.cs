using System.Net.Http.Json;
using System.Text.Json.Serialization;
using EBroker.Api.Features.Auth.DTOs;
using MediatR;

namespace EBroker.Api.Features.Auth.Queries.Login;

public class LoginHandler : IRequestHandler<LoginQuery, AuthTokenDto?>
{
    private readonly IHttpClientFactory _httpClientFactory;

    public LoginHandler(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    public async Task<AuthTokenDto?> Handle(LoginQuery request, CancellationToken cancellationToken)
    {
        if (request.Validate().Count > 0) return null;

        var client = _httpClientFactory.CreateClient("SupabaseAuth");

        var response = await client.PostAsJsonAsync(
            "token?grant_type=password",
            new { email = request.Email, password = request.Password },
            cancellationToken);

        if (!response.IsSuccessStatusCode) return null;

        var supabaseResponse = await response.Content
            .ReadFromJsonAsync<SupabaseTokenResponse>(cancellationToken: cancellationToken);

        if (supabaseResponse is null) return null;

        return new AuthTokenDto
        {
            AccessToken = supabaseResponse.AccessToken,
            RefreshToken = supabaseResponse.RefreshToken,
            ExpiresIn = supabaseResponse.ExpiresIn,
            UserId = supabaseResponse.User.Id,
            Email = supabaseResponse.User.Email
        };
    }

    private sealed record SupabaseTokenResponse(
        [property: JsonPropertyName("access_token")] string AccessToken,
        [property: JsonPropertyName("refresh_token")] string RefreshToken,
        [property: JsonPropertyName("expires_in")] int ExpiresIn,
        [property: JsonPropertyName("user")] SupabaseUser User);

    private sealed record SupabaseUser(
        [property: JsonPropertyName("id")] string Id,
        [property: JsonPropertyName("email")] string Email);
}
