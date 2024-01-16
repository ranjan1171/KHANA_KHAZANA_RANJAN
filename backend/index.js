const express= require("express");
const cors =require("cors");
const mongoose= require("mongoose");
const dotenv=require("dotenv").config();


const app=express()
app.use(cors())
app.use (express.json({limit: "10mb"}));

const PORT=process.env.PORT||8080;


//mongodb connection
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connect to Database"))
  .catch((err) => console.log(err));

//schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmPassword: String,
  image: String,
});

//
const userModel = mongoose.model("user", userSchema);

//api
app.get("/", (req, res) => {
  res.send("Server is running");
});

//sign up
app.post("/signup", async (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  const resultData = await  userModel.findOne({email : email})
  console.log(resultData)
  if(!resultData){
      const data = userModel(req.body)
              const save = data.save()
              res.send({message:"Successfully sign up", alert:true})
  }
  else{
      res.send({message: "Email id is already registered",alert:false})
  }
  });


//api login
app.post("/login", async (req, res) => {
    console.log(req.body);
    const { email } = req.body;
  
    try {
      const resultData = await userModel.findOne({ email: email });
  
      if (resultData) {
        const dataSend = {
          _id: resultData._id,
          firstName: resultData.firstName,
          lastName: resultData.lastName,
          email: resultData.email,
          image: resultData.image,
        };
        console.log(dataSend);
        res.send({
          message: "Login is successful",
          alert: true,
          data: dataSend,
        });
      } else {
        res.send({
          message: "Email is not available, please sign up",
          alert: false,
        });
      }
    } catch (error) {
      console.error(error);
      res.status.send({
        message: "Error during login process",
        alert: false,
      });
    }
  });

  //product section 
  const schemaProduct = mongoose.Schema({
    name: String,
    category:String,
    image: String,
    price: String,
    description: String,
  });
  const productModel = mongoose.model("product",schemaProduct)
  
//save product in database
app.post("/uploadProduct",async(req,res)=>{
  console.log(req.body)
 const data = await productModel(req.body)
 try {
  const datasave = await data.save();
  console.log('Document saved successfully:', datasave);
} catch (error) {
  console.error('Error saving document:', error.message);
  // Handle validation errors or other save-related errors
}
 res.send({message : "Upload successfully"})
})

app.get("/product",async(req,res)=>{


  const data = await productModel.find({})
  
 res.send(JSON.stringify(data))
})



app.listen(PORT, ()=>console.log("server is running at port: "+PORT));
