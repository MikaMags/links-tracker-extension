/**
 *  Links Tracker 
 *  - saves the url from input or the current tab and displays it in a list (also stored in localStorage). 
 *      also allows to copy the list in a format.
 */

const saveInputBtn = document.getElementById('saveIn-btn')
const tabBtn = document.getElementById('tab-btn')
const copyBtn = document.getElementById('copyclip-btn')
const clearBtn = document.getElementById('clear-btn')
const inputBox = document.getElementById('input-el')
const container = document.getElementById('list-container')

let savedLinks = [] // array of saved links

// get saved links from localStorage and render if there's saved
let linksFromLocal = JSON.parse(localStorage.getItem('savedLinks'))
if (linksFromLocal) {
    savedLinks = linksFromLocal
    renderList(savedLinks)
}

/** 
 * displays array in the innerHTML of the ul 
*/
function renderList(list) {
    console.log('list is ' + list)
    let inner = ''
    for(el of list) {
        if (typeof el === 'object') { //if chrome tab, show title and link its url
            inner += 
                `<li>
                <a target='_blank' href='${el.url}'> ${el.title} </a>
                </li>`
        } else {
            inner += `<li><a target='_blank' href='${el}'>${el}</a></li>`
        }
    }
    container.innerHTML = inner //change inner HTML of ul
}


/** 
 * saves the input in the textbox and renders the new list 
*/
saveInputBtn.addEventListener('click', function(){
    // save input into list
    inputValue = inputBox.value
    if (inputValue) {
        savedLinks.push(inputBox.value)
        // console.log(savedLinks)
        inputBox.value = ''
    }

    // save into localStorage
    localStorage.setItem('savedLinks', JSON.stringify(savedLinks))

    //render list
    renderList(savedLinks)
})

/** 
 * saves the current active tab and renders the new list 
*/
tabBtn.addEventListener('click', function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        // tabs have the relevant info stored like {title: ..., url: ...}
        let tabTitle = tabs[0].title
        let tabUrl = tabs[0].url
        // console.log(tabTitle, tabUrl)

        savedLinks.push({title: tabTitle, url : tabUrl}) //store the tab's relevant info
        localStorage.setItem('savedLinks', JSON.stringify(savedLinks))
        renderList(savedLinks)
    })
    // console.log('tab saved')
})

/** 
 * copies the list in a bulleted (*) format into the clipboard 
 */
copyBtn.addEventListener('click', function(){
    let formattedList = ''
    for(let i=0; i<savedLinks.length; i++) {
        let item = savedLinks[i]
        // if object (i.e. a tab) format `title - https://`
        // if url string from input format `https://`
        formattedList += ((typeof item === 'object')? `* '${item.title}' - ${item.url}\n`:`* ${item}\n`)
    }
    //put string into clipboard
    navigator.clipboard.writeText(formattedList); 
})

/** 
 * clears the array, localStorage list, and rendered html list 
 */
clearBtn.addEventListener('click', function(){
    //clear list
    savedLinks = []

    //clear html
    container.innerHTML = ''

    //clear localStorage
    localStorage.removeItem('savedLinks')
    
})