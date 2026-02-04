const express=require('express');
const app= express();
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcrypt');

app.use(express.json());
app.use(cors());

app.post('/auth/register',async(req,res)=>{

  const {name}=req.body;
  const {email}=req.body;
  const {password}=req.body;

  const check= await db.query('select * from users where user_email = $1',[email]);
  if(check.rows.length!=0){
    return res.status(400).json({success:false,msg:'Email already exists!'})
  }

  const saltRound = 10;
  const salt = await bcrypt.genSalt(saltRound);
  const bcryptPassword = await bcrypt.hash(password, salt);

  try {
    const result= await db.query('insert into users (user_name, user_email, user_password) values ($1,$2,$3) returning *',[name,email,bcryptPassword])

    res.json(result.rows[0])
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
})


app.listen(5000,console.log('app is listening at 5000...'))