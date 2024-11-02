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
  selectedItemsList,
  textField,
  ListItem,
} from "./includes/helpers";
import { MDCDialogCloseEvent } from "@material/dialog/types";
import State from "./includes/state";
import Renderer from "./includes/renderer";

// wait until all custom elements are registered
// then show page body
const customElementsTagNames = ['mwc-top-app-bar-fixed', 'mwc-icon-button', 'mwc-dialog', 'mwc-button', 'mwc-textfield', 'mwc-list'];
(() => {
  Promise.allSettled(
    customElementsTagNames.map(customElement => {
      return customElements.whenDefined(customElement)
    })
  ).then(() => {
    document.body.classList.add('ready');
  })
})()


const navbarInfoButton: HTMLButtonElement = document.querySelector('mwc-icon-button#info')
const infoDialog: Dialog = document.querySelector('mwc-dialog#info-dialog')
navbarInfoButton.onclick = () => infoDialog.show()

Renderer.renderInitialState()
Renderer.handlePlaceholders()
Renderer.handleButtonsDisabling()

textField.addEventListener('keyup', (event: KeyboardEvent) => {
  const enterPressed = event.key === 'Enter'

  if (enterPressed) {
    const {value} = textField;

    if (value.trim() === '') return;

    const newListItem = new ListItem({title: value.trim()})
    State.addItem({listItem: newListItem})
    const checkListItem = new CheckListItem()
    checkListItem.innerText = newListItem.title
    checkListItem.id = newListItem.id
    defaultList.prepend(checkListItem)

    Renderer.handleButtonsDisabling()
    Renderer.handlePlaceholders()

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

    const el = State.getItem(selectedListItem.id)
    el.selected = !el.selected
    State.removeItem(el.id)
    const newListItem = new ListItem({title: el.title, selected: el.selected})
    State.addItem({listItem: newListItem, position: 'start'})
    const checkListItem = new CheckListItem()
    checkListItem.innerText = newListItem.title
    checkListItem.id = newListItem.id
    checkListItem.selected = newListItem.selected

    listElement.removeChild(selectedListItem)
    newList.appendChild(checkListItem)

    Renderer.handleButtonsDisabling()
    Renderer.handlePlaceholders()
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
      if (listEl === defaultList) State.removeAllNotSelectedItemsFromState()
      if (listEl === selectedItemsList) State.removeAllSelectedItemsFromState()

      Renderer.handleButtonsDisabling()
      Renderer.handlePlaceholders()
    }
  })

  button.onclick = () => dialog.open = true;
})
