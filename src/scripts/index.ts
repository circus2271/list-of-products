import '../styles/style.scss'

import '@material/mwc-top-app-bar'
import '@material/mwc-icon-button'
import '@material/mwc-dialog'
import '@material/mwc-button'
import '@material/mwc-list/mwc-check-list-item.js';
import '@material/mwc-list/mwc-list.js';
import { Dialog } from "@material/mwc-dialog/mwc-dialog";
import { List } from "@material/mwc-list/mwc-list";
import '@material/mwc-textfield';
import { SingleSelectedEvent } from "@material/mwc-list/mwc-list-foundation";
import { CheckListItem } from "@material/mwc-list/mwc-check-list-item";
import {
  defaultList,
  handlePlaceholders,
  renderInitialState,
  saveState,
  // showStateFactory,
  selectedItemsList,
  textField,
  updateStateWithOneNewDefaultValue
} from "./includes/helpers";
import { MDCDialogCloseEvent } from "@material/dialog/types";
import { Button } from "@material/mwc-button";

const navbarInfoButton: HTMLButtonElement = document.querySelector('mwc-icon-button#info')
const infoDialog: Dialog = document.querySelector('mwc-dialog#info-dialog')
navbarInfoButton.onclick = () => infoDialog.show()

// const showState = showStateFactory()

renderInitialState()

textField.addEventListener('keyup', (event: KeyboardEvent) => {
  const enterPressed = event.key === 'Enter'

  if (enterPressed) {
    const { value } = textField;

    if (value.trim() === '') return;

    // because it is faster than saveState()
    updateStateWithOneNewDefaultValue(value);
    const checkListItem = new CheckListItem()
    checkListItem.innerText = value

    defaultList.prepend(checkListItem)
    handlePlaceholders()

    textField.value = ''
  }
})

document.addEventListener('action', (event: SingleSelectedEvent) => {
  const listElement = event.target as List
  const selectedListItemIndex = event.detail.index
  const selectedListItem = listElement.children.item(selectedListItemIndex) as HTMLElement
  // console.log(selectedListItemIndex)

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
    newList.appendChild(selectedListItem)

    saveState()
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
        saveState()
        handlePlaceholders()
      }
    })

    button.onclick = () => dialogRef.open = true
  })
})