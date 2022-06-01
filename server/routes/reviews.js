const express = require("express");

const ReviewController = require("../controllers/reviews");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("", checkAuth, extractFile, ReviewController.createReview);

router.put("/:id", checkAuth, extractFile, ReviewController.updateReview);

router.get("", ReviewController.getReviews);

router.get("/:id", ReviewController.getReview);

router.delete("/:id", checkAuth, ReviewController.deleteReview);

module.exports = router;
