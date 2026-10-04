import { Service, signal } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';
import { ChineseWord } from '../types/chineseWordType';


@Service()
export class CommService {
    chineseSet = signal(true);


    async switchSet() {
        this.chineseSet.update((value) => !value);
    }
    async checkSet(): Promise<boolean> {
        return this.chineseSet();
    }
    async addItem(chinese: string, english: string) {
        return await invoke('add_item', { chinese, english });
    }

    async getItems(): Promise<Array<any>> {
        return await invoke('get_items');
    }
    async deleteItem(id: number) {
        return await invoke('delete_item', { id });
    }
    async getItem(): Promise<Array<any>> {
        return await invoke('get_item');
    }
    async updateCount(id: number) {
        return await invoke('update_count', { id });
    }
}
