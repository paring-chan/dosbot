import {register} from '../../types/Command'

export default (r: register) => {
    r(require('./shellCommand').default)
    r(require('./reload').default)
    r(require('./eval').default)
    r(require('./restart').default)
    r(require('./announce').default)
}