import makeWASocket from "@adiwajshing/baileys"
const  { useMultiFileAuthState, makeInMemoryStore,delay, DisconnectReason, fetchLatestBaileysVersion, proto, Browsers, makeCacheableSignalKeyStore }  = makeWASocket

import MAIN_LOGGER from 'pino'
const logger = MAIN_LOGGER.default()
logger.level = 'error'
const store = makeInMemoryStore({logger: logger})

export class wa{
    constructor(){
        this.state = {
            stateNumber : 0
        }
        this.sock;
        this.was()
    }

    async was(){
        const { state, saveCreds } = await useMultiFileAuthState("baileys")
    	// fetch latest version of WA Web
	    const { version, isLatest } = await fetchLatestBaileysVersion()
    	console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`)

	    this.sock = makeWASocket.default({
            browser: Browsers.ubuntu("chrome"),
	    	version,
            markOnlineConnect: true,
    		printQRInTerminal: true,
	    	auth: state,
            logger: logger,
            getMessage: store.loadMessage()
	    })

        store.bind(this.sock.ev)

        this.sock.ev.on ('creds.update', saveCreds)

        this.sock.ev.on("connection.update", (update)=>{
            const {connection, lastDisconnect} = update
            if(connection === 'close'){
                let shouldReconnect = lastDisconnect.error.output.payload.statusCode !== DisconnectReason.loggedOut
                if(shouldReconnect){
                    this.was()
                }
            }
            else if(connection === 'open'){
                this.state.stateNumber = 2
            }
        })

        this.sock.ev.on('messages.upsert', async m => {
            let isRevoked = m.messages[0].message.protocolMessage !== null ? true : false
            if(!m.messages[0].key.fromMe){
                if(!isRevoked){
                    let isImage = m.messages[0].message.imageMessage !== null ? true : false
                    let msg = isImage ? m.messages[0].message.imageMessage.caption : m.messages[0].message.conversation
                    console.log("===============================================")
                    console.log("               Incoming Messages               ")
                    console.log("===============================================")
                    console.log("from   : "+m.messages[0].key.remoteJid)
                    console.log("name   : "+m.messages[0].pushName)
                    console.log("msg    : "+msg)
                    console.log("===============================================")
                }
            }
        })

        this.sock.ev.on('presence.update', async m => {
            //console.log(m.messages[0])
            //delay(1000)
            //await this.sock.readMessages([m.messages[0].key])
            //await this.sock.sendMessage("6282362000174@s.whatsapp.net", {text :"A"})
        })

        /*
        this.sock.ev.on('chats.set', () => {
            // can use "store.chats" however you want, even after the socket dies out
            // "chats" => a KeyedDB instance
            console.log('got chats', store.chats.all())
        })
        */

    }

    async sendMessageText(jid, text){
        await this.sock.sendMessage(jid, {text: text})
    }
}