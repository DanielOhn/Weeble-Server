
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import { Anime } from './sakugabooru-list.json'
import cors from "cors"

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3005;
//var cors = require('cors')


app.use(cors())
// {title: string, name: string, vid_list: object[]}
let weeble: any | undefined = undefined

const getWeebleData = (anime: any, title: String) => {
  var url = `https://www.sakugabooru.com/post.json?tags=${anime.name}`;
  //console.log("TAG: ", anime.name);

  var options = {
    method: 'GET',
    mode: "cors" as RequestMode,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };


  const fetch_data = () => {
    try {
      fetch(url, options)
        .then((resp) => {
          return resp.json().then((data) => {
            console.log("DATA: ", data);
            //
            weeble = { "Weeble": { "title": title, "name": anime.name, "vid_list": data } }
            //res.send({ "Weeble": { "title": title, "name": anime.name, "vid_list": data } })
            return data
          });
        })
        .catch((err) => { console.log(err) });
    }
    catch (err) {
      console.log(err);
    }
  }

  let data = fetch_data()
  console.log(data)
  return data
}

const startWeeble = () => {
  // INITS WEEBLE DATA AND STARTS THE TIMER

  
  let anime = Anime[Math.floor(Math.random() * Anime.length)];
  let title = convertTitle(anime.name)

  getWeebleData(anime, title)
}


const convertTitle = (ani: String) => {
  //console.log(ani)
  let tempStr = ani
  tempStr = tempStr.replaceAll("_", " ")
  for (let i = 0; i < tempStr.length; i++) {
    if (i === 0 || tempStr[i - 1] === " ") {
      let char = tempStr.charAt(i).toUpperCase()
      tempStr = tempStr.substring(0, i) + char + tempStr.substring(i + 1)
    }

  }
  return tempStr
}


app.get("/", (req: Request, res: Response) => {


  
  if (weeble) {
    res.json(weeble)
  } else {
    res.json("No weeble :(")
  }
  
})

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
})

startWeeble()

let sec = 1 * 1000;
let min = sec * 60;
let hour = min * 60;
let day = hour * 24;

setInterval(startWeeble, min * 5)