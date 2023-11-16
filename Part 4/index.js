require('./mongo');
require('dotenv').config();
const express = require('express');
const logger = require('./utils/loggerMiddleware');
const cors = require('cors');
const Blog = require('./models/Blog');
const handleErrors = require('./middleware/handleErrors');
const notFound = require('./middleware/notFound');
const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.get('/', (request, response) => {
  response.send('<h1>Blogs</h1>');
});

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});
app.post('/api/blogs', (request, response) => {
  const body = request.body;

  if (!body.title) {
    return response.status(400).json({
      error: 'title is missing',
    });
  }
  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  });

  newBlog.save().then((savedBlog) => response.json(savedBlog));
});

app.get('/api/blogs/:id', (request, response, next) => {
  const id = request.params.id;
  Blog.findById(id)
    .then((blog) => (blog ? response.send(blog) : response.status(404).end()))
    .catch(next);
});
app.put('/api/blogs/:id', (request, response, next) => {
  const id = request.params.id;
  const body = request.body;
  const editedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  Blog.findByIdAndUpdate(id, editedBlog, { new: true })
    .then((updatedBlog) => {
      if (updatedBlog) {
        response.json(updatedBlog);
      } else {
        response.status(404).json({ error: 'Blog not found' });
      }
    })
    .catch(next);
});

app.delete('/api/blogs/:id', (request, response, next) => {
  const id = request.params.id;
  Blog.findByIdAndDelete(id)
    .then((deletedBlog) => {
      if (deletedBlog) {
        response.status(204).end();
      } else {
        response.status(404).end();
      }
    })
    .catch(next);
});
app.use(notFound);
app.use(handleErrors);

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
