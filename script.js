const listContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteListButton = document.querySelector('[data-delete-list-button]')
const listDisplayContainer = document.querySelector('[data-list-display-container]')
const listTitleElement = document.querySelector('[data-list-title]')
const listCountElement = document.querySelector('[data-list-count]')
const tasksContainer = document.querySelector('[data-tasks]')
const taskTemplate = document.getElementById('task-template') //Doubt - understand this
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')
const clearCompleteTaskButton = document.querySelector('[data-clear-complete-tasks-button]')
const clearAllButton = document.querySelector('[data-clear-all-button]')

const LOCAL_STORAGE_LIST_KEY = "task.lists" //creating a namepspace to prevent overwriting of storage 
//in local storage and preventing other websites from overwriting your local storage keys
// therefore no collisions
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId" 
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY) //return null if not present i.e. no list selected

listContainer.addEventListener('click',e=>{
  if(e.target.tagName.toLowerCase() === 'li'){
    selectedListId = e.target.dataset.listId
    saveAndRender()
  }
})

tasksContainer.addEventListener('click',e=>{
  if(e.target.tagName.toLowerCase() === 'input'){
    const selectedList = lists.find(list => list.id ===selectedListId)
    const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
    selectedTask.complete = e.target.checked
    console.log(e.target)
    save()
    renderTaskCount(selectedList)
  }
})
clearCompleteTaskButton.onclick = e =>{
  const selectedList = lists.find(list => list.id ===selectedListId)
  selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
  saveAndRender()
}
deleteListButton.onclick = e => {
  lists = lists.filter(list => list.id!==selectedListId)
  selectedListId = null
  saveAndRender()
}

// Adding a new list element
newListForm.addEventListener('submit',e=>{
  e.preventDefault()
  const listName = newListInput.value
  if(listName == null || listName == '') return
  const list = createList(listName)
  newListInput.value = null
  lists.push(list)
  saveAndRender()
})

newTaskForm.addEventListener('submit',e=>{
  e.preventDefault()
  const taskName = newTaskInput.value
  if(taskName == null || taskName == '') return
  const task = createTask(taskName)
  newTaskInput.value = null
  const selectedList = lists.find(list => list.id ===selectedListId)
  selectedList.tasks.push(task)
  saveAndRender()
})

function createTask(name){
  return {id: Date.now().toString(),name:name,complete:false}
}

function createList(name){
  return {id: Date.now().toString(),name:name,tasks:[]}
}

function render() { //this fun will render the list
  // listContainer.innerHTML = ''
  clearElement(listContainer)
  renderLists()
  const selectedList = lists.find(list => list.id ===selectedListId)
  if(selectedList==null){
    listDisplayContainer.style.opacity = .2
    listTitleElement.innerText = 'Select a list'
    // listDisplayContainer.disabled = true
    // listDisplayContainer.style.background = 'black';
  }else{
    listDisplayContainer.style.opacity = 1
    // listDisplayContainer.style.display = ''
    listTitleElement.innerText = selectedList.name
    renderTaskCount(selectedList)
    clearElement(tasksContainer)
    // tasksContainer.innerHTML = ''
    renderTasks(selectedList)
  }
}

function clearElement(element){
    while(element.firstChild){
        element.removeChild(element.firstChild)
    }
}
function renderLists(){
  lists.forEach(list => {
    const listElement = document.createElement('li')
    listElement.dataset.listId = list.id
    listElement.classList.add('list-name')
    listElement.innerText = list.name
    if(list.id === selectedListId) listElement.classList.add('active-list')
    listContainer.appendChild(listElement)
  })
}
function renderTaskCount(selectedList){
  const incompleteTasksCount = selectedList.tasks.filter(task => !task.complete).length
  const taskString = incompleteTasksCount == 1?"task":"tasks"
  listCountElement.innerText = `${incompleteTasksCount} ${taskString} remaining`
}
function renderTasks(selectedList){
  selectedList.tasks.forEach(task =>{
    const taskElement = document.importNode(taskTemplate.content,true) //Doubt - understand working
    const checkbox = taskElement.querySelector('input')
    checkbox.id = task.id
    checkbox.checked = task.complete
    const label = taskElement.querySelector('label')
    label.htmlFor = task.id
    label.append(task.name) //Doubt - Why not appendChild
    tasksContainer.appendChild(taskElement)
  })
}

function saveAndRender(){
    save()
    render()
}
function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY,JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY,selectedListId)
}
clearAllButton.addEventListener('click',e => {
  lists = []
  selectedListId = null
  saveAndRender()
})
render()