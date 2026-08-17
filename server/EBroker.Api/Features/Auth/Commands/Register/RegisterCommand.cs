using EBroker.Api.Common;
using MediatR;

namespace EBroker.Api.Features.Auth.Commands.Register;

public class RegisterCommand : IRequest<CommandResult>
{
    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;

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
