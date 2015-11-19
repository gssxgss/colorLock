const MSG = {
  REGISTERED: {
    failed: false,
    msg: "registered!"
  },
  UNLOCKED: {
    failed: false,
    msg: "unlocked!"
  },
  LENGTH_ERR: {
    failed: true,
    msg: "key length error!"
  },
  WRONG_KEY: {
    failed: true,
    msg: "key incorrect!"
  }
};

class ColorLock {

  constructor (config = {max: 8, min: 4}) {
    this.maxlength = config.max;
    this.minlength =config.min;

    this.$palette_wrapper = document.getElementById("palette_wrapper");
    this.$palette = document.getElementById("palette");
    this.$register = {
      msg: document.getElementById("msg_register"),
      btn: document.getElementById("btn_register")
    };
    this.$input = {
      msg: document.getElementById("msg_input"),
      btn: document.getElementById("btn_input")
    }
    this.$user_input = document.getElementById("user_input");
    this.$hint = document.getElementById("hint");

    this.init();
    this.bindEvents();
  }

  init() {
    this.key = "";
    this.isInit = true;
    this.resetUserInput();
  }

  resetLock() {
    this.$register.btn.classList.remove("hide");
    this.$register.msg.classList.remove("hide");
    this.$input.btn.classList.add("hide");
    this.$input.msg.classList.add("hide");
    this.init();
  }

  register() {
    if (!this.isInit) {
      this.throwMsg(MSG.REG_FAILED);
      return;
    }
    if (this.userInput.length > this.maxlength || this.userInput.length < this.minlength) {
      this.throwMsg(MSG.LENGTH_ERR);
    } else {
      this.key = this.userInput;
      this.isInit = false;
      this.throwMsg(MSG.REGISTERED);
      this.$register.btn.classList.add("hide");
      this.$register.msg.classList.add("hide");
      this.$input.btn.classList.remove("hide");
      this.$input.msg.classList.remove("hide");
      this.$palette_wrapper.classList.add("success");
    }
    this.resetUserInput();
  }

  input () {
    if (this.userInput === this.key) {
      this.resetLock();
      this.throwMsg(MSG.UNLOCKED);
      this.$palette_wrapper.classList.add("success");
    } else {
      console.log(`your key is ${this.key}`);
      this.throwMsg(MSG.WRONG_KEY);
    }
    this.resetUserInput();
  }

  throwMsg (status) {
    this.$hint.textContent = status.msg;
    if (status.failed) {
      this.$hint.classList.add("fail");
    } else {
      this.$hint.classList.add("success");
    }
    setTimeout(() => {
      this.$hint.classList.remove("success", "fail")
    }, 1000);
  }

  bindEvents () {
    let _register = e => this.register(e),
        _input = e => this.input(e),
        _setUserInput = e => this.setUserInput(e),
        _keypressManager = e => this.keypressManager(e);

    this.$register.btn.addEventListener("click", _register);
    this.$input.btn.addEventListener("click", _input);
    this.$palette.addEventListener("click", _setUserInput);
    document.body.addEventListener("keypress", _keypressManager);
    this.$palette_wrapper.addEventListener("animationend", () => {
      this.$palette_wrapper.classList.remove("success");
    });
  }

  resetUserInput () {
    this.userInput = "";
    while(this.$user_input.firstChild) {
      this.$user_input.removeChild(this.$user_input.firstChild);

    }
  }

  setUserInput (e) {
    let key;
    if (e.target.dataset.key) {
      key = String(e.target.dataset.key);
    } else {
      key = String.fromCharCode(e.which);
    }
    this.userInput += String(key)
    this.$user_input.appendChild(this.getUserInputHtml(key));
  }

  getUserInputHtml (n) {
    let dom = document.createElement("div");
    dom.className = `code code${n}`;
    return dom;
  }

  keypressManager (e) {
    if (e.which > 47 && e.which < 58) {
      this.setUserInput(e);
    } else if (e.which === 13) {
      if (this.key) {
        this.input();
      } else {
        this.register();
      }
    } else if (e.which === 99) {
      this.resetLock();
    }
  }
}

var colorLock = new ColorLock();
