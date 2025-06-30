import { Component, OnInit ,Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  standalone: true,
})
export class ErrorComponent  implements OnInit {

   constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}

  ngOnInit() {}

}
