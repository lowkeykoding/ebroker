using EBroker.Api.Features.Auth.DTOs;
using MediatR;

namespace EBroker.Api.Features.Auth.Queries.Login;

public record LoginQuery(string Email, string Password) : IRequest<AuthTokenDto?>
{
    public List<string> Validate()
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(Email))
            errors.Add("Email is required.");

        if (string.IsNullOrWhiteSpace(Password))
            errors.Add("Password is required.");

        return errors;
    }
}
