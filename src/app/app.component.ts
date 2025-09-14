import { Component } from '@angular/core';

@Component({
selector: 'app-root',
template: `
<app-navbar></app-navbar>
<main class="main-content">
<router-outlet></router-outlet>
</main>
`,
styles: [`
.main-content {
margin-top: 64px; /* Height of Material toolbar */
padding: 20px;
min-height: calc(100vh - 84px);
      background-color: #f5f5f5;
    }
  `]
})
export class AppComponent {
  title = 'User Management System';
}