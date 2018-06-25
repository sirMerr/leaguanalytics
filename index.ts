import * as express from 'express';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { getSpellList, getChampList, getItemList, compileData } from './server/api';

// Allow .env use
dotenv.config();

const app = express();

app.use(cors());

// app.get('/', function(req: any, res: any){
//    res.send("Hello world!");
// });

app.get('/summoner/:region/:name', async function(req: any, res: any){
  const {region, name} = req.params;

  const matches = await compileData(name,region);

  res.send({ matches});
});

app.get('/spells', async (req,res) => {
  const spells = await getSpellList();

  res.send({spells});
})

app.get('/items', async (req,res) => {
  const items = await getItemList();

  res.send(items);
})

app.get('/champnames', async (req,res) => {
  const champNames = await getChampList();

  res.send(champNames);
})

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build/', 'index.html'));
  });
}

app.listen(process.env.PORT || 3001, function(){
  console.log('Server listening on 3001')
});
