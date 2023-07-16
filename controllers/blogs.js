const blogsRouter = require("express").Router();
const User = require("../models/user");
const Blog = require("../models/blog");
const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  const decodedToken = jwt.verify(request.token, process.env.SECRET);

  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  const user = await User.findById(decodedToken.id);

  if (body.title === undefined || body.url === undefined) {
    return response.status(400).end();
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user.id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);

  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  const user = request.user;
  const blog = await Blog.findById(request.params.id);
  if (blog.user.toString() !== user.id.toString()) {
    return response.status(403).json({ error: "forbidden" });
  }

  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const { title, author, url, likes } = new Blog(request.body);

  const decodedToken = jwt.verify(request.token, process.env.SECRET);

  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  const user = request.user;
  const blog = await Blog.findById(request.params.id);
  if (blog.user.toString() !== user.id.toString()) {
    return response.status(403).json({ error: "forbidden" });
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  );
  response.status(200).json(updatedBlog);
});

module.exports = blogsRouter;
