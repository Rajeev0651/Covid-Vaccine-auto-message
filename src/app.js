const express = require('express')
const cors = require('cors')
const cron = require('node-cron')
const proxy = require('http-proxy-middleware')
process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios').default;
require('dotenv').config()

const user_data = require('../data/user.json')

const app = express()
app.use(cors())
const port = process.env.PORT || 5000
const host = '0.0.0.0'
const token = process.env.TELEGRAM_TOKEN
// Creating a bot to fetch new updates
const bot = new TelegramBot(token, {polling:true});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

function fetchinfo(chat_id, auto)
{
    bot.sendMessage(chat_id,"Sending...")
    const url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=835301&date=06-06-2021"
    axios.get(url)
    .then((response)=>{
        //data = response.data.sessions[0]
        //const message = "Name : "+data.name+"\n"+"Address : "+ data.address+"\n"+"State : "+data.state_name+"\n"+"District : "+data.district_name+"\n"+"Pincode : "+data.pincode+"\n"+"Fees Type: "+data.fee_type+"\n"+"Fees : "+data.fee+"\n"+"Dose 1 : "+data.available_capacity_dose1+"\n"+"Dose 2 : "+data.available_capacity_dose2+"\n"+"Minimum age : "+ data.min_age_limit+"\n"+"Vaccine : "+data.vaccine+"\n"+"Slots : "+data.slots[0]+" | "+data.slots[1]+" | "+data.slots[2]+" | "+data.slots[3];
        bot.sendMessage(chat_id,"Done...")
        // if(data.available_capacity_dose1>=0)
        //     bot.sendMessage(chat_id,message)
        // else  if(auto==0)
        //     bot.sendMessage(chat_id,message)
    })
    .catch((err)=>{
        bot.sendMessage(chat_id,err)
    })
}

bot.on('message',(msg)=>{
    const chat_id = msg.chat.id;
    const url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=835301&date=06-06-2021"
    bot.sendMessage(chat_id,"Sending...")
    axios.get(url)
    .then((response)=>{
        //data = response.data.sessions[0]
        //const message = "Name : "+data.name+"\n"+"Address : "+ data.address+"\n"+"State : "+data.state_name+"\n"+"District : "+data.district_name+"\n"+"Pincode : "+data.pincode+"\n"+"Fees Type: "+data.fee_type+"\n"+"Fees : "+data.fee+"\n"+"Dose 1 : "+data.available_capacity_dose1+"\n"+"Dose 2 : "+data.available_capacity_dose2+"\n"+"Minimum age : "+ data.min_age_limit+"\n"+"Vaccine : "+data.vaccine+"\n"+"Slots : "+data.slots[0]+" | "+data.slots[1]+" | "+data.slots[2]+" | "+data.slots[3];
        bot.sendMessage(chat_id,"Done...")
    }).catch((err)=>{
        bot.sendMessage(chat_id,err)
    })
    //fetchinfo(chat_id,0);
})

// cron.schedule('*/1 * * * *', () => {
//     console.log('running a task in 1 minutes');
//     fetchinfo(user_data.user[0],1);
//   })

// app.get('/cowin',(req,res)=>{
//     let data
//     const url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=835301&date=06-06-2021"
//     axios.get(url)
//     .then((response)=>{
//         console.log(response.data.sessions[0])
//         data = response.data
//     })
//     res.send('done!')
// })
app.listen(port, host,() => {
  console.log(`Example app listening at http://localhost:${port}`)
})