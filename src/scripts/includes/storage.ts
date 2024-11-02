import { IListItem } from "./helpers";

class Storage {
    save(state: IListItem[]) {
        localStorage.setItem('state', JSON.stringify(state))
    }

    get() {
        const json = localStorage.getItem('state')

        return json ? JSON.parse(json) : []
    }
}

export default new Storage()