import '../styles/style.scss'

import '@material/mwc-top-app-bar'
import '@material/mwc-icon-button'
import '@material/mwc-dialog'
import '@material/mwc-button'
import '@material/mwc-list/mwc-check-list-item.js';
import '@material/mwc-list/mwc-list.js';
import '@material/mwc-textfield';
import { Dialog } from "@material/mwc-dialog/mwc-dialog";
import { List } from "@material/mwc-list/mwc-list";
import { SingleSelectedEvent } from "@material/mwc-list/mwc-list-foundation";
import { CheckListItem } from "@material/mwc-list/mwc-check-list-item";
import {
  defaultList,
  handlePlaceholders,
  renderInitialState,
  state,
  // showStateFactory,
  selectedItemsList,
  textField,
  removeAllSelectedItemsFromState,
  removeAllNotSelectedItemsFromState,
  handleButtonsDisabling,
  IListItem, ListItem, showStateFactory,
} from "./includes/helpers";
import { MDCDialogCloseEvent } from "@material/dialog/types";
import { Button } from "@material/mwc-button/mwc-button";

const navbarInfoButton: HTMLButtonElement = document.querySelector('mwc-icon-button#info')
const infoDialog: Dialog = document.querySelector('mwc-dialog#info-dialog')
navbarInfoButton.onclick = () => infoDialog.show()

// const showState = showStateFactory(true)

renderInitialState()
handleButtonsDisabling()
// showState()

textField.addEventListener('keyup', (event: KeyboardEvent) => {
  const enterPressed = event.key === 'Enter'

  if (enterPressed) {
    const { value } = textField;

    if (value.trim() === '') return;

    const newListItem = new ListItem(value, false, new Date().getTime().toString())
    state.push(newListItem)
    localStorage.setItem('state', JSON.stringify(state))
    const checkListItem = new CheckListItem()
    checkListItem.innerText = newListItem.title
    checkListItem.id = newListItem.id
    defaultList.prepend(checkListItem)
    // showState()
    handleButtonsDisabling()
    handlePlaceholders()

    textField.value = ''
  }
})

document.addEventListener('action', (event: SingleSelectedEvent) => {
  const listElement = event.target as List
  const selectedListItemIndex = event.detail.index
  const selectedListItem = listElement.children.item(selectedListItemIndex) as CheckListItem

  // TODO: rewrite this
  const newListId = listElement.id === 'js-default-list' ? 'js-selected-items-list' : 'js-default-list'
  const newList = document.querySelector(`#${newListId}`)

  // this peace of code is used to make sure that animation is ended
  // TODO: change hardcoded value of setTimeout; replace it with real animation duration
  const attributeName = 'shouldBeMoved'
  if (selectedListItem.getAttribute(attributeName) === 'true') return
  selectedListItem.setAttribute(attributeName, 'true')
  setTimeout(() => {
    selectedListItem.setAttribute(attributeName, 'false');

    const stateEl = state.find(item => item.id === selectedListItem.id)
    stateEl.selected = !stateEl.selected
    localStorage.setItem('state', JSON.stringify(state))
    newList.appendChild(selectedListItem)
    // showState()
    handleButtonsDisabling()
    handlePlaceholders()
  }, 300)
})


document.querySelectorAll('.js-clear-list-button').forEach((button: Button, i: number) => {
  const listEl = button.closest('.js-list-wrapper').querySelector('.js-mwc-list')

  let heading;
  if (listEl === defaultList) heading = 'Удалить список еще не купленных товаров?'
  if (listEl === selectedItemsList) heading = 'Удалить список уже приобретённых товаров?'
  if (heading === undefined) {
    console.warn('Что-то не так со списками покупок.. Вероятно, неправильно расставлены их id в разметке')
    console.warn('Очистить списки покупок временно не получится')
    return
  }

  const dialogId = `js-clear-list-dialog-${i + 1}`
  const primaryAction = 'confirm-deletion'
  const secondaryAction = 'cancel'
  const dialog = `
    <mwc-dialog heading="${heading}" id="${dialogId}">
      <mwc-button slot="primaryAction" dialogAction="${primaryAction}">Удалить</mwc-button>
      <mwc-button slot="secondaryAction" dialogAction="${secondaryAction}">Не удалять</mwc-button>
    </mwc-dialog>
  `

  const dialogContainer = document.querySelector('.js-dialog-container')
  dialogContainer.innerHTML += dialog

  setTimeout(() => {
    // wait until dialog is placed into dialogContainer
    // use event loop to delay this code execution
    const dialogRef: Dialog = dialogContainer.querySelector(`#${dialogId}`)
    dialogRef.addEventListener('closed', (e: MDCDialogCloseEvent) => {
      const { action } = e.detail;

      if (action === primaryAction) {
        listEl.innerHTML = ''
        if (listEl === defaultList) removeAllNotSelectedItemsFromState()
        if (listEl === selectedItemsList) removeAllSelectedItemsFromState()
        handleButtonsDisabling()
        handlePlaceholders()
        // showState()
      }
    })

    button.onclick = () => {
      if (listEl.children.length > 0) dialogRef.open = true
    }
  })
})