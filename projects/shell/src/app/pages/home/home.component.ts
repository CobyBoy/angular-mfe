import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { eventBus, store } from '@mfe/communication-sdk';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  title = 'home';
  private unsubscribe?: () => void;

  ngOnInit() {
    this.dispatchToProducts();
    this.setAuth();
  }

  dispatchToProducts() {
    console.log('%cDispatching to products...', 'color: yellow; font-weight: bold;');
    eventBus.publish({
      payload: {
        message: 'Hello from shell',
      },
      type: 'products',
    });
  }

  setAuth() {
    console.log('%cSetting auth in store...', 'color: yellow; font-weight: bold;');
      store.set('auth', {
        loggedIn: true,
        user: {
          id: 1,
          name: 'Coby',
        },
      });
    }


    ngOnDestroy() {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
    }
}
