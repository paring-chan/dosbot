import {register} from '../../types/Command'

export default (r: register) : void => {
    r(require('./play').default)
    r(require('./skip').default)
}