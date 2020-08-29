import {register} from '../../types/Command'

export default (r: register) : void => {
    r(require('./qr').default)
}