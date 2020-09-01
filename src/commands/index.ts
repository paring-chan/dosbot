import Command from '../types/Command'

export function getCommandList() : Array<Command> {
    const commands : Array<Command> = []

    function registerCommand(cmd: Command) : boolean {
        if (!cmd) return false
        if (!cmd.aliases) cmd.aliases = []
        if (!cmd.permissions) cmd.permissions = []
        commands.push(cmd)
        return true
    }

    require('./general').default(registerCommand)
    require('./dev').default(registerCommand)
    require('./utils').default(registerCommand)
    require('./music').default(registerCommand)

    return commands
}