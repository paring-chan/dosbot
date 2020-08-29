import {exec, ExecException} from 'child_process'

type results = {
    stdout: string | null,
    stderr: string | null,
    error: ExecException | null
}

export default (script: string): Promise<results> => {
    return new Promise<results>(resolve => {
        exec(script, (error, stdout, stderr) => {
            resolve({error, stdout, stderr})
        })
    })
}