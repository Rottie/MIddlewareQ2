// Setting up express framework
const express = require('express')
const app = express()
const port = 3000

//Setting template engine as handlebars
const exphbs = require('express-handlebars');
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

//Include statics files like images and css
app.use(express.static('public'))

//This function can translate high resolution results to milliseconds
const getDurationInMilliseconds = (start) => {
    const NS_PER_SEC = 1e9
    const NS_TO_MS = 1e6
    const diff = process.hrtime(start)
    //diff[0] represent start point request-response cycle & diff[1] represent end pointt of request-response cycle
    return (diff[0] * NS_PER_SEC + diff[1])/ NS_TO_MS
}


//I.ConsoleMessage middleware
app.use ((req,res,next)=>{
  
  //Step IA.Get current timestamp
   req.start_time = new Date();
   
  //Get year,month,day,hour,min,seconds
  var dd = req.start_time.getDate();
  var mm = req.start_time.getMonth()+1; 
  var yyyy = req.start_time.getFullYear();
  var hr = req.start_time.getHours();
  var min = req.start_time.getMinutes();
  var sec = req.start_time.getSeconds();


  //If value day,month,hour,minutes,seconds less than 0,will add '0' string before display out
  if(dd<10) 
{
    dd='0'+dd;
} 

if(mm<10) 
{
    mm='0'+mm;
} 
  if(hr<10) 
{
    hr='0'+hr;
}
 if(min<10) 
{
    min='0'+min;
} 
 if(sec<10) 
{
    sec='0'+sec;
} 
  //return all time unit values  within this string array
  req.start_time = yyyy+'-'+mm+'-'+dd+' '+hr+':'+min+':'+sec;
  

  //Step IB.Obtain http method
  req.httpMethod = req.method;
  
  //Step IC.Obtain Url
  req.routesUrl = req.url;

  //Step ID.Obtain start point of a request-response cycle
  const start = process.hrtime()
  
  //Step IE.Calculate response finish time
  res.on('finish', () => {  
     
    //now previous start point and end point enter this function to calculate duration time
    //then return from nano unit to mili unit
      const durationInMilliseconds = getDurationInMilliseconds (start)
    
     

     //Combine all value(cuurent timeStamp,method,url and duration request)
     req.consoleMessage = req.start_time +' | '+req.httpMethod+' from '+req.routesUrl+'  total time:'+durationInMilliseconds.toLocaleString()+'ms';

     //Console log result
     console.log(req.consoleMessage)
     
    })

  next();
})

//   GET /
app.get('/', (req, res) => {
  const text ='列出全部Todo';
  res.render('index',{text})
})

//GET /new
app.get('/new', (req, res) => {
  const text = '新增 Todo 頁面';
  res.render('index',{text})
})
 
//GET :/id
app.get('/:id', (req, res) => {
  const text ='顯示一筆 Todo' ; 
  res.render('index',{text})
 
})

//New  create post
app.post('/', (req, res) => {
  const text ='新增一筆 Todo';
  res.render('index',{text})
 
})

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})