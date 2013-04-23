// Generated by CoffeeScript 1.6.2
(function() {
  "use strict";
  var Kotae, KotaeSchema, ObjectId, Schema, Toi, ToiSchema, Tsunagari, TsunagariSchema, app, db, express, http, io, mongoose, path, routes, server;

  express = require("express");

  routes = require("./routes");

  http = require("http");

  path = require("path");

  app = express();

  app.configure(function() {
    app.set("port", process.env.PORT || 3000);
    app.set("views", __dirname + "/views");
    app.set("view engine", "ejs");
    app.use(express.favicon());
    app.use(express.logger("dev"));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(require("less-middleware")({
      src: __dirname + "/public"
    }));
    return app.use(express["static"](path.join(__dirname, "public")));
  });

  app.configure("development", function() {
    return app.use(express.errorHandler());
  });

  app.get("/", routes.index);

  server = http.createServer(app);

  mongoose = require("mongoose");

  db = mongoose.connect("mongodb://localhost/tortoi");

  Schema = mongoose.Schema;

  ObjectId = Schema.ObjectId;

  ToiSchema = new mongoose.Schema({
    text: {
      type: String
    },
    position: {
      left: Number,
      top: Number
    },
    size: {
      width: Number,
      height: Number
    },
    date: Date,
    kotae: [ObjectId]
  });

  KotaeSchema = new mongoose.Schema({
    text: {
      type: String
    },
    toi: ObjectId,
    date: Date
  });

  TsunagariSchema = new mongoose.Schema({
    from: [ObjectId],
    fromType: Number,
    to: [ObjectId],
    toType: Number
  });

  Toi = db.model("toi", ToiSchema);

  Kotae = db.model("kotae", KotaeSchema);

  Tsunagari = db.model("tsunagari", TsunagariSchema);

  server.listen(app.get("port"), function() {
    return console.log("Express server listening on port " + app.get("port"));
  });

  io = require("socket.io").listen(server);

  io.sockets.on("connection", function(socket) {
    Toi.find(function(err, tois) {
      if (err) {
        console.log(err);
      }
      socket.emit("createToiIni", tois);
      console.log(tois);
      return tois.forEach(function(toi) {
        return toi.kotae.forEach(function(kota) {
          console.log(kota);
          return Kotae.findById(kota, function(err, mutch) {
            console.log(mutch);
            if (err) {
              console.log(err);
            }
            return socket.emit("createKotaeIni", [mutch]);
          });
        });
      });
    });
    socket.on("createToi", function(toiData) {
      var toi;

      toi = new Toi(toiData);
      return toi.save(function(err) {
        if (err) {
          return;
        }
        socket.broadcast.json.emit("createToi", [toi]);
        return socket.emit("createToi", [toi]);
      });
    });
    socket.on("createKotae", function(data) {
      var kotae, kotaeData;

      kotaeData = {
        text: data.text,
        toi: data.toiId
      };
      kotae = new Kotae(kotaeData);
      return kotae.save(function(err) {
        if (err) {
          return;
        }
        Toi.findById(data.toiId, function(err, toi) {
          var bufKotae;

          bufKotae = toi.kotae;
          bufKotae.push(kotae._id);
          return toi.update({
            kotae: bufKotae
          }, function(err, numberAffected, raw) {
            if (err) {
              return handleError(err);
            }
            console.log('The number of updated documents was %d', numberAffected);
            return console.log('The raw response from Mongo was ', raw);
          });
        });
        socket.broadcast.json.emit("createKotae", [kotae]);
        return socket.emit("createKotae", [kotae]);
      });
    });
    socket.on("createTsunagari", function(tsunagariData) {
      var tsunagari;

      tsunagari = new Tsunagari(tsunagariData);
      return tsunagari.save(function(err) {
        if (err) {
          return;
        }
        socket.broadcast.json.emit("createTsunagari", [tsunagari]);
        return socket.emit("createTsunagari", [tsunagari]);
      });
    });
    socket.on("move", function(data) {
      return Toi.findOne({
        _id: data._id
      }, function(err, toi) {
        if (err || toi === null) {
          return;
        }
        toi.position = data.position;
        toi.save();
        return socket.broadcast.json.emit("move", data);
      });
    });
    socket.on("resize", function(data) {
      Toi.findOne({
        _id: data._id
      }, function(err, toi) {
        if (err || toi === null) {
          return;
        }
        toi.size = data.size;
        return toi.save();
      });
      return socket.broadcast.json.emit("resize", data);
    });
    socket.on("update-toi", function(data) {
      return Toi.findOne({
        _id: data._id
      }, function(err, toi) {
        if (err || toi === null) {
          return;
        }
        toi.text = data.text;
        toi.save();
        return socket.broadcast.json.emit("update-toi", data);
      });
    });
    socket.on("update-kotae", function(data) {
      return Kotae.findOne({
        _id: data._id
      }, function(err, kotae) {
        if (err || kotae === null) {
          return;
        }
        kotae.text = data.text;
        kotae.save();
        return socket.broadcast.json.emit("update-kotae", data);
      });
    });
    socket.on("removeToi", function(data) {
      return Toi.findOne({
        _id: data._id
      }, function(err, toi) {
        var query;

        if (err || toi === null) {
          return;
        }
        toi.remove();
        query = Kotae.remove({
          toi: data._id
        });
        query.exec();
        return socket.broadcast.json.emit("removeToi", data);
      });
    });
    return socket.on("removeKotae", function(data) {
      return Kotae.findById(data._id, function(err, kotae) {
        var toiId;

        if (err || kotae === null) {
          return;
        }
        toiId = kotae.toi;
        kotae.remove();
        Toi.findById(toiId, function(err, toi) {
          var bufKotae, i, index, _i, _len;

          if (err || toi === null) {
            return;
          }
          bufKotae = toi.kotae;
          for (index = _i = 0, _len = bufKotae.length; _i < _len; index = ++_i) {
            i = bufKotae[index];
            if (String(i === String(data._id))) {
              bufKotae.splice(index, 1);
              break;
            }
          }
          return toi.update({
            kotae: bufKotae
          }, function(err, numberAffected, raw) {
            if (err) {
              return handleError(err);
            }
            console.log('The number of updated documents was %d', numberAffected);
            return console.log('The raw response from Mongo was ', raw);
          });
        });
        return socket.broadcast.json.emit("removeKotae", data);
      });
    });
  });

}).call(this);
