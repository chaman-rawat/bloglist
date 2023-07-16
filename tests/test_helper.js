const Blog = require("../models/blog");
const User = require("../models/user");

const initialUsers = [
  {
    username: "a",
    name: "a",
    password: "p",
    // passwordHash:
    //   "$2a$10$leCnxIFMbxNCOuEPFY0iX./lYbicAHMvLX/c.NxgtExElEPAjD6em",
  },
  {
    username: "b",
    name: "b",
    password: "b",
    // passwordHash:
    //   "$2a$10$leCnxIFMbxNCOuEPFY0iX./lYbicAHMvLX/c.NxgtExElEPAjD6em",
  },
];

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialUsers,
  initialBlogs,
  blogsInDb,
  usersInDb,
};
