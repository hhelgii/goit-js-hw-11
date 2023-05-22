export default class LoadBtn {
  static classes = {
    hidden: 'hidden',
  };

  constructor({ selector, isHidden = false }) {
    this.button = this.getButton(selector);
    isHidden && this.hide();
    //this.hide();
  }

  getButton(selector) {
    return document.querySelector(selector);
  }

  hide() {
    this.button.classList.add('hidden');
  }

  show() {
    this.button.classList.remove('hidden');
  }

  disable() {
    this.button.disabled = true;
    this.button.textContent = 'Loading...';
  }

  enable() {
    this.button.disabled = false;
    this.button.textContent = 'Load more';
  }

  end() {
    this.button.disabled = true;
    this.button.textContent = 'The end!';
  }
}
