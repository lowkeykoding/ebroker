namespace EBroker.Api.Common;

public class CommandResult
{
    public bool Success { get; init; }
    public List<string> Errors { get; init; } = new();

    public static CommandResult Ok() => new() { Success = true };

    public static CommandResult Fail(string error) => new()
    {
        Success = false,
        Errors = [error]
    };

    public static CommandResult Fail(List<string> errors) => new()
    {
        Success = false,
        Errors = errors
    };
}
