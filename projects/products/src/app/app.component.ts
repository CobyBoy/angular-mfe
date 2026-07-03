import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { eventBus, store } from '@mfe/communication-sdk';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'products';
  private unsubscribe?: () => void;

  ngOnInit() {
    this.listenToShell();
    this.listenToAuth();
  }

  listenToShell() {
    eventBus.subscribe('products', (payload) => {
      console.log('Received from shell:', payload);
    });
  }

  

  listenToAuth() {
    this.unsubscribe = store.subscribe<{
      loggedIn: boolean;
      user: {
        id: number;
        name: string;
      };
    }>('auth', (authorization) => {
      console.log('%cListening to auth changes in store...', 'color: yellow; font-weight: bold;', authorization);
    });

  }

  ngOnDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
