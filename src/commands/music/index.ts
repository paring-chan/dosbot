import {register} from '../../types/Command'

export default (r: register) : void => {
    r(require('./play').default)
    r(require('./skip').default)
    r(require('./stop').default)
    r(require('./forward').default)
    r(require('./backward').default)
    r(require('./seek').default)
    r(require('./nowplaying').default)
    r(require('./volume').default)
}