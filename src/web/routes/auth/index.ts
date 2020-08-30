import {Router} from 'express'
import passport from 'passport'

const router = Router()

router.get('/login',passport.authenticate('discord'))

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

router.get('/callback', passport.authenticate('discord', {
    failureRedirect: '/'
}), function (req, res) {
    res.redirect('/')
})

export default router
