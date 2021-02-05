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

class Book {
  constructor(title, author, pages, readStatus) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.readStatus = readStatus;
  }

  toggleStatus() {
    this.readStatus = !this.readStatus;
  }
}

class Card {
  constructor(arr) {
    this.arr = arr;
  }

  cleanNoticeBoard() {
    setInnerHTML(getDomElement('#title-notice'), '');
    setInnerHTML(getDomElement('#author-notice'), '');
    setInnerHTML(getDomElement('#pages-notice'), '');
  }

  cleanForm() {
    setValue(getDomElement('#title'), '');
    setValue(getDomElement('#author'), '');
    setValue(getDomElement('#pages'), '');
    setCheckedValue(getDomElement('#checkbox'), false);
  }

  addCard(arr, obj) {
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

  printCard() {
    const markup = this.arr.map(elt => this.addCard(this.arr, elt)).join('');
    const booksList = getDomElement('#books_list');
    setInnerHTML(booksList, markup);

    this.cleanNoticeBoard();
    this.cleanForm();

    const allDeleteBtn = getAllElementsOfType('.dlt-button');
    const allToggleBtn = getAllElementsOfType('.toggle');

    addEvent(allDeleteBtn, 'click', deleteOneCard);
    addEvent(allToggleBtn, 'click', toggleBookStatus);
  }
}

class MyBook {
  validateForm(obj) {
    const formValues = Object.values(obj);
    let emptyInputTagsCount = 0;
    for (let i = 0; i < formValues.length - 1; i += 1) {
      if (formValues[i].length === 0) emptyInputTagsCount += 1;
    }

    if (emptyInputTagsCount > 0) return false;
    return true;
  }

  notifyUser(obj) {
    titleNotice = getDomElement('#title-notice');
    authorNotice = getDomElement('#author-notice');
    pagesNotice = getDomElement('#pages-notice');

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

  addBookToLibrary() {
    const title = getDomElement('#title').value;
    const author = getDomElement('#author').value;
    const pages = getDomElement('#pages').value;
    const readStatus = getDomElement('#checkbox').checked;

    return new Book(title, author, pages, readStatus);
  }
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
  const myBook = new MyBook();
  myBook.addBookToLibrary();
  if (myBook.validateForm(myBook.addBookToLibrary())) {
    myLibrary.push(myBook.addBookToLibrary());
    const card = new Card(myLibrary);
    card.printCard();
    toggleNewBook();
  } else {
    myBook.notifyUser(myBook.addBookToLibrary());
  }
});

function deleteOneCard(event) {
  const clickedButton = event.currentTarget;
  const correspondingBookIndex = clickedButton.dataset.indexNumber;
  myLibrary.splice(correspondingBookIndex, 1);
  const card = new Card(myLibrary);
  card.printCard();
}

function toggleBookStatus(event) {
  const bookIndex = event.currentTarget.dataset.indexNumber;
  const book = myLibrary[bookIndex];
  book.toggleStatus();
  const card = new Card(myLibrary);
  card.printCard();
}

newBook.addEventListener('click', toggleNewBook);
