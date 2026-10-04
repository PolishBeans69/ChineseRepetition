import { Component, signal, Output, EventEmitter } from '@angular/core';
import { CommService } from '../../services/comm-service';

@Component({
  imports: [],
  selector: 'app-settings',
  styleUrl: './settings.css',
  templateUrl: './settings.html',
})
export class Settings {
    mode = signal('EN ➙ CN');
    modeClass = signal(false);
    @Output() modeChangeEvent = new EventEmitter<void>();
    constructor(private commService: CommService) {

  }
  async modeChange() {
      await this.commService.switchSet();
      if (await this.commService.checkSet()) {
          this.mode.set('EN ➙ CN');
          this.modeClass.set(false);
      } else {
        this.mode.set('CN ➙ EN');
        this.modeClass.set(true);
      }
      this.modeChangeEvent.emit();
  }

}
