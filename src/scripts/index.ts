import '../styles/style.scss'
// import delay from './includes/delay.ts'
//
// (async () => {
//     await delay(3000)
//     console.log('Hello world')
// })()

// import '@material/mwc-icon/mwc-icon-font'
import '@material/mwc-top-app-bar'
import '@material/mwc-icon-button'
import '@material/mwc-dialog'
import '@material/mwc-button'
import '@material/mwc-list/mwc-check-list-item.js';
import '@material/mwc-list/mwc-list.js';
import {Dialog} from "@material/mwc-dialog/mwc-dialog";
import {ActionDetail, List} from "@material/mwc-list/mwc-list";
import {CheckListItem} from "@material/mwc-list/mwc-check-list-item";
import '@material/mwc-textfield';
import {TextField} from "@material/mwc-textfield/mwc-textfield";
import {SingleSelectedEvent} from "@material/mwc-list/mwc-list-foundation";
import {ListItemBase} from "@material/mwc-list/mwc-list-item-base";

const navbarInfoButton: HTMLButtonElement = document.querySelector('mwc-icon-button#info')
const dialog: Dialog = document.querySelector('mwc-dialog#dialog')
navbarInfoButton.onclick = () => dialog.show()

interface IListItem {
  title: string,
  selected: boolean
}

const listItems: Array<IListItem> = [
  {
    title: 'Несколько апельсинов',
    selected: false
  },
  {
    title: 'Дыня',
    selected: false
  },
  {
    title: 'Ананас',
    selected: false
  },
  {
    title: 'Абрикосы',
    selected: false
  },
  {
    title: 'Поп корн',
    selected: false
  },
  {
    title: 'Финики',
    selected: true
  },
  {
    title: 'Папайя',
    selected: true
  }
]

class ListOfItems {
  // TODO: Sanitize users input
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Safely_inserting_external_content_into_a_page
  private readonly defaultList: List = document.querySelector('#default-list')
  private readonly selectedItemsList: List = document.querySelector('#selected-items-list')
  private readonly textField: TextField = document.querySelector('mwc-textfield#product-name')
  private state: Array<IListItem> = listItems

  constructor() {
    this.setTextFieldEventHandler()

    document.body.addEventListener('action', (e: SingleSelectedEvent) => {
      const list = e.target as List
      const listItems: ListItemBase[] = list.items
      const { index } = e.detail

      const currentNode = listItems.find((item, i) => i === index)
      const { selected, textContent } = currentNode
      const template: string =
        `<mwc-check-list-item ${selected && 'selected'}>${textContent}</mwc-check-list-item>`

      const newList = selected ? this.selectedItemsList : this.defaultList
      list.removeChild(currentNode)
      newList.insertAdjacentHTML('afterbegin', template)
    })
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
          this.textField.value = ''
        }
      });
  }

  renderLists() {
    this.state.forEach(({selected, title}) => {
      const template: string =
        `<mwc-check-list-item ${selected && 'selected'}>${title}</mwc-check-list-item>`

      const list = selected ? this.selectedItemsList : this.defaultList
      list.insertAdjacentHTML('beforeend', template)
    })
  }
}

const listOfItems = new ListOfItems()
listOfItems.renderLists()