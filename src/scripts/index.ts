import '../styles/style.scss'

import '@material/mwc-top-app-bar'
import '@material/mwc-icon-button'
import '@material/mwc-dialog'
import '@material/mwc-button'
import '@material/mwc-list/mwc-check-list-item.js';
import '@material/mwc-list/mwc-list.js';
import {Dialog} from "@material/mwc-dialog/mwc-dialog";
import {List} from "@material/mwc-list/mwc-list";
import '@material/mwc-textfield';
import {TextField} from "@material/mwc-textfield/mwc-textfield";
import {SingleSelectedEvent} from "@material/mwc-list/mwc-list-foundation";
import {ListItemBase} from "@material/mwc-list/mwc-list-item-base";
import debounce from "./includes/debounce";

const navbarInfoButton: HTMLButtonElement = document.querySelector('mwc-icon-button#info')
const dialog: Dialog = document.querySelector('mwc-dialog#dialog')
navbarInfoButton.onclick = () => dialog.show()

interface IListItem {
  title: string,
  selected: boolean
}

class ListOfItems {
  private readonly defaultList: List = document.querySelector('#default-list')
  private readonly selectedItemsList: List = document.querySelector('#selected-items-list')
  private readonly textField: TextField = document.querySelector('mwc-textfield#product-name')
  private state: Array<IListItem>

  constructor() {
    this.setTextFieldEventHandler()
    this.removeUselessPlaceholderNodes()

    document.body.addEventListener('action', (e: SingleSelectedEvent) => {
      const list = e.target as List
      const listItems: ListItemBase[] = list.items
      const {index} = e.detail

      const currentNode = listItems.find((item, i) => i === index)
      const {selected, textContent} = currentNode
      const template: string =
        `<mwc-check-list-item ${selected && 'selected'}>${textContent}</mwc-check-list-item>`

      const newList = selected ? this.selectedItemsList : this.defaultList
      const position = newList === this.selectedItemsList ? 'afterbegin' : 'beforeend'

      const replaceListItem = debounce(() => {
        list.removeChild(currentNode)
        newList.insertAdjacentHTML(position, template)

        this.state.forEach(item => {
          if (item.title === textContent) {
            item.selected = !item.selected
          }
        })
        localStorage.setItem('state', JSON.stringify(this.state))

        this.populateEmptyLists()
        this.removeUselessPlaceholderNodes()
      }, 300)

      replaceListItem()
    })

    document.body.addEventListener('click', e => {
      const element = e.target as HTMLElement

      if (element.closest('.mwc-button') === null) {
        return
      }

      if (element.closest('.selected-list-wrapper')) {
        this.selectedItemsList.innerHTML = ''
        this.state = this.state.filter(item => item.selected === false)
      }

      if (element.closest('.default-list-wrapper')) {
        this.defaultList.innerHTML = ''
        this.state = this.state.filter(item => item.selected === true)
      }

      this.setLocalStorageState()
      this.populateEmptyLists()
    })
  }

  setLocalStorageState() {
    localStorage.setItem('state', JSON.stringify(this.state))
  }

  setTextFieldEventHandler() {
    this.textField
      .addEventListener('keyup', (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          const {value} = this.textField
          if (value === '') return

          const template: string =
            `<mwc-check-list-item>${value}</mwc-check-list-item>`

          this.defaultList.insertAdjacentHTML('afterbegin', template)
          this.state.push({
            title: value,
            selected: false
          })
          localStorage.setItem('state', JSON.stringify(this.state))

          this.textField.value = ''

          this.removeUselessPlaceholderNodes()
        }
      });
  }

  renderLists() {
    const stringState = localStorage.getItem('state')
    this.state = JSON.parse(stringState) || []

    this.state.forEach(({selected, title}) => {
      const template: string =
        `<mwc-check-list-item ${selected && 'selected'}>${title}</mwc-check-list-item>`

      const list = selected ? this.selectedItemsList : this.defaultList
      list.insertAdjacentHTML('beforeend', template)
    })

    this.populateEmptyLists()
  }

  populateEmptyLists() {
    const createPlaceHolder = () => {
      const placeholder = document.createElement('div')
      placeholder.innerText = 'Список пуст'
      placeholder.classList.add('placeholder-text-node')

      return placeholder
    }

    if (this.selectedItemsList.children.length === 0) {
      const emptyListTextNode = createPlaceHolder()
      this.selectedItemsList.appendChild(emptyListTextNode)
    }

    if (this.defaultList.children.length === 0) {
      const emptyListTextNode = createPlaceHolder()
      this.defaultList.appendChild(emptyListTextNode)
    }
  }

  removeUselessPlaceholderNodes() {
    if (this.selectedItemsList.children.length === 2) {
      const placeholderTextNode = this.selectedItemsList.querySelector('.placeholder-text-node')
      this.selectedItemsList.removeChild(placeholderTextNode)
    }

    if (this.defaultList.children.length === 2) {
      const placeholderTextNode = this.defaultList.querySelector('.placeholder-text-node')
      this.defaultList.removeChild(placeholderTextNode)
    }
  }

}

const listOfItems = new ListOfItems()
listOfItems.renderLists()