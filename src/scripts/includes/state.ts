import { IListItem } from "./helpers";
import Storage from "./storage";

class State {
    private _items: IListItem[]

    constructor() {
        this._items = Storage.get()
    }

    get items() {
        return this._items
    }

    removeAllSelectedItemsFromState() {
        this._items = this._items.filter(stateItem => stateItem.selected === false)
        Storage.save(this._items)
    }

    removeAllNotSelectedItemsFromState() {
        this._items = this._items.filter(stateItem => stateItem.selected === true)
        Storage.save(this._items)
    }

    addItem ({listItem, position = 'end'}: {listItem: IListItem, position?: 'start' | 'end'}) {
        if (position === 'end') this._items.push(listItem)
        if (position === 'start') this._items.unshift(listItem)

        Storage.save(this._items)
    }

    removeItem(itemId: string) {
        this._items = this._items.filter(item => item.id !== itemId)
        Storage.save(this._items)
    }

    getItem(itemId: string) {
        const item = this._items.find(item => item.id === itemId)

        return item
    }

    // debug method
    // (use it, or use debugger instead
    logStateToTheConsole() {
        console.log({items: this._items})
    }
}


export default new State()