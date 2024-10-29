import '../styles/style.scss'

import '@material/mwc-top-app-bar-fixed'
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
  selectedItemsList,
  textField,
  removeAllSelectedItemsFromState,
  removeAllNotSelectedItemsFromState,
  handleButtonsDisabling,
  ListItem
} from "./includes/helpers";
import { MDCDialogCloseEvent } from "@material/dialog/types";

// wait until all custom elements are registered
// then show page body
const customElementsTagNames = ['mwc-top-app-bar-fixed', 'mwc-icon-button', 'mwc-dialog', 'mwc-button', 'mwc-textfield', 'mwc-list'];
(() => {
  Promise.allSettled(
    customElementsTagNames.map(customElement => {
      return customElements.whenDefined(customElement)
    })
  ).then(() => {
    setTimeout(() => {
      document.body.classList.add('ready');
    // }, 250)
    }, 300)
    // }, 0)
  })
})()


const navbarInfoButton: HTMLButtonElement = document.querySelector('mwc-icon-button#info')
const infoDialog: Dialog = document.querySelector('mwc-dialog#info-dialog')
navbarInfoButton.onclick = () => infoDialog.show()

renderInitialState()
handleButtonsDisabling()

textField.addEventListener('keyup', (event: KeyboardEvent) => {
  const enterPressed = event.key === 'Enter'

  if (enterPressed) {
    const {value} = textField;

    if (value.trim() === '') return;

    const newListItem = new ListItem(value.trim(), false, new Date().getTime().toString())
    state.push(newListItem)
    localStorage.setItem('state', JSON.stringify(state))
    const checkListItem = new CheckListItem()
    checkListItem.innerText = newListItem.title
    checkListItem.id = newListItem.id
    defaultList.prepend(checkListItem)

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
  const newListId = listElement.id === 'first' ? 'second' : 'first'
  const newList = document.getElementById(newListId)

  // this peace of.. code is used to make sure that checkbox animation is ended
  // TODO: change hardcoded value of setTimeout; replace it with real animation duration
  const attributeName = 'shouldBeMoved'
  if (selectedListItem.getAttribute(attributeName) === 'true') return
  selectedListItem.setAttribute(attributeName, 'true')
  setTimeout(() => {
    selectedListItem.setAttribute(attributeName, 'false');

    const stateEl = state.find(item => item.id === selectedListItem.id)
    stateEl.selected = !stateEl.selected
    localStorage.setItem('state', JSON.stringify(state))
    const checkListItem = new CheckListItem()
    checkListItem.innerText = selectedListItem.innerHTML
    checkListItem.id = selectedListItem.id
    checkListItem.selected = stateEl.selected

    listElement.removeChild(selectedListItem)
    newList.appendChild(checkListItem)
    // newList.prepend(checkListItem)

    handleButtonsDisabling()
    handlePlaceholders()
  }, 300)
})


document.querySelectorAll('.js-clear-list-button').forEach((button: HTMLHtmlElement) => {
  const listEl = button.closest('.js-list-wrapper').querySelector('.js-mwc-list')
  const listId = listEl.id
  const dialogId = listId === 'first' ? 'first-dialog' : 'second-dialog'
  const dialog = document.getElementById(dialogId) as Dialog

  dialog.addEventListener('closed', (e: MDCDialogCloseEvent) => {
    const {action} = e.detail;

    if (action === 'delete') {
      listEl.innerHTML = ''
      if (listEl === defaultList) removeAllNotSelectedItemsFromState()
      if (listEl === selectedItemsList) removeAllSelectedItemsFromState()

      handleButtonsDisabling()
      handlePlaceholders()
    }
  })

  button.onclick = () => dialog.open = true;
})
