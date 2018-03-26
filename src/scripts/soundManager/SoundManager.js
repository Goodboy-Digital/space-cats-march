import {
    Howl,
    Howler
} from 'howler';
import AbstractSoundManager from './AbstractSoundManager'
export default class SoundManager extends AbstractSoundManager{
    constructor() {
        super();
        this.audioList = [];
        Howler.volume(0.5);
    }
    getFileName(path) {
        let tempSplit = path.split('/')
        let fileName = tempSplit[tempSplit.length - 1]
        return fileName.substr(0, fileName.length - 4)
    }
    load(list) {
        for (var i = list.length - 1; i >= 0; i--) {
            let sound = new Howl({
                src: [list[i]],
                autoplay: false,
                loop: true,
                volume: 1,
            });
            this.audioList[this.getFileName(list[i])] = sound;
        }
    }

    fadeIn(id, time = 1000) {
        this.audioList[id].stop();
        this.audioList[id].play();
        this.audioList[id].fade(0, 1, time);
    }

    fadeOut(id, time = 1000) {
        this.audioList[id].fade(1, 0, time);
    }

    mute() {
        Howler.volume(0);
        this.isMute = true;
    }

    unmute() {
        Howler.volume(0.5);
        this.isMute = false;
    }

    toggleMute() {
        if (this.isMute) {
            this.unmute();
        } else {
            this.mute();
        }
    }
}