export default class Hotkey {
    constructor(art) {
        this.art = art;
        this.keys = {};

        this.add(27, () => {
            if (art.player.fullscreenWebState) {
                art.player.fullscreenWebExit();
            }
        });

        this.add(32, () => {
            art.player.toggle();
        });

        this.add(37, () => {
            art.player.seek(art.player.currentTime - 10);
        });

        this.add(38, () => {
            art.player.volume += 0.05;
        });

        this.add(39, () => {
            art.player.seek(art.player.currentTime + 10);
        });

        this.add(40, () => {
            art.player.volume -= 0.05;
        });

        if (this.art.option.hotkey) {
            this.art.on('firstCanplay', () => {
                this.init();
            });
        }
    }

    add(key, event) {
        if (this.keys[key]) {
            this.keys[key].push(event);
        } else {
            this.keys[key] = [event];
        }
    }

    init() {
        const { proxy } = this.art.events;
        proxy(window, 'keydown', event => {
            if (this.art.isFocus) {
                const tag = document.activeElement.tagName.toUpperCase();
                const editable = document.activeElement.getAttribute('contenteditable');
                if (tag !== 'INPUT' && tag !== 'TEXTAREA' && editable !== '' && editable !== 'true') {
                    const events = this.keys[event.keyCode];
                    if (events) {
                        event.preventDefault();
                        events.forEach(fn => fn());
                        this.art.emit('hotkey', event);
                    }
                }
            }
        });
    }
}
