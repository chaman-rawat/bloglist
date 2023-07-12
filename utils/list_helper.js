const totalLikes = (blogs) => {
  if (blogs.length === 0) return 0;
  return blogs.reduce((total, blog) => total + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  const maxLikes = Math.max(...blogs.map((blog) => blog.likes));
  return blogs
    .map((blog) => {
      return {
        title: blog.title,
        author: blog.author,
        likes: blog.likes,
      };
    })
    .find((blog) => blog.likes === maxLikes);
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {};
  const authors = {};
  let maxBlogs = 0;
  blogs.forEach((blog) => {
    authors[blog.author] = (authors[blog.author] || 0) + 1;
    maxBlogs = Math.max(maxBlogs, authors[blog.author]);
  });

  for (const author in authors) {
    if (authors[author] === maxBlogs) {
      return {
        author,
        blogs: maxBlogs,
      };
    }
  }
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return {};
  const authors = {};
  let mostLikes = 0;
  blogs.forEach((blog) => {
    authors[blog.author] = (authors[blog.author] || 0) + blog.likes;
    mostLikes = Math.max(mostLikes, authors[blog.author]);
  });

  for (const author in authors) {
    if (authors[author] === mostLikes) {
      return {
        author,
        likes: mostLikes,
      };
    }
  }
};

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
