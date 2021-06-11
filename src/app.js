const TelegramBot = require('node-telegram-bot-api');
const express = require('express')
const cron = require('node-cron')
const axios = require('axios').default;
require('dotenv').config()

const user_data = require('../data/user.json')

const app = express()
const port = process.env.PORT || 3000
const token = process.env.TELEGRAM_TOKEN

// Creating a bot to fetch new updates
const bot = new TelegramBot(token, {polling:true});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

function fetchinfo(chat_id)
{
    const url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=835301&date=11-06-2021"
    axios.get(url)
    .then((response)=>{
        const time = new Date()
        bot.sendMessage(chat_id, time.getDate()+" "+time.getHours()+":"+time.getMinutes());
        data = response.data.sessions[0]
        const message = "Name : "+data.name+"\n"+"Address : "+ data.address+"\n"+"State : "+data.state_name+"\n"+"District : "+data.district_name+"\n"+"Pincode : "+data.pincode+"\n"+"Fees Type: "+data.fee_type+"\n"+"Fees : "+data.fee+"\n"+"Dose 1 : "+data.available_capacity_dose1+"\n"+"Dose 2 : "+data.available_capacity_dose2+"\n"+"Minimum age : "+ data.min_age_limit+"\n"+"Vaccine : "+data.vaccine+"\n"+"Slots : "+data.slots[0]+" | "+data.slots[1]+" | "+data.slots[2]+" | "+data.slots[3];
        bot.sendMessage(chat_id,message)
    })
}

function interval_fetchinfo(chat_id)
{
  console.log(chat_id)
    const url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=835301&date=11-06-2021"
    axios.get(url)
    .then((response)=>{
        const time = new Date()
        const t = time.getDate()+" "+time.getHours()+":"+time.getMinutes()
        const len = response.data.sessions.length;
        console.log(len);
        for(let i = 0; i<len; i++)
        {
          data = response.data.sessions[i];
          const message = "Name : "+data.name+"\n"+"Address : "+ data.address+"\n"+"State : "+data.state_name+"\n"+"District : "+data.district_name+"\n"+"Pincode : "+data.pincode+"\n"+"Fees Type: "+data.fee_type+"\n"+"Fees : "+data.fee+"\n"+"Dose 1 : "+data.available_capacity_dose1+"\n"+"Dose 2 : "+data.available_capacity_dose2+"\n"+"Minimum age : "+ data.min_age_limit+"\n"+"Vaccine : "+data.vaccine+"\n"+"Slots : "+data.slots[0]+" | "+data.slots[1]+" | "+data.slots[2]+" | "+data.slots[3];
          bot.sendMessage(chat_id,(i+1)+". : "+t+"\n"+message)
          .catch((err)=>{
            console.log(err)
          })
        }
        
    })
}

bot.on('message',(msg)=>{
    const chat_id = msg.chat.id;
    fetchinfo(chat_id);
    console.log(chat_id);
    //bot.sendMessage(chat_id, 'Recieved message...');
})

cron.schedule('*/1 * * * *', () => {
    console.log('running a task in 1 minutes');
    interval_fetchinfo(chat_id = 1093404804);
  })

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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})