const express = require('express');
const app = express();
const port = 3000;

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
    res.json(tasks);
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

app.get('/health', (req, res) => {
    res.json(
        {
            status: 'OK',
        }
    );
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});