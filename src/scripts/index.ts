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

const navbarInfoButton: HTMLButtonElement = document.querySelector('mwc-icon-button#info')
const dialog: Dialog = document.querySelector('mwc-dialog#dialog')
navbarInfoButton.onclick = () => dialog.show()