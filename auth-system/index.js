const express=require('express');
const app= express();
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcrypt');
const jwtGenerator = require('./utils/jwtGenerator');
const authorize = require("./middleware/authorization");

app.use(express.json());
app.use(cors());

app.get('/dashboard',authorize,async(req,res)=>{
  try {
    
    const user=await db.query('select user_name from users where user_id=$1',[req.user]);

    return res.status(200).json({success:true,data:user.rows[0]})

  } catch (error) {
    console.log(error);
    return res.status(500).json({success:false,msg:'error'})
  }
})

app.post('/auth/register',async(req,res)=>{

  // const {name}=req.body;
  // const {email}=req.body;
  // const {password}=req.body;

  const {name, email, password}=req.body

  const check= await db.query('select * from users where user_email = $1',[email]);
  if(check.rows.length!=0){
    return res.status(400).json({success:false,msg:'Email already exists!'})
  }

  const saltRound = 10;
  const salt = await bcrypt.genSalt(saltRound);
  const bcryptPassword = await bcrypt.hash(password, salt);

  try {
    const result= await db.query('insert into users (user_name, user_email, user_password) values ($1,$2,$3) returning *',[name,email,bcryptPassword])

    const token=jwtGenerator(result.rows[0].user_id);
    res.json({success:true,msg:token})
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
})

app.post('/auth/login', async(req,res)=>{
  const {email, password}=req.body;
  const result= await db.query('Select * from users where user_email=$1',[email])

  if(result.rows.length===0){
    return res.status(400).json({success:false,msg:'email doesnt exist.'})
  }

  const hashedPassword = result.rows[0].user_password
  const validPassword = await bcrypt.compare(password,hashedPassword)

  if(!validPassword){
    const token = jwtGenerator(result.rows[0].user_id);
    
    res.json({ token });
  }
  else{
    const token = jwtGenerator(result.rows[0].user_id);
    return res.status(200).json({success:true,token:token})
  }

})

app.get("/is-verify", authorize, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


app.listen(5000,console.log('app is listening at 5000...'))