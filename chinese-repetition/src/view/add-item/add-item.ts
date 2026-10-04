import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommService } from '../../services/comm-service';
import { ChineseWord } from '../../types/chineseWordType';

@Component({
  imports: [FormsModule],
  selector: 'app-add-item',
  styleUrl: './add-item.css',
  templateUrl: './add-item.html',
})
export class AddItem implements OnInit {
    chineseText = signal('');
    userInputChinese = signal('');
    userInputEnglish = signal('');

    chineseWord: ChineseWord = {
        id: 0,
        chinese: '',
        pinyin: '',
        english: '',
        count: 0,
    };

    constructor(private commService: CommService) {}

    async ngOnInit() {
    }

    async checkSet(): Promise<boolean> {
        return await this.commService.checkSet();
    }
    async onEnter() {
        const chinese = this.userInputChinese().trim();
        const english = this.userInputEnglish().trim();
        if (chinese && english) {
            try {
                await this.commService.addItem(chinese, english);
                this.userInputChinese.set('');
                this.userInputEnglish.set('');
            } catch (error) {
                console.error('Failed to add item:', error);
            }
        }
    }
}
