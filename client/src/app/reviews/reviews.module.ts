import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { ReviewCreateComponent } from "./review-create/review-create.component";
import { ReviewListComponent } from "./review-list/review-list.component";
import { AngularMaterialModule } from "../angular-material.module";

@NgModule({
  declarations: [ReviewCreateComponent, ReviewListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class ReviewsModule {}
