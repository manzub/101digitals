const express = require("express");
const http = require('http');
const cors = require("cors");
const db = require('./app/models');
const dbConfig = require('./app/config/dbConfig')
const bcrypt = require("bcryptjs");
const authJwt = require("./app/middlewares/authJwt");
const multer = require("multer");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, { 
  cors: { 
    origin: 'http://localhost:3000', 
    methods: ["GET", "POST"], 
    credentials: true, 
    allowedHeaders: ["custom-header"] 
  },
  secure: true,
  rejectUnauthorized: false
});
const User = db.user;
const Chats = {};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public/uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname)
  }
})
const multerUplaod = multer({ storage: storage })

app.use(require("morgan")("dev"))
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

db.mongoose
.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=> {
  console.log("Successfully connect to MongoDB.");
  initializeDB();
  loadChatsDB();
}).catch((err) => {
  console.error("Connection error", err);
  process.exit();
})

function initializeDB() {
  // create test user if not exist
  User.estimatedDocumentCount((err, count) => {
    if(!err && count == 0) {
      new User({ fullname: "John Doe", phone: "0800234590", email: "testuser@gmail.com",password: bcrypt.hashSync("test123", 8), role: 3 }).save((err, user) => {
        if(err) {
          console.log(err);
          process.exit();
        }

        // const testNoti = { title: 'New Trade Created', message: 'You sent $100 giftcard to admin', type: 'trade' }
        // const testService = new db.services({ name: 'Bitcoin $50', denominations: 'Bitcoin $50', type: 'crypto', coinname: 'BTC', rate: '500' });
        // testService.save();
        // const testTx = { 
        //   status: 'pending', 
        //   service: testService,
        //   type: 'trade', amountValue: '50', returnValue: '25000',
        //   notes: 'Metamask - 0x76d96AaE20F26C40F1967aa86f96363F6907aEAB, https://etherscan.io/sdsdsdsdsdsdsd'
        // }


        // user.notifications = [testNoti]
        // user.transactions =  [testTx]
        user.save(() => console.log("Created test user"))
      })
    }
  })
}

function loadChatsDB() {
  db.chats.find({}).exec((err, msgs) => {
    if(err) console.error(err);
    msgs.forEach(item => {
      Chats[item.roomId] = item.chats;
    })
  })
}

let connectedClients = [];
io.on("connection", (socket) => {
  console.log("new client connected: ", socket.id);
  if(connectedClients.find(x => x == socket.id))  {
    // io.re
  }
  // use this in routes
  app.set('socket.io', socket);

  socket.on('connect-client', (chatroom) => {
    // const key = Object.keys(Chats).find(x => x === chatroom)
    // const userChats = Object.values(Chats)[Object.keys(Chats).indexOf(chatroom)];
    socket.emit('messages', Chats);
  })

  socket.on('room-messages', (chatroom) => {
    io.emit('messages', Chats);
  })

  socket.on('send-message', ({ chatroom, sender, message }) => {
    const chatromId = Object.keys(Chats).find(x => x === chatroom)
    if(chatromId) {
      const conversations = Object.values(Chats)[Object.keys(Chats).indexOf(chatromId)];
      let lastConversation = conversations[conversations.length - 1];
      const senderObj = typeof(lastConversation.sender) == 'object';
      const isSender = senderObj ? lastConversation.sender.email == sender.email : lastConversation.sender == sender;
      if(lastConversation && isSender) {
        lastConversation.body.push(message);
        Chats[chatromId] = conversations;
      } else {
        conversations.push({ sender, body: [message] });
        Chats[chatromId] = conversations;
      }
      db.chats.updateOne({ roomId: chatromId }, { chats: conversations }).exec((err) => console.error(err));
      // io.emit('messages', conversations)
    }else {
      Chats[chatroom] = [{ sender, body: [message] }];
      const new_convo = new db.chats({ roomId: chatroom, chats: [{ sender, body: [message] }] });
      new_convo.save((err) => console.error(err));
      // io.emit('messages', Object.values(Chats)[Object.keys(Chats).indexOf(chatroom)])
    }
    io.emit('messages', Chats)
  })

  socket.on('disconnect', () => {
    socket.disconnect(true);
    connectedClients = connectedClients.filter(x => x == socket.id);
    console.info("disconnected client: ", socket.id)
  })
})

app.get("/", (req, res) => res.send({ message: "Welcome to 101digitals application." }));

app.get('/chatrooms', [authJwt.verifyToken, authJwt.isAdmin], (req, res) => res.send({ status: 1, rooms: Object.keys(Chats) }))

app.get('/services', (req, res) => {
  db.services.find({}, function(err, docs) {
    if(err) return res.send({ status: 0, message: 'Could not fetch services' })
    res.send({ status: 1, services: docs })
  })
})

app.get('/admin/transactions', [authJwt.verifyToken, authJwt.isAdmin], (req, res) => {
  User.find({}).exec((err, users) => {
    if(err) return res.send({ status: 0, message: err });
    const transactions = []
    users.forEach(account => {
      account.transactions.forEach(tx => {
        transactions.push({ 
          transaction: { ...tx }, 
          userInfo: { 
            fullname: account.fullname,
            phone: account.phone,
            email: account.email,
            _id: account._id,
            bankInfo: account.bankInfo
          }  
        })
      })
    })
    return res.send({ status: 1, transactions })
  })
})

app.post('/trade/upload-files', [authJwt.verifyToken], (req, res) => {
  const uplaod = multerUplaod.array('file');
  uplaod(req, res, function(err) {
    if(err) return res.send({ status: 0, message: 'An error occurred: '+err })
    res.send({ status: 1, filename: req.files })
  })
})

app.post('/trade/new-transaction', [authJwt.verifyToken], (req, res) => {
  const { email, serviceId, amountValue, returnValue, orderNotes, uploads } = req.body;
  User.findOne({ email: email }).exec((err, user) => {
    if(err) return res.send({ status: 0, message: 'Error occurred, please try agin later' })
    // user not found
    if(!user) return res.send({ status: 0, message: "User Not found." });
    // proceed
    db.services.findById({ _id: serviceId }).exec().then(service => {
      const newTx = { id:req.body?.txId, status: 'pending', service, type: db.TransactionTypes.trade, amountValue, returnValue, notes: orderNotes, uploads };
      user.transactions.push(newTx);
      user.notifications.push({ title: 'New Trade created', message: `You sent $${amountValue} ${service.name} to admin`, type: db.TransactionTypes.trade })
      user.save(() => res.send({ status: 1, message: "New Transaction recorded", data: user }))
    }).catch(err => res.send({ status: 0, message: 'Error occurred, please try agin later' }))
  })
})

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/admin.routes")(app);


// default page not found route
app.use("*", (req, res) => {
  res.status(404).json({
    success: "false",
    message: "Page not found",
    error: {
      statusCode: 404,
      message: "You reached a route that is not defined on this server",
    },
  });
});

const PORT = process.env.PORT || 5555;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
})