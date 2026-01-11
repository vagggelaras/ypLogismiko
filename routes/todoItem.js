import { Router } from "express"
import { toDoItem } from "../models/index.js"

export const todoItemRouter = Router({mergeParams: true}) //mergeParams to get the base url

//POST / -> create a todo item, to the todo of the base url (/:id)
todoItemRouter.post('/', async (req,res) => {
    const baseId = req.params.id
    try {
    
        const item = await toDoItem.create({
            content: req.body.content,
            toDoId: baseId,
            completed: false
        })
        console.log(`added todo ITEM with title ${req.body.content}`)
        res.status(201).json(item)
    
    } catch (error) {

        console.log(error)
        res.status(500).json({
            error: 'something went wrong'
        })
        
    }
})

//GET /:iid -> get a todo item from base todo (/:id)
todoItemRouter.get('/:iid', async (req, res) => {
    const baseId = req.params.id

    try{
        const todoItem = await toDoItem.findByPk(req.params.iid)

        if (!todoItem) {
            console.log(`todo with an id of ${req.params.iid} was not found inside todo with an id of ${req.params.id}`)
            return res.status(404).json({ error: `Todo ITEM with id of ${req.params.iid} not found inside todo with an id of ${req.params.id}` })
        }

        res.status(201).json(todoItem)
        console.log(`found the todo ITEM with an id of ${req.params.iid}`)
    } catch(error) {

    }
})

//PUT /:iid -> update todo ITEM of :/id
todoItemRouter.put('/:iid', async (req, res) => {
    const todoItem = await toDoItem.findByPk(req.params.iid)

    if (!todoItem) {
        console.log(`todo ITEM with an id of ${req.params.id} was not updated because it was found`)
        return res.status(404).json({ error: 'Todo not found' })
    }

    const updatedData = {
        content: req.body.content,
        toDoId: req.body.toDoId || req.params.iid
    }

    if (req.body.completed !== undefined) updatedData.completed = req.body.completed

    await todoItem.update(updatedData)
    console.log(`todo ITEM with id of ${req.params.iid} updated`)

    res.json(todoItem)
})

//DELETE /:iid -> delete todo ITEM 
todoItemRouter.delete('/:id', async (req, res) => {
    const todoItem = await toDoItem.findByPk(req.params.id)

    if (!todoItem) {
        console.log(`todo ITEM with an id of ${req.params.id} was not deleted because it was not found`)
        return res.status(404).json({ error: 'Todo ITEM not found' })
    }

    await todoItem.destroy()
    console.log(`todo with id of ${req.params.id} deleted`)

    res.json({ message: 'Todo ITEM deleted' })
})

export default todoItemRouter