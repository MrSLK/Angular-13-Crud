const db = require('../models');
const Tutorial = db.tutorials;

//create and save a new tutorial
exports.create = (req, res) => {

    //validate request
    if(!req.body.title)
    {
        res.status(404).send({messsage : "Content cannot be empty!"});
        return;
    }

    //create tutorial
    const tutorial = new Tutorial({
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published : false
    });

    //save tutorial
    tutorial
    .save(tutorial)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({messsage : err.message || "Some error occured while creating the tutorial!"});
    });
}

//retrive all the tutorials in the database
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? {title : {$regex: new RegExp(title), $options: "i"}} : {};
    Tutorial.find(condition)
    .then(data =>{res.send(data);
    })
    .catch(err => {
        res.status(500).send({messsage : err.message || "Some error occured while creating the tutorial!"});
    });
}

//find a single tutorial with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Tutorial.findById(id)
    .then(data =>{
        if (!data)
        {
            res.status(404).send({messsage : "Not found tutorial with id " + id});
        }
        else
        {
            res.send(data);
        }
    })
    .catch(err => {
        res
        .status(500)
        .send({messsage : err.message || "error retrieving tutorial with id "+ id});
    });
}

//Update a tutorial by the id in request
exports.update = (req, res) => {
    if(!req.body) {
        return res.status(400).send({messsage: "Data to update cannot be empty!!!"})
    }
    const id = req.params.id;
    Tutorial.findByIdAndUpdate(id, req.body,{useFindAndModify: false})
    .then(data =>{
        if(!data)
        {
            res.status(404).send({messsage: `Cannot update tutorial with id=${id}. Maybe tutorial was not found!`});
        }
        else
        {
            res.send({message: "Tutorial was updated successfully!!!"});
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating tutorial with id=" + id
        });
    });
}

//Delete a tutorial with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Tutorial.findByIdAndRemove(id, req.body,{useFindAndModify: false})
    .then(data => {
        if(!data)
        {
            res.status(404).send({messsage: `Cannot delete tutorial with id=${id}. Maybe tutorial was not found!`});
        }
        else
        {
            res.send({message: "Tutorial was deleted successfully!!!"});
        }
    }).catch(err => {
        res.status(500).send({messsage: "Couldn't delete tutorial with id=${id}"});
    })
}

//Delete all the tutorials in the database
exports.deleteAll = (req, res) => {
    Tutorial.deleteMany({})
    .then(data =>{
        res.send({message : `${data.deletedCount} tutorial deleted successfully`});
    }).catch(err => {
        res.status(500).send({message: err.message || "Some error occurred while deleting all tutorials"
    });
    });
};

//find all published tutorials
exports.findAllPublished = (req, res) => {
    Tutorial.find({published: true})
    .then(data =>{
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({message: err.message || "Some error occurred while retrieving all tutorials"
    });
    });
}