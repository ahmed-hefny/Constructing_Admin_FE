import { Routes } from "@angular/router";
import { SystemRoles } from "app/core/constants/app.constants";
import { hasRoleGuard } from "app/core/guards";

export default [
  {
    path: "",
    loadComponent: () =>
      import("./users.component").then((m) => m.UsersComponent),
  },
  {
    path: "create",
    canActivate: [hasRoleGuard],
    data: { roles: [SystemRoles.ADMIN] },
    loadComponent: () =>
      import("./add-edit-user/add-edit-user.component").then(
        (m) => m.CreateUserComponent
      ),
  },
  {
    path: "edit/:id",
    canActivate: [hasRoleGuard],
    data: { roles: [SystemRoles.ADMIN] },
    loadComponent: () =>
      import("./add-edit-user/add-edit-user.component").then(
        (m) => m.CreateUserComponent
      ),
  },
] as Routes;
