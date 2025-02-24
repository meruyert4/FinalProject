const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const router = express.Router();

// Define Blog Schema
const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    body: String,
    createdAt: { type: Date, default: Date.now }
});

const BlogPost = mongoose.model('BlogPost', blogSchema);

// Serve Home Page
router.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'blogplatform', 'public', 'home.html'));
});

// Get All Blog Posts
router.get('/blogs', async (req, res) => {
    try {
        const blogs = await BlogPost.find();
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
});

// Create a New Blog Post
router.post('/blogs', async (req, res) => {
    try {
        const newBlog = new BlogPost(req.body);
        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create blog post' });
    }
});

// Update a Blog Post
router.put('/blogs/:id', async (req, res) => {
    try {
        const updatedBlog = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedBlog);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update blog post' });
    }
});

// Delete a Blog Post
router.delete('/blogs/:id', async (req, res) => {
    try {
        await BlogPost.findByIdAndDelete(req.params.id);
        res.json({ message: 'Blog post deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete blog post' });
    }
});

module.exports = router;
