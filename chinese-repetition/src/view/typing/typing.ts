
import { Component, signal, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommService } from '../../services/comm-service';
import { ChineseWord } from '../../types/chineseWordType';

@Component({
  selector: 'app-typing',
  imports: [FormsModule],
  templateUrl: './typing.html',
  styleUrl: './typing.css',
})
export class Typing implements OnInit {
    private cdr = inject(ChangeDetectorRef);
    chineseText = signal('');
    userInput = signal('');
    correctSignal = signal(false);
    incorrectSignal = signal(false);
    mode = signal('');
    modeBool = signal(true);

    chineseWord = signal<ChineseWord>({
        id: 0,
        chinese: '',
        pinyin: '',
        english: '',
        count: 0,
    });
    previousWord = signal<ChineseWord>({
        id: 0,
        chinese: '',
        pinyin: '',
        english: '',
        count: 0,
    });


    constructor(private commService: CommService) {}

    async ngOnInit() {
        await this.getItem();
    }

    async checkSet(): Promise<boolean> {
        return await this.commService.checkSet();
    }

    async getItem() {
        const item: any = await this.commService.getItem();
        if (item) {
            if (Array.isArray(item)) {
                this.chineseWord.set({
                    id: item[0],
                    chinese: item[1],
                    pinyin: item[2],
                    english: item[3],
                    count: item[4],
                });
            } else {
                this.chineseWord.set(item);
            }
        }
        this.modeBool.set(await this.checkSet());
        this.cdr.markForCheck();
    }

    async onModeChange() {
        this.modeBool.set(await this.checkSet());
        this.cdr.markForCheck();
    }

    private feedbackTimeout: any = null;

    async correct() {
        if (this.feedbackTimeout) {
            clearTimeout(this.feedbackTimeout);
        }
        this.previousWord.set(this.chineseWord());
        this.correctSignal.set(true);
        this.incorrectSignal.set(false);
        this.cdr.markForCheck();
        this.commService.updateCount(this.previousWord().id);
        this.feedbackTimeout = setTimeout(() => {
            this.correctSignal.set(false);
            this.cdr.markForCheck();
        }, 1500);
    }

    async incorrect() {
        if (this.feedbackTimeout) {
            clearTimeout(this.feedbackTimeout);
        }
        this.previousWord.set(this.chineseWord());
        this.correctSignal.set(false);
        this.incorrectSignal.set(true);
        this.cdr.markForCheck();
        this.feedbackTimeout = setTimeout(() => {
            this.incorrectSignal.set(false);
            this.cdr.markForCheck();
        }, 3000);
    }

    async onEnter() {
        if (this.modeBool()) {
            if (this.userInput().trim() === this.chineseWord().chinese.trim()) {
                await this.correct();
            } else {
                await this.incorrect();
            }
        } else {
            if (this.chineseWord().english.trim().includes(this.userInput().trim())) {
                await this.correct();
            } else {
                await this.incorrect();
            }
        }
        await this.getItem();
        this.userInput.set('');
    }
}
