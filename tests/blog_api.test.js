const mongoose = require("mongoose");
const supertest = require("supertest");
// const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./test_helper");
const api = supertest(app);

let loginUser = null;
let token = "";

beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});

  for (let user of helper.initialUsers) {
    let userObject = new User(user);
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(user.password, saltRounds);
    userObject.passwordHash = passwordHash;
    await userObject.save();
  }
  loginUser = await api.post("/api/login").send(helper.initialUsers[0]);
  loginUser = loginUser.body;
  token = loginUser.token;

  for (let blog of helper.initialBlogs) {
    await api
      .post("/api/blogs")
      .send(blog)
      .set({ authorization: `Bearer ${token}` });
  }
}, 100000);

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
}, 100000);

test("blog posts has property named id", () => {
  const blog = new Blog();
  expect(blog.id).toBeDefined();
}, 100000);

describe("addition of a blog", () => {
  test("authorization is not provided gives 400", async () => {
    const newBlog = {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
    };

    await api.post("/api/blogs").send(newBlog).expect(400);
  }, 100000);

  test("blog added successfully", async () => {
    const newBlog = {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set({ authorization: `Bearer ${token}` })
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
  }, 100000);

  test("blog likes value defaults to 0", async () => {
    const newBlog = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    };

    const addedBlog = await api
      .post("/api/blogs")
      .send(newBlog)
      .set({ authorization: `Bearer ${token}` })
      .expect(201)
      .expect("Content-Type", /application\/json/);

    expect(addedBlog.body.likes).toBe(0);
  }, 100000);

  test("blog title or url properties are missing gives 400 bad request", async () => {
    const newBlog = {
      author: "Edsger W. Dijkstra",
      likes: 12,
    };

    await api
      .post("/api/blogs")
      .set({ authorization: `Bearer ${token}` })
      .send(newBlog)
      .expect(400);
  }, 100000);
});

describe("deletion of a blog", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ authorization: `Bearer ${token}` })
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const titles = blogsAtEnd.map((r) => r.title);

    expect(titles).not.toContain(blogToDelete.title);
  }, 100000);
});

describe("updation of a blog", () => {
  test("likes updated successfully", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    blogToUpdate.likes = 666;

    const blogAfterEnd = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set({ authorization: `Bearer ${token}` })
      .send(blogToUpdate)
      .expect(200);

    expect(blogAfterEnd.body.likes).toBe(666);
  }, 100000);
});

afterAll(async () => {
  await mongoose.connection.close();
});
