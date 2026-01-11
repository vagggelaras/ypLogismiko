import { Router } from "express"
import { toDo, toDoItem } from "../models/index.js"

export const todoRouter = Router()

//GET /todos -> show all todos και τα toDoItems του
todoRouter.get('/', async (req, res) => {
    try {

        const allToDos = await toDo.findAll({ include: toDoItem })
        console.log(`returned all todos and todoItems`)
        res.status(201).json(allToDos)

    } catch (error) {

        console.log(error)
        res.status(500).json({
            error: 'something went wrong'
        })

    }
})

//POST /todos -> create a todo
todoRouter.post('/', async (req, res) => {
    try {
        const item = await toDo.create({
            title: req.body.content
        })
        console.log(`added todo with title ${req.body.content}`)
        res.status(201).json(item)
    } catch (error) {
        console.log(error)
        if (error.name === "SequelizeTimeoutError") {
            res.status(400).json({
                error: `todo with title ${req.body.content} already exists`
            })
        } else {
            res.status(500).json({
                error: 'something went wrong'
            })
        }

    }
})

//GET /todos/:id -> egt specific todo
todoRouter.get('/:id', async (req,res) => {
    
    const todo = await toDo.findByPk(req.params.id)

    if(!todo) {
        console.log(`todo with an id of ${req.params.id} was not found`)
        return res.status(404).json({ error: 'Todo not found' })
    }
    
    res.status(201).json(todo)
})

//PUT /todos/:id -> update a todo
todoRouter.put('/:id', async (req, res) => {
    const todo = await toDo.findByPk(req.params.id)

    if (!todo) {
        console.log(`todo with an id of ${req.params.id} was not updated because it was found`)
        return res.status(404).json({ error: 'Todo not found' })
    }

    await todo.update({ title: req.body.title })
    console.log(`todo with id of ${req.params.id} updated`)

    res.json(todo)
})

//DELETE /todos/:id -> delete a todo
todoRouter.delete('/:id', async (req, res) => {
    const todo = await toDo.findByPk(req.params.id)

    if (!todo) {
        console.log(`todo with an id of ${req.params.id} was not deleted because it was not found`)
        return res.status(404).json({ error: 'Todo not found' })
    }

    await todo.destroy()
    console.log(`todo with id of ${req.params.id} deleted`)

    res.json({message: 'Todo deleted'})
})

export default todoRouter