/**
 * The InputComponent lets you search through configured indexes.
 *
 * @type {InputComponent}
 */
EasySearch.InputComponentGankfu = class InputComponentGankfu extends BaseComponent {
  /**
   * Setup input onCreated.
   */
  onCreated() {
    let componentScope = this;

    super.onCreated(...arguments);

    this.search(this.inputAttributes().value);

    // create a reactive dependency to the cursor

  }

  /**
   * Destroy input cursors onDestroyed.
   */
  onDestroyed() {
    super.onDestroyed(...arguments);

    if (this.cursorHandle) {
      this.cursorHandle.stop();
    }

    if (this.lastTrackerCursor) {
      this.lastTrackerCursor.stop();
    }
  }

  /**
   * Event map.
   *
   * @returns {Object}
   */
  events() {
    return [{
      'keyup input' : function (e) {
        if ('enter' == this.getData().event && e.keyCode != 13) {
          return;
        }
      }
    }];
  }

  /**
   * Return the attributes to set on the input (class, id).
   *
   * @returns {Object}
   */
  inputAttributes() {
    return _.defaults({}, this.getData().attributes, InputComponentGankfu.defaultAttributes);
  }

  /**
   * Return the default attributes.
   *
   * @returns {Object}
   */
  static get defaultAttributes() {
    return {
      type: 'text',
      value: ''
    };
  }

  /**
   * Return the default options.
   *
   * @returns {Object}
   */
  get defaultOptions() {
    return {
      timeout: 50
    };
  }
};

EasySearch.InputComponentGankfu.register('EasySearch.InputGankfu');
