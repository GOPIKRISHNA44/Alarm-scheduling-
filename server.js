var express=require('express');
var app=express();
app.use(express.static(__dirname+'/'));
app.use(express.static(__dirname+'/timetextbox/'));
app.use(express.static(__dirname+'/manageframe/'));
app.use(express.static(__dirname+'/datepicker/'));
app.set('view engine','ejs');
/*app.get('/',function(req,res){
  //schedule  for date
  var dat=new Date();
  console.log(dat.getTim);
  var datestatus;
  //if date status is present then add date t arrayelse keep const ,if data is present add to new variable
  data=['Create a new schedule',dat.getDay()+'/'+dat.getMonth()+'/'+dat.getYear()];

  res.render('choice',{choice:data,g:'hi'});
});*/
/*main code*/

app.get('/',function(req,res){
  var dot=new Date();
  month=(dot.getMonth()+1)>9?(dot.getMonth()+1):'0'+(dot.getMonth()+1)
  connection.query('SELECT * FROM RUN WHERE DATE=CURRENT_DATE',function(err,rows,fields){
    if(rows.length==0)
    runyes=false
    else {
      runyes=true
    }
    res.render('choice',{date_to_first:dot.getFullYear()+"-"+month+"-"+dot.getDate(),runwork:runyes});
  })

})
app.get('/ondaywork',function(req,res){
  if(req.query.selected_value=='new_schedule')
  res.render('inc1',{selected_value:"no"});
  else {
    /*check if chedule is present at that date*/
    select_task_to_display_ondate('inc1',req.query.selected_value,res);

  }
});

app.get('/runtodaypage',function(req,res){var sortedschedule={};
var  scheduleobject=JSON.parse(req.query.data);
console.log(scheduleobject);
/*sorting the data*/
var sorted=Object.keys(scheduleobject).sort();
for(var i=0;i<sorted.length;i++)
{var e=sorted[i].split(":");
  sortedschedule[(e[0]*3600)+(e[1]*60)]=scheduleobject[sorted[i]];

}
console.log(sortedschedule);
res.render('runpage',{runtimedata:sortedschedule});

});
app.get('/saverunwork/:data',function(req,res){
  console.log("data"+req.params.data);var d="\'"+req.params.data+"\'";
  connection.query('SELECT * FROM RUN WHERE DATE=CURRENT_DATE',function(err,rows,fields){
    if(rows.length==0)
    {console.log('firsttiem');

    console.log("d"+d);
      connection.query('INSERT INTO RUN VALUES (CURRENT_DATE,'+d+')',function(err,rows,fields){})
    }
    else {
      connection.query('UPDATE RUN SET TASK='+d+'WHERE DATE=CURRENT_DATE',function(err,rows,fields){})
    }

  })
})
app.get('/runningworkleft',function(req,res){
  connection.query('SELECT task FROM RUN WHERE DATE=CURRENT_DATE',function(err,rows,fields){console.log("task"+rows[0].task);
    var sortedschedule=JSON.parse(rows[0].task)
    console.log("inertes",sortedschedule);
      res.render('runpage',{runtimedata:sortedschedule});
  })

})
app.get('/finish',function(req,res){
connection.query('DELETE FROM RUN WHERE DATE=CURRENT_DATE',function(err,rows,fields){});

})
app.get('/aurdino/m0sec=:msec/bell=:bell',function(req,res)
{console.log('aurdino');
var bufftime=req.params.msec;console.log("recieved time:"+bufftime);
var dat=new Date();
var cures=(dat.getHours()*3600)+(dat.getMinutes()*60)+(dat.getSeconds());
console.log("cures: "+cures);
if((bufftime-cures)==0)/*||((cures-bufftime)>0&&(cures-bufftime)<5)*/
{
  /*connect to aurdino*/console.log('Mathed and its '+req.params.bell);
//  res.send("Signal sent at time : recieved time :"+bufftime+"original time:"+cures);
res.send(bufftime+":"+cures);
//res.send('matched');
}
else {console.log('unmatch');
  res.send("Not matched");res.end();
}


});

/*database connectivity*/
var mysql=require('mysql');
var connection=mysql.createConnection({host:'127.0.0.1',user:'root',password:'',database:'miniproject'});
connection.connect();
/*connection.query('SELECT taskid FROM date_taskid WHERE date =DATE("2017-05-10")',function(err,rows,fields){console.log(rows[0].taskid)});
*/

var datarecieved;
var date_from_form;
app.get('/manage',function(req,res)
{if(Object.keys(req.query).length==0)/*check for empty obj len*/
res.render('manage',{flag:'yes',taskselect:'no'});/*if flag is yes then it is the first vist*/
else {var orgdate=req.query.date.split("/");
   date_from_form=orgdate[2]+"-"+orgdate[0]+"-"+orgdate[1];
console.log(date_from_form);
 select_task_to_display_ondate('manage',date_from_form,res);



}});
function select_task_to_display_ondate(page,daterecieved,res)
{var taskobj;console.log(page);
  connection.query('SELECT taskid FROM date_taskid WHERE date =DATE("'+daterecieved+'")',function(err,rows,fields){//console.log(rows[0].taskid);
  if(rows.length==0){console.log('recieved');
  taskobj={};display(page,res,taskobj);}
  else {var taskd=rows[0].taskid
    connection.query('SELECT task FROM tasks WHERE taskid='+taskd,function(err,rows,fields) {
       taskobj=JSON.parse(rows[0].task);
      console.log("m"+taskobj);display(page,res,taskobj);
});}
});}
function display(page,res,taskobj){
  if(page=='manage')
  res.render('manage',{data:taskobj,flag:'no',taskselect:'no'});
  else {console.log("ll"+taskobj);
  res.render('inc1',{data:taskobj,selected_value:'yes'});
  }
}

app.get('/get_tasks',function(req,res)
{tasks=[]
  connection.query('SELECT * FROM tasks',function(err,rows,fields){
if(rows.length!=0)
{
  for(var i=0;i<rows.length;i++)
  {
    tasks.push({task:JSON.parse(rows[i].task),taskid:rows[i].taskid})

  }
    console.log(tasks);
    res.render('manage',{flag:'yes',tasks:tasks,taskselect:'yes'});
}
else {console.log("came");
  res.render('manage',{flag:'yes',tasks:tasks,taskselect:'yes'});
}

  })

//  res.render('manage',{flag:'yes',tasks:{}})
})











      var input_taskid;
app.get('/deltschdule',function(req,res){
console.log(date_from_form);
if(date_from_form)
{connection.query('SELECT taskid FROM date_taskid WHERE date=DATE("'+date_from_form+'")',function(err,rows,fields){
  checkanddelete=rows[0].taskid;
  connection.query('DELETE FROM date_taskid WHERE date=DATE("'+date_from_form+'")',function(err,rows,fields){
    connection.query('SELECT * FROM date_taskid WHERE taskid='+checkanddelete,function(err,rows,fields){
if(rows.length==0)
connection.query('DELETE FROM tasks WHERE taskid='+checkanddelete,function(err,rows,fields){
  res.render('manage',{flag:'yes',taskselect:'no'});
})
else
  res.render('manage',{flag:'yes',taskselect:'no'});

    })
  })
  })}
})

app.get('/save',function(req,res)
{var input_task=req.query.data;
  //console.log("data"+req.query.data);
  var u="\'"+input_task+"\'";
//  console.log(u);
console.log(date_from_form);
connection.query('SELECT taskid FROM tasks WHERE task='+u+'',function(err,rows,fields){
  if(rows.length==1)/*tassk is allready    present*/
  {
    console.log("dateh"+date_from_form);
  input_taskid=rows[0].taskid;
  console.log(rows[0].taskid);
  t(input_taskid,date_from_form);
  res.render('manage',{flag:'yes',taskselect:'no'});
  res.end();
  }
  else {connection.query('SELECT * FROM tasks',function(err,rows,fields){console.log("RL"+rows.length);
    connection.query('INSERT INTO tasks VALUES ('+(rows.length+1)+','+u+') ',function(err,rowsk,fields){
      console.log('New task'+input_taskid);input_taskid=rows.length+1;
      t(input_taskid,date_from_form);
      res.render('manage',{flag:'yes',taskselect:'no'});
      res.end();
    });
});}});


});
function t(input_taskid,date_recieved)
{
  connection.query('SELECT * FROM date_taskid WHERE date=DATE("'+date_recieved+'")',function(err,rows1,fields){
    if(rows1.length!=0){console.log("t"+input_taskid);
        connection.query('UPDATE date_taskid SET taskid='+input_taskid+' WHERE date=DATE("'+date_recieved+'")');}
        else {console.log("olddate"+date_recieved);
          connection.query('INSERT INTO date_taskid VALUES (DATE("'+date_recieved+'"),'+input_taskid+')');
        }
      });




}
app.get('/Onetomany',function(req,res){
var days=req.query.days;

var date=req.query.date;
console.log("days"+days+"date"+date);
var iterate_date=new Date(date);
for(var i=days;i>0;i--)
{console.log(iterate_date.getFullYear()+"-"+(iterate_date.getMonth()+1)+"-"+iterate_date.getDate());
  t(1,iterate_date.getFullYear()+"-"+(iterate_date.getMonth()+1)+"-"+iterate_date.getDate());
  iterate_date=new Date(iterate_date.getTime()+(24*60*60*1000))
}
res.render("manage",{flag:'yes',taskselect:'no'});
})

app.listen(3000);
