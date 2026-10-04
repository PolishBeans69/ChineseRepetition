
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
    modePin = signal(false);

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
    async checkPin(): Promise<boolean> {
        return await this.commService.checkPin();
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
        this.modePin.set(await this.checkPin());
        this.cdr.markForCheck();
    }

    async onModeChange() {
        this.modeBool.set(await this.checkSet());
        this.modePin.set(await this.checkPin());
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

    private normalizeInput(value: string): string {
        return value.trim().toLowerCase();
    }

    async onEnter() {
        const input = this.normalizeInput(this.userInput());

        if (this.modeBool()) {
            if (input === this.normalizeInput(this.chineseWord().chinese)) {
                await this.correct();
            } else {
                await this.incorrect();
            }
        } else {
            if (this.normalizeInput(this.chineseWord().english).includes(input) && input.length > 0) {
                await this.correct();
            } else {
                await this.incorrect();
            }
        }
        await this.getItem();
        this.userInput.set('');
    }
}
