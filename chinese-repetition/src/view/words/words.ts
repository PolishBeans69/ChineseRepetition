import { Component, OnInit, signal, inject, ChangeDetectorRef } from '@angular/core';
import { CommService } from '../../services/comm-service';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-words',
  styleUrl: './words.css',
  templateUrl: './words.html',
})
export class Words implements OnInit {
    private cdr = inject(ChangeDetectorRef);
    items = signal<any[]>([]);
    finishedBool = signal(false);

    constructor(private commService: CommService) {}

    async ngOnInit() {
        const data = await this.commService.getItems();
        this.items.set(data || []);
        this.finishedBool.set(true);
        this.cdr.markForCheck();
    }

    async deleteItem(id: number) {
        await this.commService.deleteItem(id);
        this.items.set(await this.commService.getItems() || []);
        this.cdr.markForCheck();
    }
}
