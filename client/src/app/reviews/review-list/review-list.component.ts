import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";

import { Review } from "../review.model";
import { ReviewsService } from "../reviews.service";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-review-list",
  templateUrl: "./review-list.component.html",
  styleUrls: ["./review-list.component.css"]
})
export class ReviewListComponent implements OnInit, OnDestroy {
  // reviews = [
  //   { title: "First Review", content: "This is the first review's content" },
  //   { title: "Second Review", content: "This is the second review's content" },
  //   { title: "Third Review", content: "This is the third review's content" }
  // ];
  reviews: Review[] = [];
  isLoading = false;
  totalReviews = 0;
  reviewsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private reviewsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public reviewsService: ReviewsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.reviewsService.getReviews(this.reviewsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.reviewsSub = this.reviewsService
      .getReviewUpdateListener()
      .subscribe((reviewData: { reviews: Review[]; reviewCount: number }) => {
        this.isLoading = false;
        this.totalReviews = reviewData.reviewCount;
        this.reviews = reviewData.reviews;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.reviewsPerPage = pageData.pageSize;
    this.reviewsService.getReviews(this.reviewsPerPage, this.currentPage);
  }

  onDelete(reviewId: string) {
    this.isLoading = true;
    this.reviewsService.deleteReview(reviewId).subscribe(() => {
      this.reviewsService.getReviews(this.reviewsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.reviewsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
