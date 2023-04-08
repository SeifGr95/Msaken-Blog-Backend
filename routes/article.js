const express = require("express");
const router = express.Router();
const Article = require("../models/article");
const multer = require("multer");
filename = "";
const mystorage = multer.diskStorage({
  destination: "./images",
  filename: (req, file, redirect) => {
    let date = Date.now();
    let fl = date + "." + file.mimetype.split("/")[1];
    redirect(null, fl);
    filename = fl;
  },
});
const upload = multer({ storage: mystorage });

router.post("/ajout", upload.any("image"), (req, res) => {
  let data = req.body;
  let article = new Article(data);
  article.date = new Date();
  article.image = filename;
  article.tags = data.tags.split(",");

  article
    .save()
    .then((saved) => {
      filename = "";
      res.status(200).send("saved");
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

//get all
router.get("/all", (req, res) => {
  Article.find({})
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch((err) => {
      res.statut(400).send(err);
    });
});

//get by id
router.get("/getbyid/:id", (req, res) => {
  let id = req.params.id;
  Article.findOne({ _id: id })
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch((err) => {
      res.statut(400).send(err);
    });
});

//get by idauthor
router.get("/getbyidauthor/:id", (req, res) => {
  let id = req.params.id;
  Article.find({ idAuthor: id })
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch((err) => {
      res.statut(400).send(err);
    });
});

// delete
router.delete("/supprimer/:id", (req, res) => {
  let id = req.params.id;
  Article.findByIdAndDelete({ _id: id })
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      res.statut(400).send(err);
    });
});

//update
router.put("/update/:id", upload.any("image"), (req, res) => {
  let id = req.params.id;
  let data = req.body;
  data.tags = data.tags.split(",");
  if (filename.length > 0) {
    data.image = filename;
  }

  Article.findByIdAndUpdate({ _id: id }, data)
    .then((article) => {
      filename = "";
      res.status(200).send(article);
    })
    .catch((err) => {
      res.statut(400).send(err);
    });
});

module.exports = router;
