const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// API Routes
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading notes data:', err);
            return res.status(500).json({ error: 'Failed to read notes data' });
        }
        try {
            const notes = JSON.parse(data);
            res.json(notes);
        } catch (parseError) {
            console.error('Error parsing notes data:', parseError);
            res.status(500).json({ error: 'Failed to parse notes data' });
        }
    });
});

app.post('/api/notes', (req, res) => {
    const newNote = { id: uuidv4(), ...req.body };

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading notes data:', err);
            return res.status(500).json({ error: 'Failed to read notes data' });
        }
        try {
            const notes = JSON.parse(data);
            notes.push(newNote);
            fs.writeFile('./db/db.json', JSON.stringify(notes), (writeErr) => {
                if (writeErr) {
                    console.error('Error saving note:', writeErr);
                    return res.status(500).json({ error: 'Failed to save the new note' });
                }
                res.json(newNote);
            });
        } catch (parseError) {
            console.error('Error parsing notes data:', parseError);
            res.status(500).json({ error: 'Failed to parse notes data' });
        }
    });
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading notes data:', err);
            return res.status(500).json({ error: 'Failed to read notes data' });
        }
        try {
            let notes = JSON.parse(data);
            notes = notes.filter((note) => note.id !== noteId);

            fs.writeFile('./db/db.json', JSON.stringify(notes), (writeErr) => {
                if (writeErr) {
                    console.error('Error deleting note:', writeErr);
                    return res.status(500).json({ error: 'Failed to delete the note' });
                }
                res.json({ message: 'Note deleted successfully' });
            });
        } catch (parseError) {
            console.error('Error parsing notes data:', parseError);
            res.status(500).json({ error: 'Failed to parse notes data' });
        }
    });
});

// HTML Routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// This wildcard route should be after all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));
