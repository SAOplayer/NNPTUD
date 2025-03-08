const express = require('express')
const app = express()
const port = 3000

let posts = [
    {
      "id": "1",
      "title": "a title",
      "views": 100
    },
    {
      "id": "2",
      "title": "another title",
      "views": 200
    },
    {
      "id": "3",
      "title": "another heeh",
      "views": 250
    }]

app.get('/', (req, res) => {
  res.send(posts)
})
app.get('/:id', (req, res) => {
    let post = posts.find(p=>p.id==req.params.id);
    if(post){
        res.send(post)
    }else{
        res.status(404).send({
            message:"id khong hop le"
        })
    }
    
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})