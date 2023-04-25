import { CheckListItem } from "@material/mwc-list/mwc-check-list-item";
import { TextField } from "@material/mwc-textfield";
import { Button } from "@material/mwc-button/mwc-button";

export const textField: TextField = document.querySelector('mwc-textfield#product-name')
export const defaultList = document.querySelector('#js-default-list')
export const selectedItemsList = document.querySelector('#js-selected-items-list')
export const clearDefaultListButton: Button = document.querySelector('#js-clear-default-list-button')
export const clearSelectedListButton: Button = document.querySelector('#js-clear-selected-list-button')

export interface IListItem {
  title: string,
  selected: boolean,
  id: string // new Date().getTime()
}

export class ListItem implements IListItem {
  constructor(public title: string, public selected: boolean, public id: string) {
  }
}

export let state: IListItem[] = JSON.parse(localStorage.getItem('state')) || [];
// window['state'] = state
export const renderInitialState = () => {
  state.forEach(product => {
    const listEl = product.selected ? selectedItemsList : defaultList
    const listItem = new CheckListItem()
    listItem.innerText = product.title
    listItem.selected = product.selected
    listItem.id = product.id
    listEl.appendChild(listItem)
  })

  handlePlaceholders()
}

export const handlePlaceholders = () => {
  defaultList.children.length === 0 ?
    defaultList.classList.add('placeholder-visible') :
    defaultList.classList.remove('placeholder-visible')

  selectedItemsList.children.length === 0 ?
    selectedItemsList.classList.add('placeholder-visible') :
    selectedItemsList.classList.remove('placeholder-visible')
}


export const removeAllSelectedItemsFromState = () => {
  state = state.filter(stateItem => stateItem.selected === false)
  localStorage.setItem('state', JSON.stringify(state))
}

export const removeAllNotSelectedItemsFromState = () => {
  state = state.filter(stateItem => stateItem.selected === true)
  localStorage.setItem('state', JSON.stringify(state))
}

export const handleButtonsDisabling = () => {
  clearDefaultListButton.disabled = defaultList.children.length === 0
  clearSelectedListButton.disabled = selectedItemsList.children.length === 0
}
