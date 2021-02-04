/* eslint-disable func-names */
/* eslint-disable no-use-before-define */
import {
  getDomElement,
  setInnerHTML,
  setValue,
  setCheckedValue,
  getAllElementsOfType,
  addEvent,
// eslint-disable-next-line import/extensions
} from './dom.js';

const myLibrary = [];

function Book(title, author, pages, readStatus) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.readStatus = readStatus;
  this.toggleStatus = function () {
    this.readStatus = !this.readStatus;
  };
}

const Card = (arr) => {
  const cleanNoticeBoard = () => {
    setInnerHTML(getDomElement('#title-notice'), '');
    setInnerHTML(getDomElement('#author-notice'), '');
    setInnerHTML(getDomElement('#pages-notice'), '');
  }

  const cleanForm = () => {
    setValue(getDomElement('#title'), '');
    setValue(getDomElement('#author'), '');
    setValue(getDomElement('#pages'), '');
    setCheckedValue(getDomElement('#checkbox'), false);
  }

  const addCard = (arr, obj) =>{
    const card = `<div class='col-sm-4 my-2'>
      <div class='card text-center text-dark bg-light'>
        <div class='card-header'>
          ${obj.title}
        </div>
        <div class='card-body'>
          <h5 class='card-title'>${obj.author}</h5>
          <p class='card-text'>${obj.pages} pages</p>
          <a href='#' class="btn ${obj.readStatus ? 'btn-success' : 'btn-primary'} toggle" data-index-number="${arr.indexOf(obj)}">${obj.readStatus ? 'Read' : 'Not read'}</a>
          <a href='#' class='btn btn-danger dlt-button' data-index-number="${arr.indexOf(obj)}">Delete</a>
        </div>
      </div>
    </div>`;
    return card;
  }

  const printCard = () => {
    const markup = arr.map(elt => addCard(arr, elt)).join('');
    const booksList = getDomElement('#books_list');
    setInnerHTML(booksList, markup);

    cleanNoticeBoard();
    cleanForm();

    const allDeleteBtn = getAllElementsOfType('.dlt-button');
    const allToggleBtn = getAllElementsOfType('.toggle');
      
    addEvent(allDeleteBtn, 'click', deleteOneCard);
    addEvent(allToggleBtn, 'click', toggleBookStatus);
  }

  return { printCard }
}

const MyBook = () => {
  const toggleStatus = () => {
    readStatus = !getReadStatus();
  };

  const validateForm = (obj) => {
    const formValues = Object.values(obj);
    let emptyInputTagsCount = 0;
    for (let i = 0; i < formValues.length -1 ; i += 1) {
      if (formValues[i].length === 0) emptyInputTagsCount += 1;
    }

    if (emptyInputTagsCount > 0) return false;
    return true;
  }

  const notifyUser = (obj) => {
    const titleNotice = getDomElement('#title-notice');
    const authorNotice = getDomElement('#author-notice');
    const pagesNotice = getDomElement('#pages-notice');
  
    if (obj.title.length === 0) {
      setInnerHTML(titleNotice, 'Title is required');
    }
  
    if (obj.author.length === 0) {
      setInnerHTML(authorNotice, 'Author is required');
    }
  
    if (obj.pages.length === 0) {
      setInnerHTML(pagesNotice, 'Number of pages is required');
    }
  }

  const addBookToLibrary = () => {
    const title = getDomElement('#title').value;
    const author = getDomElement('#author').value;
    const pages = getDomElement('#pages').value;
    const readStatus = getDomElement('#checkbox').checked;

    return new Book(title, author, pages, readStatus);
  }

  return { toggleStatus, addBookToLibrary, notifyUser, validateForm }
}

const addBook = getDomElement('#addBook');
const newBook = getDomElement('#toggle-add-book');

function toggleNewBook() {
  const elt = newBook;
  const form = getDomElement('.form_book');
  elt.classList.toggle('d-none');
  form.classList.toggle('d-none');
}

addBook.addEventListener('click', () => {
  const {addBookToLibrary, validateForm, notifyUser } = MyBook();
  addBookToLibrary();
  if(validateForm(addBookToLibrary())){
    myLibrary.push(addBookToLibrary());
    const { printCard } = Card(myLibrary);
    printCard();
    toggleNewBook();

  }
  else{
    notifyUser(addBookToLibrary());
  }
});

function deleteOneCard(event) {
  console.log('bree')
  const clickedButton = event.currentTarget;
  const correspondingBookIndex = clickedButton.dataset.indexNumber;
  myLibrary.splice(correspondingBookIndex, 1);
  const { printCard } = Card(myLibrary);
  printCard();
}

function toggleBookStatus(event) {
  const bookIndex = event.currentTarget.dataset.indexNumber;
  const book = myLibrary[bookIndex];
  book.toggleStatus();
  const { printCard } = Card(myLibrary);
  printCard();
}

newBook.addEventListener('click', toggleNewBook);
