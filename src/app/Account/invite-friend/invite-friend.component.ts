import { Component } from '@angular/core';
import { UserNavigationComponent } from '../user-navigation/user-navigation.component';

@Component({
  selector: 'app-invite-friend',
  standalone: true,
  imports: [UserNavigationComponent],
  templateUrl: './invite-friend.component.html',
  styleUrl: './invite-friend.component.css',
})
export class InviteFriendComponent {
  constructor() {}
  name: string = '';
  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      this.name = JSON.parse(localStorage.getItem('cusname') || '{}');
    }
  }
  copyInputMessage(inputElement: any) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }
}
