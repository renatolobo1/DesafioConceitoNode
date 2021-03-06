const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// function validateRepositoieId(request, response, next){
//   const { id} = request.params;

//   if(!isUuid(id)){
//     return response.status(400).json({ error: 'Invalid Project ID'});
//   }
//   return next();
// }

  // app.get('/repositories', (request, response) => { 
  //   const {title} = request.query;
  
  //   const results = title
  //     ? repositories.filter(repositorie => repositorie.title.includes(title))
  //     : repositories
  
  //   return response.json(results);
  // });
  function validateRepositoryId(request, response, next){
    const { id} = request.params;
  
    if(!isUuid(id)){
      return response.status(400).json({ error: 'Invalid Project ID'});
    }
    return next();
  }

  app.get('/repositories', (request, response) => { 
    
  
    return response.json(repositories);
  });
  

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = {id: uuid(),title, url, techs, likes:0};

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id",validateRepositoryId,  (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  const repository = repositories.find((repository) => repository.id === id);

  const repoData = {
    id,
    title: title ? title : repository.title,
    url: url ? url : repository.url,
    techs: techs ? techs : repository.techs,
    likes: repository.likes,
  };
  repositories[repositoryIndex] = repoData;

  return response.json(repoData);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Project not found.'})
  }
  

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
  
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(400).send();
  }

  repository.likes++;

  return response.json(repository);
});



module.exports = app;
