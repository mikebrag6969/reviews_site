import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../environments/environment";
import { Review } from "./review.model";

const BACKEND_URL = environment.apiUrl + "/reviews/";

@Injectable({ providedIn: "root" })
export class ReviewsService {
  private reviews: Review[] = [];
  private reviewsUpdated = new Subject<{ reviews: Review[]; reviewCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getReviews(reviewsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${reviewsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; reviews: any; maxReviews: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(reviewData => {
          return {
            reviews: reviewData.reviews.map(review => {
              return {
                title: review.title,
                content: review.content,
                id: review._id,
                imagePath: review.imagePath,
                creator: review.creator
              };
            }),
            maxReviews: reviewData.maxReviews
          };
        }) 
      )
      .subscribe(transformedReviewData => {
        console.log("transformedReviewData",transformedReviewData)
        this.reviews = transformedReviewData.reviews;
        this.reviewsUpdated.next({
          reviews: [...this.reviews],
          reviewCount: transformedReviewData.maxReviews
        });
      });
  }

  getReviewUpdateListener() {
    return this.reviewsUpdated.asObservable();
  }

  getReview(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addReview(title: string, content: string, image: File) {
    const reviewData = new FormData();
    reviewData.append("title", title);
    reviewData.append("content", content);
    reviewData.append("image", image, title);
    this.http
      .post<{ message: string; review: Review }>(
        BACKEND_URL,
        reviewData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  updateReview(id: string, title: string, content: string, image: File | string) {
    let reviewData: Review | FormData;
    if (typeof image === "object") {
      reviewData = new FormData();
      reviewData.append("id", id);
      reviewData.append("title", title);
      reviewData.append("content", content);
      reviewData.append("image", image, title);
    } else {
      reviewData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    this.http
      .put(BACKEND_URL + id, reviewData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deleteReview(reviewId: string) {
    return this.http.delete(BACKEND_URL + reviewId);
  }
}
