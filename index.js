import express from "express";
import bodyParser from "body-parser";
import axios from "axios";


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs"); // Adăugăm configurarea pentru EJS
const port = 3000;
let data;

app.get("/", (req, res)=>{
    res.render("index.ejs");
})


app.post("/", async (req, res)=>{
    try{
        const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/random.php`);
        data = response.data.drinks[0];

        const ingredients = []
        for(let i=0; i<15; i++){
            const ingredientKey = `strIngredient${i}`
            if(data[ingredientKey]){
                ingredients.push(data[ingredientKey])
            }
        }

        const measures = []
        for(let i=0; i<15; i++){
            const measureKey = `strMeasure${i}`
            if(data[measureKey]){
                measures.push(data[measureKey])
            }
        }

        res.render("index.ejs", {activity: data, ingredients, measures});
    }catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("index.ejs", {
          error: error.message,
        });
      }
})

app.post("/search-name", async(req, res)=>{
    try{
        const cocktailName = req.body.numeBautura;
        const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktailName}`)
        const data = response.data;
        const drinksName = [];
        for(let i=0; i<data.drinks.length;i++){
            drinksName.push(data.drinks[i].strDrink);
        }

        const ingredientss = []
        for(let i=0; i<15; i++){
            const ingredientKey = `strIngredient${i}`
            if(data.drinks[0][ingredientKey]){
                ingredientss.push(data.drinks[0][ingredientKey])
            }
        }
        res.render("index.ejs",{bauturi: drinksName, ingredientss});
    }catch(error2){
        console.error("Failed to make request:", error2.message);
        res.render("index.ejs", {
            error2: "No activities that match your criteria.",
          })
    }
})

app.post("/search-ingredient", async(req, res)=>{
    try{
        const ingredientName = req.body.numeIngredient;
        const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredientName}`);
        const data = response.data;
        const drinksNameWithThatIngredient = []
        for(let i = 0;i<data.drinks.length;i++){
            drinksNameWithThatIngredient.push(data.drinks[i].strDrink);
        }
        res.render("index.ejs", {bauturaDupaIngredient: drinksNameWithThatIngredient});
    }catch(error3){
        console.error("Failed to make request:", error3.message);
        res.render("index.ejs", {
            error3: "No activities that match your criteria.",
          })
    }
    }
)

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });