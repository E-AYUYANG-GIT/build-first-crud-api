const express = require('express');
const app = express();
const port = 3000;
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json')

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());

let tasks = [
    {"id": 1, "title": "Product Inventory", "done": true},
    {"id": 2, "title": "Patient Records", "done": true},
    {"id": 3, "title": "Prescription Management", "done": true}
];
app.get ('/', (req, res) => {
    res.json(
        { 
            name: 'Task API',
            version: '1.0.0',
            endpoints: ["/tasks"]
        });
});

app.get ('/tasks', (req, res) => {
    res.status(200).json(tasks); //Updated to inlcude status code 200
});

app.get ('/tasks/:id', (req, res) => {
    const requestedId = parseInt(req.params.id); 

    const task = tasks.find(t => t.id === requestedId);

    if (task) {
        res.json(task);
    } else {
        res.status(404).json({ message: "Task not found" });
    }
});

//STAGE 3
//Use Powershell Native Command to test
// Invoke-RestMethod `
//     -Uri "http://localhost:3000/tasks" `
//     -Method POST `
//     -ContentType "application/json" `
//     -Body '{"title":"Buy milk"}'

app.post('/tasks', (req, res) => {
    const { title } = req.body;

    if (!title || title.trim() === "") {
        return res.status(400).json({ error: "Title is required and cannot be empty" });
    }

    const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;

    const newTask = {
        id: newId,
        title: title,
        done: false
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
    const findId = parseInt(req.params.id);
    const findTask = tasks.find(t => t.id === findId);

    if (!findTask) {
        return res.status(404).json({error: "Unknown Id"});
    } 

    const { title, done } = req.body;
    
    if (
        (title === undefined && done === undefined) ||
        (title !== undefined && title.trim() === "")
    ) {
        return res.status(400).json({ error: "Empty/Invalid Body" });
    }
    if (title !== undefined){
        findTask.title = title;
    }
    if (done !== undefined){
        findTask.done = done;
    }

    res.status(200).json(findTask);
});

app.delete('/tasks/:id', (req, res) => {
    const findId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === findId);

    if (taskIndex === -1) {
        return res.status(404).json({error: "Unknown Id"})
    }
    
    tasks.splice(taskIndex, 1);

    res.sendStatus(204);
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});