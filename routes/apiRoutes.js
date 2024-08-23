const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const router = express.Router();

router.get('/notes', (req, res) => {
    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading notes data:', err);
            return res.status(500).json({ error: 'Failed to read notes data' });
        }
        res.json(JSON.parse(data));
    });
});

router.post('/notes', (req, res) => {
    const newNote = { id: uuidv4(), ...req.body };

    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading notes data:', err);
            return res.status(500).json({ error: 'Failed to read notes data' });
        }
        const notes = JSON.parse(data);
        notes.push(newNote);

        fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(notes), (err) => {
            if (err) {
                console.error('Error saving note:', err);
                return res.status(500).json({ error: 'Failed to save the new note' });
            }
            res.json(newNote);
        });
    });
});

router.delete('/notes/:id', (req, res) => {
    const noteId = req.params.id;

    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading notes data:', err);
            return res.status(500).json({ error: 'Failed to read notes data' });
        }
        let notes = JSON.parse(data);
        notes = notes.filter((note) => note.id !== noteId);

        fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(notes), (err) => {
            if (err) {
                console.error('Error deleting note:', err);
                return res.status(500).json({ error: 'Failed to delete the note' });
            }
            res.json({ message: 'Note deleted successfully' });
        });
    });
});

module.exports = router;
