import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";

import { ReviewsService } from "../reviews.service";
import { Review } from "../review.model";
import { mimeType } from "./mime-type.validator";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-review-create",
  templateUrl: "./review-create.component.html",
  styleUrls: ["./review-create.component.css"]
})
export class ReviewCreateComponent implements OnInit, OnDestroy {
  enteredTitle = "";
  enteredContent = "";
  review: Review;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = "create";
  private reviewId: string;
  private authStatusSub: Subscription;

  constructor(
    public reviewsService: ReviewsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("reviewId")) {
        this.mode = "edit";
        this.reviewId = paramMap.get("reviewId");
        this.isLoading = true;
        this.reviewsService.getReview(this.reviewId).subscribe(reviewData => {
          this.isLoading = false;
          this.review = {
            id: reviewData._id,
            title: reviewData.title,
            content: reviewData.content,
            imagePath: reviewData.imagePath,
            creator: reviewData.creator
          };
          this.form.setValue({
            title: this.review.title,
            content: this.review.content,
            image: this.review.imagePath
          });
        });
      } else {
        this.mode = "create";
        this.reviewId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSaveReview() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.reviewsService.addReview(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.reviewsService.updateReview(
        this.reviewId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
