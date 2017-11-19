                               ██████╗ ██████╗  ██████╗ ██╗  ██╗                  
                              ██╔════╝██╔═══██╗██╔═══██╗██║ ██╔╝                  
                              ██║     ██║   ██║██║   ██║█████╔╝                   
                              ██║     ██║   ██║██║   ██║██╔═██╗                   
                              ╚██████╗╚██████╔╝╚██████╔╝██║  ██╗                  
                               ╚═════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝                  
                                                                                  
                              ██████╗ ██╗███████╗███████╗ █████╗                  
                              ██╔══██╗██║╚══███╔╝╚══███╔╝██╔══██╗                 
                              ██████╔╝██║  ███╔╝   ███╔╝ ███████║                 
                              ██╔═══╝ ██║ ███╔╝   ███╔╝  ██╔══██║                 
                              ██║     ██║███████╗███████╗██║  ██║                 
                              ╚═╝     ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝                 
                                                                                  
                  ██████╗ ███████╗██╗     ██╗ ██████╗██╗ ██████╗ ██╗   ██╗███████╗
                  ██╔══██╗██╔════╝██║     ██║██╔════╝██║██╔═══██╗██║   ██║██╔════╝
                  ██║  ██║█████╗  ██║     ██║██║     ██║██║   ██║██║   ██║███████╗
                  ██║  ██║██╔══╝  ██║     ██║██║     ██║██║   ██║██║   ██║╚════██║
                  ██████╔╝███████╗███████╗██║╚██████╗██║╚██████╔╝╚██████╔╝███████║
                  ╚═════╝ ╚══════╝╚══════╝╚═╝ ╚═════╝╚═╝ ╚═════╝  ╚═════╝ ╚══════╝
                                                                                  

### Environment
We use mongoose, and 2 databases : Test / Development   
This way will separate datas for unit test.  

## To run unit test :
<pre>
  npm test
</pre>

## To run node server :
<pre>
  npm start
</pre>

## To generate doc 
<pre>
  npm run doc
</pre>
### Model of Pizza : 
<pre>
  let PizzaSchema = new Schema({
    name                : { type: String, uniq: true, required: true },
    desc                : { type: String, required: true },
    picture             : { type: String, required: true },
    price               : { type: Number, required: true },
    ingredient_ids      : [{ type: Schema.Types.ObjectId, ref: 'Ingredient'}],
    update_at           : { type: Date },
    create_at           : { type: Date },
    comments            : [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    first_frame_picture : { data: String, contentType: String }
  });
</pre>
Each pizza has some ingredient_ids in an array.        
The picture property is encode in base64.

### Model of ingredient :
<pre>
let IngredientSchema = new Schema({
    name                : { type: String, uniq: true, required: true },
    wieght              : { type: String, required: true },
    price               : { type: Number, required: true },
    pizza_ids           : [{ type: Schema.Types.ObjectId, ref: 'Pizza'}],
    update_at           : { type: Date },
    create_at           : { type: Date },
    comments            : [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    first_frame_picture : { data: String, contentType: String }
});
</pre>
Each ingredient has some pizza in pizza_ids for each pizza who's contain this ingredient. 


### ROUTES PIZZA
GET ALL PIZZA       -> https://cook-pizza-delicious-martinez-kiloumap.c9users.io/pizza      
GET PIZZA           -> https://cook-pizza-delicious-martinez-kiloumap.c9users.io/pizza/:name  
GET PIZZA           -> https://cook-pizza-delicious-martinez-kiloumap.c9users.io/pizza/:price    
POST PIZZA          -> https://cook-pizza-delicious-martinez-kiloumap.c9users.io/pizza      
PUT PIZZA           -> https://cook-pizza-delicious-martinez-kiloumap.c9users.io/pizza/:name      
DELETE PIZZA        -> https://cook-pizza-delicious-martinez-kiloumap.c9users.io/pizza/:name    

### ROUTES INGREDIENTS
GET ALL INGREDIENTS -> https://cook-pizza-delicious-martinez-kiloumap.c9users.io/ingredient       
GET INGREDIENTS     -> https://cook-pizza-delicious-martinez-kiloumap.c9users.io/ingredient/:name     
GET INGREDIENTS     -> https://cook-pizza-delicious-martinez-kiloumap.c9users.io/ingredient/sort    
POST INGREDIENTS    -> https://cook-pizza-delicious-martinez-kiloumap.c9users.io/ingredient       
PUT INGREDIENTS     -> https://cook-pizza-delicious-martinez-kiloumap.c9users.io/ingredient/:name     
DELETE INGREDIENTS  -> https://cook-pizza-delicious-martinez-kiloumap.c9users.io/ingredient:name    

### See the docs 
https://preview.c9users.io/kiloumap/cook_pizza_delicious_martinez/docs/index.html