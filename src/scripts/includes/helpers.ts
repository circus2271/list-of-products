import { TextField } from "@material/mwc-textfield";
import { Button } from "@material/mwc-button/mwc-button";

export const textField: TextField = document.querySelector('mwc-textfield#product-name')
export const defaultList = document.getElementById('first')
export const selectedItemsList = document.getElementById('second')
export const clearDefaultListButton: Button = document.querySelector('#js-clear-default-list-button')
export const clearSelectedListButton: Button = document.querySelector('#js-clear-selected-list-button')


export interface IListItem {
  title: string,
  selected: boolean,
  id: string
}

type Options = {
  title: string,
  selected?: boolean
}

export class ListItem implements IListItem {
  title: string
  selected: boolean
  id: string

  constructor({title, selected = false}: Options) {
    this.title = title
    this.selected = selected
    this.id = new Date().getTime().toString()
  }
}
