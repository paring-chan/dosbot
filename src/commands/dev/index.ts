import {register} from '../../types/Command'

export default (r: register) => {
    r(require('./shellCommand').default)
    r(require('./reload').default)
}