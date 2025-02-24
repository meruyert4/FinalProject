import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import path from 'path';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = 3000;

app.use(express.static(path.join(process.cwd(), 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'home.html'));
});

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

app.post('/blogs', async (req, res) => {
    const { title, author, body } = req.body;
    const newPost = { title, author, body, createdAt: new Date(), updatedAt: new Date() };
    const result = await db.collection('blogs').insertOne(newPost);
    res.status(201).json({ id: result.insertedId });
});

app.get('/blogs', async (req, res) => {
    const posts = await db.collection('blogs').find({}).toArray();
    res.json(posts);
});

app.get('/blogs/:id', async (req, res) => {
    const post = await db.collection('blogs').findOne({ _id: new ObjectId(req.params.id) });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
});

app.put('/blogs/:id', async (req, res) => {
    const { title, author, body } = req.body;
    await db.collection('blogs').updateOne({ _id: new ObjectId(req.params.id) }, { $set: { title, author, body, updatedAt: new Date() } });
    res.json({ message: 'Post updated' });
});

app.delete('/blogs/:id', async (req, res) => {
    await db.collection('blogs').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: 'Post deleted' });
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
