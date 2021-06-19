const TelegramBot = require('node-telegram-bot-api');
const express = require('express')
const cron = require('node-cron')
const axios = require('axios').default;
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000
const token = process.env.TELEGRAM_TOKEN

const date = "20-06-2021"
const pincode = "835301"
const period = 5 // second

// Creating a bot to fetch new updates
const bot = new TelegramBot(token, {polling:true});

// Test Api
app.get('/', (req, res) => {
  res.send('Hello World!')
})

function fetchinfo(chat_id)
{
    const url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pincode}&date=${date}`
    axios.get(url)
    .then((response)=>{
        const time = new Date()
        const t = time.getDate()+" "+time.getHours()+":"+time.getMinutes()
        bot.sendMessage(chat_id, time.getDate()+" "+time.getHours()+":"+time.getMinutes());
        const len = response.data.sessions.length;
        for(let i = 0; i<len; i++)
        {
          console.log("P: ",i+1);
          data = response.data.sessions[i];
          const message = "Name : "+data.name+"\n"+"Address : "+ data.address+"\n"+"State : "+data.state_name+"\n"+"District : "+data.district_name+"\n"+"Pincode : "+data.pincode+"\n"+"Fees Type: "+data.fee_type+"\n"+"Fees : "+data.fee+"\n"+"Dose 1 : "+data.available_capacity_dose1+"\n"+"Dose 2 : "+data.available_capacity_dose2+"\n"+"Minimum age : "+ data.min_age_limit+"\n"+"Vaccine : "+data.vaccine+"\n"+"Slots : "+data.slots[0]+" | "+data.slots[1]+" | "+data.slots[2]+" | "+data.slots[3];
          console.log("Dose 1 : ",data.available_capacity_dose1);
          if(data.available_capacity_dose1 >= 0)
          bot.sendMessage(chat_id,(i+1)+". : "+t+"\n"+message)
          .catch((err)=>{
            console.log(err)
          })
        }
    })
}

function interval_fetchinfo(chat_id)
{
    console.log(chat_id)
    const url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pincode}&date=${date}`
    axios.get(url)
    .then((response)=>{
        const time = new Date()
        const t = time.getDate()+" "+time.getHours()+":"+time.getMinutes()
        const len = response.data.sessions.length;
        console.log(len);
        for(let i = 0; i<len; i++)
        {
          console.log(i+1);
          data = response.data.sessions[i];
          const message = "Name : "+data.name+"\n"+"Address : "+ data.address+"\n"+"State : "+data.state_name+"\n"+"District : "+data.district_name+"\n"+"Pincode : "+data.pincode+"\n"+"Fees Type: "+data.fee_type+"\n"+"Fees : "+data.fee+"\n"+"Dose 1 : "+data.available_capacity_dose1+"\n"+"Dose 2 : "+data.available_capacity_dose2+"\n"+"Minimum age : "+ data.min_age_limit+"\n"+"Vaccine : "+data.vaccine+"\n"+"Slots : "+data.slots[0]+" | "+data.slots[1]+" | "+data.slots[2]+" | "+data.slots[3];
          console.log("Dose 1 : ",data.available_capacity_dose1);
          if(data.available_capacity_dose1 >= 0)
          bot.sendMessage(chat_id,(i+1)+". : "+t+"\n"+message)
          .catch((err)=>{
            console.log(err)
          })
        }
        
    })
}

// Send any message to bot to recieve vaccine update
bot.on('message',(msg)=>{
    const chat_id = msg.chat.id;
    fetchinfo(chat_id);
})


cron.schedule(`*/${period} * * * * *`, () => {
    console.log(`Run every ${period} second`);
    interval_fetchinfo(chat_id = 1093404804);
  })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})