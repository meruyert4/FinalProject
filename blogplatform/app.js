import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import path from 'path';

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

const client = new MongoClient('mongodb://localhost:27017/');
let db;
client.connect()
    .then(() => {
        db = client.db('test');
    })
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });

router.use(express.static(path.join(process.cwd(), 'blogplatform', 'public')));

router.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'blogplatform', 'public', 'home.html'));
});

router.post('/blogs', async (req, res) => {
    const { title, author, body } = req.body;
    const newPost = { title, author, body, createdAt: new Date(), updatedAt: new Date() };
    const result = await db.collection('blogs').insertOne(newPost);
    res.status(201).json({ id: result.insertedId });
});

router.get('/blogs', async (req, res) => {
    const posts = await db.collection('blogs').find({}).toArray();
    res.json(posts);
});

router.get('/blogs/:id', async (req, res) => {
    const post = await db.collection('blogs').findOne({ _id: new ObjectId(req.params.id) });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
});

router.put('/blogs/:id', async (req, res) => {
    const { title, author, body } = req.body;
    await db.collection('blogs').updateOne({ _id: new ObjectId(req.params.id) }, { $set: { title, author, body, updatedAt: new Date() } });
    res.json({ message: 'Post updated' });
});

router.delete('/blogs/:id', async (req, res) => {
    await db.collection('blogs').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: 'Post deleted' });
});

export default router;
