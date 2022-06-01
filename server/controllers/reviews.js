const Review = require("../models/review");

exports.createReview = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  console.log("url", url);

  console.log("wytf", {
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
  });
  const review = new Review({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
  });
  review
    .save()
    .then((createdReview) => {
      res.status(201).json({
        message: "Review added successfully",
        review: {
          ...createdReview,
          id: createdReview._id,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Creating a review failed!",
      });
    });
};

exports.updateReview = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const review = new Review({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId,
  });

  Review.updateOne({ _id: req.params.id, creator: req.userData.userId }, review)
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Couldn't udpate review!",
      });
    });
};

exports.getReviews = (req, res, next) => {
  console.log("yoyoy");
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const reviewQuery = Review.find();
  let fetchedReviews;
  if (pageSize && currentPage) {
    reviewQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  reviewQuery
    .then((documents) => {
      fetchedReviews = documents;
      return Review.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Reviews fetched successfully!",
        reviews: fetchedReviews,
        maxReviews: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching reviews failed!",
      });
    });
};

exports.getReview = (req, res, next) => {
  Review.findById(req.params.id)
    .then((review) => {
      if (review) {
        res.status(200).json(review);
      } else {
        res.status(404).json({ message: "Review not found!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching review failed!",
      });
    });
};

exports.deleteReview = (req, res, next) => {
  Review.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Deleting reviews failed!",
      });
    });
};
