import State from "./state";
import { CheckListItem } from "@material/mwc-list/mwc-check-list-item";
import { clearDefaultListButton, clearSelectedListButton, defaultList, selectedItemsList } from "./helpers";

class Renderer {
    renderInitialState() {
        State.items.forEach(product => {
            const listEl = product.selected ? selectedItemsList : defaultList
            const listItem = new CheckListItem()
            listItem.innerText = product.title
            listItem.selected = product.selected
            listItem.id = product.id
            listEl.prepend(listItem)
        })
    }

    handlePlaceholders() {
        defaultList.children.length === 0 ?
            defaultList.classList.add('placeholder-visible') :
            defaultList.classList.remove('placeholder-visible')

        selectedItemsList.children.length === 0 ?
            selectedItemsList.classList.add('placeholder-visible') :
            selectedItemsList.classList.remove('placeholder-visible')
    }

    handleButtonsDisabling() {
        clearDefaultListButton.disabled = defaultList.children.length === 0
        clearSelectedListButton.disabled = selectedItemsList.children.length === 0
    }
}

export default new Renderer()