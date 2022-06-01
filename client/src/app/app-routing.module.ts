import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
 
import { AuthGuard } from "./auth/auth.guard";
import { ReviewCreateComponent } from "./reviews/review-create/review-create.component";
import { ReviewListComponent } from "./reviews/review-list/review-list.component";

const routes: Routes = [
  { path: "", component: ReviewListComponent },
  { path: "create", component: ReviewCreateComponent, canActivate: [AuthGuard] },
  { path: "edit/:postId", component: ReviewCreateComponent, canActivate: [AuthGuard] },
 
  { path: "auth", loadChildren: () => import('./auth/auth.module').then(x => x.AuthModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
