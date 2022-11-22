import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'project-page',
    loadChildren: () => import('./project-page/project-page.module').then( m => m.ProjectPagePageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'tester-page',
    loadChildren: () => import('./tester-page/tester-page.module').then( m => m.TesterPagePageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'create-account',
    loadChildren: () => import('./create-account/create-account.module').then( m => m.CreateAccountPageModule)
  },
  {
    path: 'create-project',
    loadChildren: () => import('./create-project/create-project.module').then( m => m.CreateProjectPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
