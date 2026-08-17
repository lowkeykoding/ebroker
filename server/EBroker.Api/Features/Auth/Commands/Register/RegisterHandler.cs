using System.Net.Http.Json;
using System.Text.Json.Serialization;
using EBroker.Api.Common;
using MediatR;

namespace EBroker.Api.Features.Auth.Commands.Register;

public class RegisterHandler : IRequestHandler<RegisterCommand, CommandResult>
{
    private readonly IHttpClientFactory _httpClientFactory;

    public RegisterHandler(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    public async Task<CommandResult> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var validationErrors = request.Validate();
        if (validationErrors.Count > 0) return CommandResult.Fail(validationErrors);

        var client = _httpClientFactory.CreateClient("SupabaseAuth");

        var response = await client.PostAsJsonAsync(
            "signup",
            new { email = request.Email, password = request.Password },
            cancellationToken);

        if (response.IsSuccessStatusCode) return CommandResult.Ok();

        var error = await response.Content
            .ReadFromJsonAsync<SupabaseErrorResponse>(cancellationToken: cancellationToken);

        return CommandResult.Fail(error?.Message ?? "Registration failed. Please try again.");
    }

    private sealed record SupabaseErrorResponse(
        [property: JsonPropertyName("msg")] string? Message,
        [property: JsonPropertyName("error_code")] string? ErrorCode);
}
