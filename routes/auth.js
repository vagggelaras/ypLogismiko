import { Router } from "express"
import { user } from "../models/index.js"
import {isLoggedIn, setLoggedIn} from "../state.js"

const authRouter = Router()

//POST /signup -> signup
authRouter.post('/signup', async (req, res) => {
    try {

        const { name, password } = req.body
        const user_ = await user.create({
            name: name,
            password: password
        })
        console.log(`added user with name: ${name} and password: ${password}`)
        res.status(201).json(user_)

    } catch (error) {

        console.log(error)
        res.status(500).json({
            error: 'something went wrong'
        })

    }
})

//POST /auth/login -> login
authRouter.post('/auth/login', async (req, res) => {
    if (isLoggedIn) {
        console.log("User is already logged in. Cant log in again!")
        return res.status(201).json({
            message: 'User is already logged in'
        })
    } else {
        setLoggedIn(true)
    }

    try {

        const { name, password } = req.body

        const existingUser = await user.findOne({
            where: { name: name }
        })

        if (!existingUser) {
            console.log(`User with the name ${name} was not found`)
            res.status(404).json({
                error: `User with the name ${name} does not exists`
            })
        }

        if (existingUser.password === password) {
            console.log("User logged in")
            return res.status(200).json({
                message: `Welcome back ${name}!`,
                user: existingUser
            })
        } else {
            return res.status(401).json({
                error: 'Wrong password'
            })
        }


    } catch (error) {

        console.log(error)
        res.status(501).json({
            error: 'something went wrong'
        })

    }
})

//GET /auth/logout -> logout
authRouter.get('/auth/logout', async (req, res) => {
    if (!isLoggedIn) {
        console.log("User is not logged in. Cant log out!")
        return res.status(201).json({
            message: 'User is not logged in'
        })
    } else {
        setLoggedIn(false)
        console.log("User Logged out")
        return res.status(201).json({
            message: 'User logged out'
        })
    }
})

export default authRouter