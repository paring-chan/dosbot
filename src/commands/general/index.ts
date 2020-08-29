import {register as registerCommand} from '../../types/Command'

export default (register: registerCommand) : void => {
    register(require('./help').default)
}