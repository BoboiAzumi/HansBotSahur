import { time } from 'console'
import {EventEmitter} from 'events'

export class HansBot extends EventEmitter{
    constructor(){
        super()
        this.hari = 1
        this.hasTrigger = false
        this.clockTrigger = "14:21"
        this.clockStart = "00:00"

        this.listenClockLooping()
    }

    setClockTrigger(clock){
        this.clockTrigger = clock
    }

    setClockStart(clock){
        this.clockStart = clock
    }

    setHari(hari){
        this.hari = hari
    }

    manualReset(){
        this.hasTrigger = false
    }

    async listenClockLooping(){
        this.listenClock()
        await setTimeout(() => {this.listenClockLooping()}, 5000)
    }

    async listenClock(){
        let format = this.getFormat()
        
        if(format == this.clockTrigger && this.hasTrigger == false){
            this.hasTrigger = true
            this.msg = `Sahurrrr,
Waktu Sudah Menunjukkan Pukul : ${this.getFormat()}

Selamat Menjalani Puasa Hari Ke : ${this.hari}
        `
            this.emit("triggered", (this.msg))
        }
        if(format == this.clockStart && this.hasTrigger == true){
            this.hari += 1
            this.hasTrigger = false
            this.emit("start")
        }
    }

    getFormat(){
        let hours = new Date().getHours()
        hours = hours < 10? "0"+hours:hours
        let minute = new Date().getMinutes()
        minute = minute < 10? "0"+minute:minute
        let format = hours+":"+minute

        return format
    }

}