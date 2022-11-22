const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { Sequelize, DataTypes } = require('sequelize');
const { registerWebPlugin } = require("@capacitor/core");


app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});



var sequelize = new Sequelize(
  "database",
  "admin",
  "123",
  {
    host: "0.0.0.0",
    dialect: "sqlite",
    // Data is stored in the file `database.sqlite` in the folder `db`.
    // Note that if you leave your app public, this database file will be copied if
    // someone forks your app. So don't use it to store sensitive information.
    storage: "./backend/database.sqlite"
  }
);

const User = sequelize.define('User', {
  name: DataTypes.STRING,
  password: DataTypes.STRING,
  email: DataTypes.STRING,
  photo: DataTypes.BLOB('long')
});

const ProjectUser = sequelize.define('ProjectUser', {
  projectId: DataTypes.INTEGER,
  userId: DataTypes.INTEGER
});

const Project = sequelize.define('Project', {
  name: DataTypes.STRING,
  description: DataTypes.STRING,
  repository: DataTypes.STRING
})

const Tester = sequelize.define('Tester', {
  userId: DataTypes.INTEGER,
  projectId: DataTypes.INTEGER
})

const Bug = sequelize.define('Bug', {
  userId: DataTypes.INTEGER,
  projectId: DataTypes.INTEGER,
  description: DataTypes.STRING,
  severity: {
    type: DataTypes.ENUM,
    values: ['low', 'medium', 'high', 'critical']
  },
  link: DataTypes.STRING,
  assignedUser: DataTypes.INTEGER
})

sequelize
  .authenticate()
  .then(function(err) {
    console.log("Connection established.");


    User.sync();
    ProjectUser.sync();
    Project.sync();
    Tester.sync();
    Bug.sync();

  })
  .catch(function(err) {
    console.log("Unable to connect to database: ", err);
  });


app.post("/api/addUser", (req, res, next) => {
  const user = req.body;
  User.create(user).then(data => {
    res.status(201).json(data.dataValues);
  });

});

app.post("/api/addProject", (req, res) => {
  const project = req.body;
  //console.log(project);
  Project.create(project.details).then(data => {
    //console.log(data);
    project.team.forEach(member => {
      ProjectUser.create({
        projectId: data.dataValues.id,
        userId: member
      })
    });
  });
  res.status(201).json({
    message: 'Project added successfully'
  });
})

app.post("/api/addUserToProject", (req, res) => {
  const post = req.body;
  ProjectUser.create(post).then(() => res.status(200));
})

app.post("/api/auth", (req, res) => {
  const loginData = req.body;

  User.findAll({
    where: {
      email: loginData.email,
      password: loginData.password
    }
  }).then(data => {
    const reply = data.map(d => d.dataValues);
    if (reply.length === 0){
      res.status(200).json({
        message: "This email and password combination does not exist"
      });
    }
    else if(reply.length === 1){
      res.status(200).json({
        message: 'Loged in',
        user: reply[0]
      });
    }
    else{
      res.status(200).json({
        message: 'Unknown error'
      });
    }
  })

})

app.post('/api/user', (req, res) => {
  const idSearch = req.body.id;
  //console.log('server');
  //console.log(req.body)
  User.findAll({
    where: {
      id: idSearch
    }
  }).then(data => {
    //console.log(data);
    res.status(200).json(data[0].dataValues);
  });
})

app.post('/api/project', (req, res) =>{
  const idSearch = req.body.id;
  const query = `SELECT * From(
    SELECT
        Users.id as userId,
      Users.name as UserName,
      Users.email,
      Users.photo,
      Projects.id as projectId,
      Projects.name as projectName,
      Projects.description,
      Projects.repository
      FROM Users
      JOIN ProjectUsers
        ON Users.id = ProjectUsers.userId
      JOIN Projects
        ON Projects.id = ProjectUsers.projectId)

    Where projectId = ` + idSearch + `;`;

    sequelize.query(query).then((results, metadata) =>
  {
    //console.log(results);
    res.status(200).json(results[0]);
  });
})

app.delete('/api/project/:projectId', async (req, res) => {
  const projectId = req.params.projectId;
  await Project.destroy({
    where: {
      id: projectId
    }
  });

  await ProjectUser.destroy({
    where: {
      projectId: projectId
    }
  });
})

app.delete('/api/userProjects/:projectId/:userId', async (req, res) => {
  const projectId = req.params.projectId;
  const userId = req.params.userId;
  console.log('delete user from project');
  console.log(projectId, userId);
  await ProjectUser.destroy({
    where: {
      projectId: projectId,
      userId: userId
    }
  });

})

app.post('/api/addTester', (req, res) => {
  Tester.create(req.body).then(() => res.status(200));
})

app.post('/api/addBug', (req, res) => {
  const bug = req.body;
  /* userId: DataTypes.INTEGER,
  projectId: DataTypes.INTEGER,
  description: DataTypes.STRING,
  severity: {
    type: DataTypes.ENUM,
    values: ['low', 'medium', 'high', 'critical']
  },
  link: DataTypes.STRING,
  assignedUser: DataTypes.INTEGER */
  Bug.create({
    userId: bug.testerId,
    projectId: bug.projectId,
    description: bug.description,
    severity: bug.severity,
    link: bug.link,
    assignedUser: -1
  }).then(() => res.status(200));
})

app.post('/api/userProjects', (req, res) => {
  const idSearch = req.body.id;

  const query = `SELECT * From(
    SELECT
        Users.id as userId,
      Users.name as UserName,
      Users.email,
      Users.photo,
      Projects.id as projectId,
      Projects.name as projectName,
      Projects.description,
      Projects.repository
      FROM Users
      JOIN ProjectUsers
        ON Users.id = ProjectUsers.userId
      JOIN Projects
        ON Projects.id = ProjectUsers.projectId)
    Where userId = ` + idSearch + ";"

  const query2 = `SELECT
  Users.id as userId,
Users.name as UserName,
Users.email,
Users.photo,
ProjectUsers.projectId
FROM Users
JOIN ProjectUsers
  ON Users.id = ProjectUsers.userId
where projectId in (Select projectId from ProjectUsers
Where userId =` + idSearch+ `);`
  sequelize.query(query).then((results, metadata) =>
  {
    console.log(results);
    sequelize.query(query2).then((results2, metadata2) => {
      //console.log('kilo');
      //console.log(results2[0]);
      res.status(200).json({userProjects:results[0], usersProjects: results2[0]});
    })

  });

})

app.use('/api/users', (req, res, next) => {
  const users = User.findAll().then((users => {
    //console.log();

    res.status(200).json(users.map(user =>
      ({
        id: user.dataValues.id,
        name: user.dataValues.name,
        email: user.dataValues.email,
        photo: user.dataValues.photo
      })

    ));
  })

  );

});

app.use('/api/projects', (req, res) => {
  Project.findAll().then(data =>
    res.status(200).json(data.map(project =>
    ({
      id: project.dataValues.id,
      name: project.dataValues.name,
      description: project.dataValues.description,
      repository: project.dataValues.repository
    })

  )))
})

app.post('/api/tester', (req, res) => {
  Tester.findAll({
    where: {
      userId: req.body.id
    }
  }).then(data => {
    //console.log('lll');
    //console.log(data);
    res.status(200).json(data);
  })
})


module.exports = app;
