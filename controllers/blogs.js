const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);
  if (blog.title === undefined || blog.url === undefined) {
    return response.status(400).end();
  }
  const result = await blog.save();
  response.status(201).json(result);
});

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const { title, author, url, likes } = new Blog(request.body);

  console.log("---------- Here Iam now :");
  console.log(request.params.id);
  console.log({ title, author, url, likes });
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    {
      new: true,
      // runValidators: true,
      // context: "query",
    }
  );
  response.status(200).json(updatedBlog);
});

module.exports = blogsRouter;
