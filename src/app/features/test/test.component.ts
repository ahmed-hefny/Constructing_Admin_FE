import { Component} from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-test',
  imports: [ZXingScannerModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent  {
  
}
