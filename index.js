const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

let posts = [
  {
    id: uuidv4(), //id should be unique
    username: "Priyanshu  Raj",
    content: "I got selected for my 1st Internship!",
  },
  {
    id: uuidv4(),
    username: "Mayank Sinha",
    content: "Hard work is important to achive success",
  },
  {
    id: uuidv4(),
    username: "Atul Kumar",
    content: "I Love Coding :)",
  },
];

app.get("/", (req, res) => {
  res.redirect("/posts");
});

app.get("/posts", (req, res) => {
  res.render("index.ejs", { posts });
});

app.get("/posts/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/posts", (req, res) => {
  let { username, content } = req.body;
  let id = uuidv4();
  posts.push({ id, username, content }); // adding to database
  res.redirect("/posts"); //use get
});

app.get("/posts/:id", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => id === p.id);
  if (!post) {
    return res.send("Post not found");
  }
  res.render("show.ejs", { post });
});

app.patch("/posts/:id", (req, res) => {
  let { id } = req.params;
  let newContent = req.body.content;
  let post = posts.find((p) => id === p.id);
  if (!post) {
    return res.send("Post not found");
  }
  post.content = newContent;
  console.log(post);
  res.redirect("/posts");
});

app.get("/posts/:id/edit", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => id === p.id);
  if (!post) {
    return res.send("Post not found");
  }
  res.render("edit.ejs", { post });
});

app.delete("/posts/:id", (req, res) => {
  let { id } = req.params;
  posts = posts.filter((p) => id !== p.id);
  res.redirect("/posts");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`server is listening on port: ${PORT}`);
});
