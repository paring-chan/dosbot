import Command from '../types/Command'

export function getCommandList() : Array<Command> {
    const commands : Array<Command> = []

    function registerCommand(cmd: Command) : boolean {
        if (!cmd.aliases) cmd.aliases = []
        commands.push(cmd)
        return true
    }

    require('./general').default(registerCommand)
    require('./dev').default(registerCommand)

    return commands
}