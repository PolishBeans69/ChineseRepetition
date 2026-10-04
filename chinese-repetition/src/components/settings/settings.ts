import { Component, signal, Output, EventEmitter } from '@angular/core';
import { CommService } from '../../services/comm-service';

@Component({
  imports: [],
  selector: 'app-settings',
  styleUrl: './settings.css',
  templateUrl: './settings.html',
})
export class Settings {
    mode = signal('EN');
    modeClass = signal(false);
    modePinClass = signal(false);

    @Output() modeChangeEvent = new EventEmitter<void>();
    constructor(private commService: CommService) {

  }
  async modeChange() {
      await this.commService.switchSet();
      if (await this.commService.checkSet()) {
          this.mode.set('EN');
          this.modeClass.set(false);
          this.modePinChange()
      } else {
        this.mode.set('CN');
        this.modeClass.set(true);
      }
      this.modeChangeEvent.emit();
  }
  async modePinChange() {
      await this.commService.switchPin();
      if (await this.commService.checkPin()) {
          this.modePinClass.set(true);
      } else {
          this.modePinClass.set(false);
      }
      this.modeChangeEvent.emit();
  }

}
