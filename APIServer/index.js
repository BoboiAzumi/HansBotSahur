import express from 'express'
import bodyParser from 'body-parser'
import {wa} from '../wa/index.js' 
import { HansBot } from '../HansBot/index.js'

export class APIServer{
    constructor() {
        let port = 5000
        this.key = "WAGWSUKAHATIGW"
        this.target = "6282362000174@s.whatsapp.net"
        this.wa = new wa()
        this.Express = express()
        this.Express.use(bodyParser.urlencoded({extended: true}))
        this.Express.use(bodyParser.json())

        this.Express.listen(port, () => {
            console.log("Express Start On Port : "+port)
        })

        //HansBot Sahur Setting
        this.setClockTrigger()
        this.setClockStart()
        this.manualReset()

        this.bot = new HansBot()

        this.bot.on("triggered", async (msg)=>{
            await this.wa.sendMessageText(this.target, msg)
        })
        this.bot.on("start", async ()=>{
            await this.wa.sendMessageText(this.target, "Alarm Started")
        })
    }

    setClockTrigger(){
        this.Express.all("/setclocktrigger", async (req, res) => {
            if(this.wa.state.stateNumber === 2){
                let data = req.method === "POST" ? req.body : req.query
                let key = data.key
                //console.log(data.clock)
                if(!key || key !== this.key){
                    res.send(JSON.stringify(
                        {
                            status:4,
                            message: "API KEY REQUIRED"  
                        }
                    ));
                }
                else{
                    this.bot.setClockTrigger(data.clock)
                    await this.wa.sendMessageText(this.target, "setup trigger")
                    res.send(JSON.stringify({
                        status:7,
                        message:"OK",
                        data: []
                    }))
                }
            }
            else{
                res.send(JSON.stringify(
                    {
                        status:this.wa.state.stateNumber,
                        message: this.wa.state.stateName
                    }
                ));
            }
        })
    }

    setClockStart(){
        this.Express.all("/setclockstart", async (req, res) => {
            if(this.wa.state.stateNumber === 2){
                let data = req.method === "POST" ? req.body : req.query
                let key = data.key
                if(!key || key !== this.key){
                    res.send(JSON.stringify(
                        {
                            status:4,
                            message: "API KEY REQUIRED"  
                        }
                    ));
                }
                else{
                    await this.wa.sendMessageText(this.target, "setup start")
                    this.bot.setClockStart(data.clock)
                    res.send(JSON.stringify({
                        status:7,
                        message:"OK",
                        data: []
                    }))
                }
            }
            else{
                res.send(JSON.stringify(
                    {
                        status:this.wa.state.stateNumber,
                        message: this.wa.state.stateName
                    }
                ));
            }
        })
    }

    manualReset(){
        this.Express.all("/manualreset", async (req, res) => {
            if(this.wa.state.stateNumber === 2){
                let data = req.method === "POST" ? req.body : req.query
                let key = data.key
                if(!key || key !== this.key){
                    res.send(JSON.stringify(
                        {
                            status:4,
                            message: "API KEY REQUIRED"  
                        }
                    ));
                }
                else{
                    await this.wa.sendMessageText(this.target, "reset")
                    this.bot.manualReset()
                    res.send(JSON.stringify({
                        status:7,
                        message:"OK",
                        data: []
                    }))
                }
            }
            else{
                res.send(JSON.stringify(
                    {
                        status:this.wa.state.stateNumber,
                        message: this.wa.state.stateName
                    }
                ));
            }
        })
    }

    setHari(){
        this.Express.all("/sethari", async (req, res) => {
            if(this.wa.state.stateNumber === 2){
                let data = req.method === "POST" ? req.body : req.query
                let key = data.key
                if(!key || key !== this.key){
                    res.send(JSON.stringify(
                        {
                            status:4,
                            message: "API KEY REQUIRED"  
                        }
                    ));
                }
                else{
                    await this.wa.sendMessageText(this.target, "Set Hari "+data.hari)
                    this.bot.setHari(data.hari)
                    res.send(JSON.stringify({
                        status:7,
                        message:"OK",
                        data: []
                    }))
                }
            }
            else{
                res.send(JSON.stringify(
                    {
                        status:this.wa.state.stateNumber,
                        message: this.wa.state.stateName
                    }
                ));
            }
        })
    }
}