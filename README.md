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
                                                                                  

### Specs
Créer une API permettant de gérer un site web de pizzal

L'API doit répondre au minimum à un CRUD avec du REST (GET / POST / PUT / DELETE )

Utiliser la documentation auto-généré ou la créer manuellement.
2 Niveau de documentaton est requis : 
 1. Documentation utilisateur (Description du projet, ScreenShot, guide d'user)
 1. Documentation tecunique (Description des services (paramètres à fournir, 
   retour du service), Description de toutes les methodes). Docco / jsDoc
Creation de 3 dossiers : Controller / Model / View
Utiliser Mongoose.
Utiliser les websockets pour rafraichir la page.

Une BDD doit contenir au minimum  une collection pour stocker toutes les information d'une Pizza (Nom, Description, Prix, Date de création, Date de modification et une image => cette derniere doit être stocker en Base64 en BDD).
Seul le nom d'une pizza doit être unique.
Une liste d'ingrédients doit être visible sur l'application, à défaut d'être dans une collection différentes de pizza, il est possible de créer un sous document dans la pizza contenant les ingrédients.
Les ingrédients sont composé d'un nom, d'un grammage, et d'un prix. Seul le nom est unique
Les TU seront construit avec Mocha et Chai (ou autre), les fichiers de test *Spec.js seront forcement à coté du fichier à tester /!\

* TDD OBLIGATOIRE *
* DOC OBLIGATOIRE *
* REST OBLIGATOIRE *

### TO INSTALL THE PROJECT
<pre>
  sudo apt-get update
  sudo apt-get install mongodb-org
</pre>

### Create tools for mongo
Create folder data
Create file named mongod, copy the line below
<pre>
  mongod --bind_ip=$IP --dbpath=data --nojournal --rest "$@
</pre>
And run 
<pre>
  sudo chmod +x mongod
</pre>

### Model of Pizza : 
<pre>
  let PizzaSchema = new Schema({
    name              : { type: String, uniq: true, required: true },
    desc                : { type: String, required: true },
    picture             : { type: String, required: true },
    price               : { type: Number, required: true },
    update_at           : { type: Date },
    create_at           : { type: Date },
    comments            : [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    first_frame_picture : { data: String, contentType: String }
  });
</pre>

### Model of ingredient :
<pre>
let IngredientSchema = new Schema({
    name                : { type: String, uniq: true, required: true },
    desc                : { type: String, required: true },
    picture             : { type: String, required: true },
    price               : { type: Number, required: true },
    update_at           : { type: Date },
    create_at           : { type: Date },
    comments            : [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    first_frame_picture : { data: String, contentType: String }
});
</pre>


### TO GENERATE RANDOM DATA : 
https://www.json-generator.com/
<pre>
PIZZA :
[
  '{{repeat(5, 7)}}',
  {
    name: '{{surname()}}',
    desc: '{{lorem(1)}}',
    price: '{{integer(5,50)}}',
    create_at: '{{date(new Date(2014, 0, 1), new Date(), "YYYY-MM-dd")}}',
    update_at:'{{date(new Date(2014, 0, 1), new Date(), "YYYY-MM-dd")}}'{lorem(1}},
    comments : '{{lorem(1}}'
  }
]

INGREDIENTS : 
[
  '{{repeat(5, 20)}}',
  {
    name: '{{surname()}}',
    grammage: '{{integer(5,200)}}',
    prix: '{{integer(5,50)}}'
  }
]
</pre>


### ROUTES PIZZA
GET ALL PIZZA -> https://cook-pizza-delicious-martinez-kiloumap.c9users.io/  
GET PIZZA     -> https://cook-pizza-delicious-martinez-kiloumap.c9users.io/:name  
POST PIZZA    ->  https://cook-pizza-delicious-martinez-kiloumap.c9users.io/   
PUT PIZZA     -> https://cook-pizza-delicious-martinez-kiloumap.c9users.io/:name  
DELETE PIZZA  -> https://cook-pizza-delicious-martinez-kiloumap.c9users.io/:name 