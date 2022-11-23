import { CheckListItem } from "@material/mwc-list/mwc-check-list-item";
import { TextField } from "@material/mwc-textfield";

export const textField: TextField = document.querySelector('mwc-textfield#product-name')
export const defaultList = document.querySelector('#js-default-list')
export const selectedItemsList = document.querySelector('#js-selected-items-list')


export interface IListItem {
  title: string,
  selected: boolean
}

export let state: IListItem[] = JSON.parse(localStorage.getItem('state')) || [];

export const renderInitialState = () => {
  state.forEach(product => {
    const listEl = product.selected ? selectedItemsList : defaultList
    const listItem = new CheckListItem()
    listItem.innerText = product.title
    listItem.selected = product.selected
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


export const saveState = () => {
  const listItems = document.querySelectorAll('mwc-check-list-item')
  // TODO: figure out why spread syntax throws an error here
  state = Array.from(listItems).map((item: CheckListItem) => {
    return {
      title: item.innerText,
      selected: item.selected
    }
  })

  localStorage.setItem('state', JSON.stringify(state))
}

export const updateStateWithOneNewDefaultValue = (value: string) => {
  state = [...state, {title: value, selected: false}]

  localStorage.setItem('state', JSON.stringify(state))
}

export const showStateFactory = () => {
  // const showState = showStateFactory()

  const stateContainer = document.createElement('div.state-container')
  document.body.prepend(stateContainer)

  return () => stateContainer.innerHTML = JSON.stringify(state)
}

