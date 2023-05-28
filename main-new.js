/*
const embed = {
"title": "title",
"description": "desc",
"color": 1041866,
"image": {
"url": "https://cdn.discordapp.com/embed/avatars/0.png"
}
};
message.channel.send({ embed });

const embed = {
"title": "title",
"description": "desc",
"color": 1041866,
"author": {
"name": message.author.username,
"icon_url": message.author.avatarURL
}
};
//client.channels.cache.get("").send({ embed });

const embed = {
"title": "コマンドが実行されました！",
"description": "実行されたコマンド\n```"+message.content+"```\n実行されたサーバー名\n```"+message.guild.name+"```\n実行されたサーバーのid\n```"+message.guild.id+"```\n実行されたチャンネル名\n```"+message.channel.name+"```\n実行されたチャンネルid\n```"+message.channel.id+"```\nメッセージid\n```"+message.id+"```\nメッセージurl\n[message link](https://discord.com/channels/"+message.guild.id+"/"+message.channel.id+"/"+message.id+")",
"color": 1041866,
"author": {
"name": message.author.username,
"icon_url": message.author.avatarURL
}
};
////client.channels.cache.get("773035867894972416").send({ embed });



*/
const setTZ = require('set-tz')
setTZ('Asia/Tokyo')
require("date-utils");
require('dotenv').config();
var startuplog = "";
startuplog = "起動ログ\n```モジュールのロード:";
var hrstart = process.hrtime();
const discord = require("discord.js");
require("./ExtendedMessage");
const client = new discord.Client();
const token = process.env.token;
const mysql = require("mysql");
var invites = []
startuplog = startuplog + process.hrtime(hrstart)[1] / 1000000 + "ms\n";
var hrstart1 = process.hrtime();
startuplog = startuplog + "discordへの接続:";
const ch_name = "countdown";
client.on("ready", async message => {
  client.user.setPresence({
    status: "idle",
    activity: {
      name: "now booting...",
      type: "PLAYING"
    }
  });
  startuplog = startuplog + process.hrtime(hrstart1)[1] / 1000000 + "ms\n";
  var hrstart2 = process.hrtime();
  startuplog = startuplog + "DBへの接続:";


  function sleep(waitSec, callbackFunc) {
    // 経過時間（秒）
    var spanedSec = 0;
    // 1秒間隔で無名関数を実行
    var id = setInterval(function () {
      spanedSec++;
      // 経過時間 >= 待機時間の場合、待機終了。
      if (spanedSec >= waitSec) {
        // タイマー停止
        clearInterval(id);
        // 完了時、コールバック関数を実行
        if (callbackFunc) callbackFunc();
      }
    }, 1000);
  }
  const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "owo",
    password: "owoofficial",
    database: "oneworld"
  });
  connection.connect(err => {
    if (err) {

      startuplog = startuplog + "失敗\n DBへの接続に失敗しました。起動を完了できません。```";

      throw new Error('DBに接続できません！');
      return;
    }
    connection.query("SELECT * FROM channel", async (error, results) => {
      for (const id of results.map(obj => obj.id)) {
        connection.query("UPDATE channel SET progress = 0 WHERE id = '" + id + "';", (error, results) => {
          if (error) {
            console.log(error)

            return;
          }
        });
      }
    });
    connection.query("SELECT * FROM raidchannel", async (error, results) => {
      for (const id of results.map(obj => obj.id)) {
        connection.query("UPDATE raidchannel SET progress = 0 WHERE id = '" + id + "';", (error, results) => {
          if (error) {
            console.log(error)

            return;
          }
        });
      }
    });
  });
  startuplog = startuplog + process.hrtime(hrstart2)[1] / 1000000 + "ms\n";
  startuplog = startuplog + "総合起動時間:";
  startuplog = startuplog + process.hrtime(hrstart)[1] / 1000000 + "ms\n";
  startuplog = startuplog + "起動完了しました。```";

  var hour = 0;
  var min = 0;
  var sec = 0;
  const cron = require("node-cron");
  cron.schedule("* * * * * *", () => {
    sec++;
    if (sec == 60) {
      min++;
      sec = 0;
    }
    if (min == 60) {
      hour++;
      min = 0;
    }
    client.user.setPresence({
      status: "online",
      activity: {
        name: ";;help || now working...\n起動してから:" + hour + "時間" + min + "分" + sec + "秒経過…",
        type: "PLAYING"
      }
    });
  });

  cron.schedule("0 0 0 1 * *", () => {
    connection.query("SELECT * FROM user WHERE NOT fastpassport = 0", async (error, results) => {
      for (const id of results.map(obj => obj.id)) {
        connection.query("UPDATE user SET fastpassport = 0 WHERE id = '" + id + "';", (error, results) => { });
      }
    });
    connection.query("SELECT * FROM user WHERE NOT vote = 0", async (error, results) => {
      for (const id of results.map(obj => obj.id)) {
        connection.query("UPDATE user SET vote = 0 WHERE id = '" + id + "';", (error, results) => { });
      }
    });
    connection.query("SELECT * FROM channel WHERE NOT fastpassport = 0", async (error, results) => {
      for (const id of results.map(obj => obj.id)) {
        connection.query("UPDATE channel SET fastpassport = 0 WHERE id = '" + id + "';", (error, results) => { });
      }
    });
    connection.query("SELECT * FROM raidchannel WHERE NOT id = '773754453374533654'", async (error, results) => {
      for (const id of results.map(obj => obj.id)) {
        connection.query("DELETE FROM raidchannel WHERE id = '" + id + "';", (error, results) => { });
      }
    });
  });
  client.on("message", async message => {
    var expmagni = 1;

    if (message.content.startsWith(";;")) {
      var maintenance = false;
      if (maintenance && message.author.id != 796972193287503913) {
        var reply = await message.inlineReply("メンテナンス中です。メンテ終了までおまちください。");
        reply.delete({
          timeout: 3000
        });
        return;
      }
      connection.query("SELECT * FROM user WHERE id = '" + message.author.id + "'", async (error, results) => {
        if (error) {
          console.log(error)

          return;
        }
        if (results.length == 0 && message.content != ";;register") {
          message.inlineReply('```diff\n - 最初に";;register"でアカウントを作成しましょう！```');
          return;
        } else {
          try {
            if (message.content != ";;register") {
              connection.query("SELECT * FROM user WHERE id = '" + message.author.id + "'", async (error, results) => {
                if (error) {
                  console.log(error)

                  return;
                }
                if (results[0] === undefined) {
                  message.inlineReply("最初に';;register'でアカウントを作成しましょう！");
                  return;
                }
                if (results[0]["self"] && results[0]["trycount"] < 5) {
                  connection.query("UPDATE user SET trycount = " + (parseInt(results[0]["trycount"]) + 1) + " WHERE id = '" + message.author.id + "';", (error, results) => {
                    if (error) {
                      console.log(error)

                      return;
                    }
                  });
                  const embed = {
                    title: "重要なお知らせがあります",
                    description: "今すぐあなたのDMを確認してください。",
                    color: 11020333
                  };
                  message.channel.send({
                    embed
                  });
                }
                if (results[0]["self"] && results[0]["trycount"] == 5) {
                  connection.query("UPDATE channel SET self = 1 WHERE id = '" + message.channel.id + "';", (error, results) => {
                    if (error) {
                      console.log(error)

                      return;
                    }
                  });
                }
              });
            }

            function sleepByPromise(sec) {
              return new Promise(resolve => setTimeout(resolve, sec * 1000));
            }
            async function wait(sec) {
              await sleepByPromise(sec);
            }
            var waitsec = 3;
            if (results[0] !== undefined) {
              if (results[0]["fastpassport"] == 1) {
                waitsec = 1;
              } else if (results[0]["fastpassport"] == 2) {
                waitsec = 0;
              } else { }
            } else { }
            connection.query("SELECT * FROM channel WHERE id = '" + message.channel.id + "'", async (error, results) => {
              if (error) {
                console.log(error)

                return;
              }
              if (results[0] !== undefined) {
                if (results[0]["fastpassport"] == 1 && waitsec != 0) {
                  waitsec = 3;
                } else if (results[0]["fastpassport"] == 2) {
                  waitsec = 0;
                } else { }
              } else { }
              await wait(waitsec);

              if (!message.content.startsWith(";;atk") && !message.content.startsWith(";;attack") && !message.content.startsWith(";;f") && !message.content.startsWith(";;fire") && !message.content.startsWith(";;rattack") && !message.content.startsWith(";;rf") && !message.content.startsWith(";;rfire")) {
                connection.query("UPDATE user SET samecommand = 0 WHERE id = '" + message.author.id + "';", (error, results) => {
                  if (error) {
                    console.log(error)

                    return;
                  }
                });
              }

              if (message.content == ";;pray") {
                connection.query("SELECT * FROM user WHERE id = '" + message.author.id + "' AND NOT hp = 0", async (error, results) => {
                  if (error) {
                    console.log(error)

                    return;
                  }
                  if (results[0] === undefined) {
                    message.inlineReply("あなたはもうすでに死亡しています！");
                    return;
                  }
                  if (results[0]["pray"]) {
                    message.inlineReply("あなたはもうすでに祈りを捧げています！");
                    return;
                  }
                  connection.query("UPDATE user SET pray = 1 WHERE id = '" + message.author.id + "';", (error, results) => {
                    if (error) {
                      console.log(error)

                      return;
                    }
                    message.channel.send(message.author.username + "は祈りを捧げた！");
                    connection.query("SELECT * FROM user WHERE joinchannel = '" + message.channel.id + "' AND hp = 0", async (error, results) => {
                      if (error) {
                        console.log(error)

                        return;
                      }
                      if (results[0] === undefined) {
                        message.inlineReply("このチャンネルで死亡している人はいません！");
                        return;
                      }
                      for (const id of results.map(obj => obj.id)) {
                        connection.query("UPDATE user SET hp = 1 WHERE id = '" + id + "';", (error, results) => {
                          if (error) {
                            console.log(error)

                            return;
                          }
                          message.channel.send("<@" + id + ">は" + message.author.username + "の祈りを受けて復活した！");
                        });
                      }
                    });
                  });
                });
              }
              if (message.content == ";;er") {
                connection.query("SELECT * FROM user WHERE joinchannel IS NULL AND hp = 0", async (error, results) => {
                  if (error) {
                    console.log(error)

                    return;
                  }
                  if (results[0] === undefined) {
                    message.inlineReply("応急手当を必要としている人はいません！");
                    return;
                  }
                  for (const id of results.map(obj => obj.id)) {
                    connection.query("UPDATE user SET hp = 1 WHERE id = '" + id + "';", (error, results) => {
                      if (error) {
                        console.log(error)

                        return;
                      }
                      message.channel.send("<@" + id + ">は" + message.author.username + "からの応急手当をうけて復活した！");
                    });
                  }
                });
              }
              if (message.content === ";;dlist") {
                connection.query("SELECT * FROM user WHERE id = '" + message.author.id + "'", async (error, results) => {
                  if (results[0]["money"] == 0) {
                    const embed = {
                      title: "あなたはまだ課金していないか、運営が課金の事実を確認できていません！",
                      color: 11020333
                    };
                    message.channel.send({
                      embed
                    });
                    return;
                  }
                  var text = "課金は250円から受け付けています。あなたの残高は500円未満のようです。\n\n";
                  if (results[0]["money"] > 249) {
                    text = "raidchannel:¥250\nレイドチャンネルの登録権を得ます。購入コマンドを実行したチャンネルがレイドチャンネルとなります。すでにそのチャンネルが冒険チャンネルとして登録されている場合は登録できません。\n有効期間は購入日にかかわらず、購入月の末日までです。\n\n";
                    if (results[0]["money"] > 499) {
                      text = text + "fastpassport:¥500\nfastpassportは1ヶ月間OneWorldのプレイを快適にします。\nコマンドごとのクールダウンを短縮し、処理を比較的優先に行います。\n有効期間は購入日にかかわらず、購入月の末日までです。\n\n";
                      if (results[0]["money"] > 1499) {
                        text = text + "fastpassport+:1500\nfastpassport+は1ヶ月間OneWorldのプレイをfastpastportよりも快適にします。\nコマンドごとのクールダウンはなくなり、あなたの処理は最優先で行われます。\n有効期間は購入日にかかわらず、購入月の末日までです。\n\n";
                        text = text + "channel-fastpassport:1500\nchannel-fastpassportは1ヶ月間OneWorldのプレイを快適にします。\nコマンドごとのクールダウンを短縮し、チャンネルの利用者の処理を比較的優先に行います。\nまた、この効果はこのアイテムを購入したチャンネルを利用する全員に適用されます。\n ※利用者がfastpassport+を既に購入している場合はfastpassport+の効果が優先されます。\n有効期間は購入日にかかわらず、購入月の末日までです。\n\n";
                        if (results[0]["money"] > 4499) {
                          text = text + "channel-fastpassport+:4500\nchannel-fastpassport+は1ヶ月間OneWorldのプレイをfastpastportよりも快適にします。\nコマンドごとのクールダウンはなくなり、チャンネルの利用者の処理は最優先で行われます。\nまた、この効果はこのアイテムを購入したチャンネルを利用する全員に適用されます。\n有効期間は購入日にかかわらず、購入月の末日までです。\n\n";
                          text = text + "exp-boost:5000:経験値を大量に獲得します。\n現在の職業に加算されるので事前に職業は切り替えておいてください。\n\n";
                          text = text + "skip-battle:5000:戦闘をスキップします。\n\n";
                        }
                      }
                    }
                  }
                  text = text + "あなたの残高:\n" + results[0]["money"] + '\n課金したい項目が見つかったら";;donate (name)"で購入しましょう！';
                  const embed = {
                    title: "課金メニュー",
                    description: text,
                    color: 1041866
                  };
                  message.channel.send({
                    embed
                  });
                });
              }
              if (message.content.startsWith(";;addmoney ") && message.author.username == "yussy") {
                var args = message.content.split(" ");
                if (message.mentions.users.count == 0) {
                  message.inlineReply("please set username");
                  return;
                }
                var user = message.mentions.users.first();
                if (!args[2].match(/^[0-9]+$/)) {
                  message.inlineReply("追加するクレジット数は数字でお願いします…");
                  return;
                }
                connection.query("SELECT * FROM user WHERE id = '" + user.id + "';", async (error, results) => {
                  if (error) {
                    console.log(error)

                    return;
                  }
                  connection.query("UPDATE user SET money = '" + (parseInt(results[0]["money"]) + parseInt(args[2])) + "' WHERE id = '" + user.id + "';", (error, results) => {
                    if (error) {
                      console.log(error)

                      return;
                    }
                    message.inlineReply("課金額の付与に成功しました！！");
                  });
                });
              }
              if (message.content.startsWith(";;donate")) {
                if (message.author.bot) {
                  message.inlineReply("Botは課金できません！");
                  return;
                }
                connection.query("SELECT * FROM user WHERE id = '" + message.author.id + "'", async (error, results) => {
                  if (results[0]["money"] == 0) {
                    const embed = {
                      title: "あなたはまだ課金していないか、運営が課金の事実を確認できていません！",
                      color: 11020333
                    };
                    message.channel.send({
                      embed
                    });
                    return;
                  }
                  var args = message.content.split(" ");
                  var requiremoney = 250;
                  var name = "";
                  switch (args[1]) {
                    case "raidchannel":
                      requiremoney = 250;
                      name = "raidchannel";
                      break;
                    case "fastpassport":
                      requiremoney = 500;
                      name = "fastpassport";
                      break;
                    case "fastpassport+":
                      requiremoney = 1500;
                      name = "fastpassport+";
                      break;
                    case "channel-fastpassport":
                      requiremoney = 1500;
                      name = "fastpassport";
                      break;
                    case "channel-fastpassport+":
                      requiremoney = 4500;
                      name = "channel-fastpassport+";
                      break;
                    case "exp-boost":
                      requiremoney = 5000;
                      name = "exp-boost";
                      break;
                    case "skip-battle":
                      requiremoney = 5000;
                      name = "skip-battle";
                      break;
                    default:
                      name = null;
                      break;
                  }
                  if (name === null) {
                    const embed = {
                      title: "その課金項目はありません！",
                      color: 11020333
                    };
                    message.channel.send({
                      embed
                    });
                    return;
                  }
                  if (results[0]["money"] < requiremoney) {
                    const embed = {
                      title: "残高が足りません！\nあなたの残高:\n" + results[0]["money"],
                      color: 11020333
                    };
                    message.channel.send({
                      embed
                    });
                    return;
                  }
                  if ((name == 'fastpassport' || name == 'fastpassport+') && (results[0]["fastpassport"] == 1 || results[0]["fastpassport"] == 2)) {
                    const embed = {
                      title: "あなたはすでに今月末までのファストパスポートを購入しています！",
                      color: 11020333
                    };
                    message.channel.send({
                      embed
                    });
                    return;
                  }
                  if (name == "raidchannel") {
                    var nowmoney = results[0]["money"];
                    connection.query("SELECT count(*) FROM channel WHERE id = '" + message.channel.id + "'", (error, results) => {
                      if (error) {
                        console.log(error)

                        return;
                      }
                      if (results[0]["count(*)"] != 0) {
                        message.inlineReply("```diff\n 冒険チャンネルとして登録されているチャンネルをレイドチャンネルとして登録することはできません！```");
                        return;
                      }
                      connection.query("SELECT count(*) FROM raidchannel WHERE id = '" + message.channel.id + "'", (error, results) => {
                        if (error) {
                          console.log(error)

                          return;
                        }
                        if (results[0]["count(*)"] != 0) {
                          message.inlineReply("```diff\n このチャンネルはもうすでに登録されています！```");
                          return;
                        }
                        connection.query("INSERT INTO raidchannel(id) VALUES ('" + message.channel.id + "')", (error, results) => {
                          if (error) {
                            console.log(error)

                            return;
                          }
                          message.inlineReply("```diff\n +このチャンネルをOneWorldのレイドチャンネルとして登録しました！\n```");
                          var embed = {
                            title: "レイドチャンネルが登録されました！",
                            description: "チャンネル名:\n" + message.channel.name + "\nサーバー名:\n" + message.guild.name + "\nチャンネルid:\n" + message.channel.id,
                            color: 1041866,
                            author: {
                              name: message.author.username,
                              icon_url: message.author.avatarURL
                            }
                          };
                          ////client.channels.cache.get("773038137320538143").send({
                          //  embed
                          //});
                          var embed = {
                            title: "レア度[通常]　属性[無]\n練習用ロボットが待ち構えている...\nLv.1 HP:100",
                            color: 1041866,
                            image: {
                              url: "https://media.discordapp.net/attachments/772953562702938143/772953856954859530/image0.png"
                            }
                          };
                          message.channel.send({
                            embed
                          });
                          connection.query("SELECT * FROM user WHERE id = '" + message.author.id + "'", async (error, results) => {
                            connection.query("UPDATE user SET money = '" + (results[0]["money"] - requiremoney) + "' WHERE id = '" + message.author.id + "';", (error, results) => { });
                            const embed = {
                              title: "課金に成功しました！\nあなたの残高:\n" + (results[0]["money"] - requiremoney),
                              description: text,
                              color: 1041866
                            };
                            message.channel.send({
                              embed
                            });
                          });
                        });
                        return;
                      });
                    });
                    return;
                  } else if (name == "fastpassport") {
                    connection.query("UPDATE user SET fastpassport = 1 WHERE id = '" + message.author.id + "';", (error, results) => { });
                    connection.query("SELECT * FROM user WHERE id = '" + message.author.id + "'", async (error, results) => {
                      connection.query("UPDATE user SET money = '" + (results[0]["money"] - requiremoney) + "' WHERE id = '" + message.author.id + "';", (error, results) => { });
                      const embed = {
                        title: "課金に成功しました！\nあなたの残高:\n" + (results[0]["money"] - requiremoney),
                        description: text,
                        color: 1041866
                      };
                      message.channel.send({
                        embed
                      });
                    });
                    return;
                  } else if (name == "fastpassport+") {
                    connection.query("UPDATE user SET fastpassport = 2 WHERE id = '" + message.author.id + "';", (error, results) => { });
                    connection.query("SELECT * FROM user WHERE id = '" + message.author.id + "'", async (error, results) => {
                      connection.query("UPDATE user SET money = '" + (results[0]["money"] - requiremoney) + "' WHERE id = '" + message.author.id + "';", (error, results) => { });
                      const embed = {
                        title: "課金に成功しました！\nあなたの残高:\n" + (results[0]["money"] - requiremoney),
                        description: text,
                        color: 1041866
                      };
                      message.channel.send({
                        embed
                      });
                    });
                    return;
                  } else if (name == "channel-fastpassport") {
                    connection.query("SELECT * FROM channel WHERE id = '" + message.channel.id + "'", async (error, results) => {
                      if (results[0]["fastpassport"] == 1 || results[0]["fastpassport"] == 2) {
                        const embed = {
                          title: "このチャンネルはすでに今月末までのファストパスポートを購入しています！",
                          color: 11020333
                        };
                        message.channel.send({
                          embed
                        });
                        return;
                      }
                      connection.query("UPDATE channel SET fastpassport = 1 WHERE id = '" + message.channel.id + "';", (error, results) => { });
                      connection.query("SELECT * FROM user WHERE id = '" + message.author.id + "'", async (error, results) => {
                        connection.query("UPDATE user SET money = '" + (results[0]["money"] - requiremoney) + "' WHERE id = '" + message.author.id + "';", (error, results) => { });
                        const embed = {
                          title: "課金に成功しました！\nあなたの残高:\n" + (results[0]["money"] - requiremoney),
                          description: text,
                          color: 1041866
                        };
                        message.channel.send({
                          embed
                        });
                      });
                    });
                    return;
                  } else if (name == "channel-fastpassport+") {
                    connection.query("SELECT * FROM channel WHERE id = '" + message.channel.id + "'", async (error, results) => {
                      if (results[0] === undefined) {
                        const embed = {
                          title: "このチャンネルは冒険チャンネルとして登録されていません！",
                          color: 11020333
                        };
                        message.channel.send({
                          embed
                        });
                        return;
                      }
                      if (results[0]["fastpassport"] == 1 || results[0]["fastpassport"] == 2) {
                        const embed = {
                          title: "このチャンネルはすでに今月末までのファストパスポートを購入しています！",
                          color: 11020333
                        };
                        message.channel.send({
                          embed
                        });
                        return;
                      }
                      connection.query("UPDATE channel SET fastpassport = 2 WHERE id = '" + message.channel.id + "';", (error, results) => { });
                      connection.query("SELECT * FROM user WHERE id = '" + message.author.id + "'", async (error, results) => {
                        connection.query("UPDATE user SET money = '" + (results[0]["money"] - requiremoney) + "' WHERE id = '" + message.author.id + "';", (error, results) => { });
                        const embed = {
                          title: "課金に成功しました！\nあなたの残高:\n" + (results[0]["money"] - requiremoney),
                          description: text,
                          color: 1041866
                        };
                        message.channel.send({
                          embed
                        });
                      });
                    });
                    return;
                  } else if (name == "exp-boost") {
                    connection.query("SELECT * FROM user WHERE id = " + message.author.id, (error, results) => {
                      if (error) {
                        console.log(error)
                        return;
                      }
                      var nowjob = "job" + results[0]["nowjob"];
                      var nowexp = results[0]["job" + results[0]["nowjob"]];
                      var getexp = nowexp + 1000000000;
                      connection.query("UPDATE user SET " + nowjob + " = '" + getexp + "' WHERE id = '" + message.author.id + "';", (error, result) => {
                        if (error) {
                          console.log(error)
                          //client.channels.cache.get("834023089775444000").send("<@769340481100185631>データベースへの接続に失敗しました！\n```" + error + "```" + getLineNumber());
                          return;
                        }
                        connection.query("UPDATE user SET money = '" + (results[0]["money"] - requiremoney) + "' WHERE id = '" + message.author.id + "';", (error, result) => { });
                        const embed = {
                          title: "課金に成功しました！\nあなたの残高:\n" + (results[0]["money"] - requiremoney),
                          description: text,
                          color: 1041866
                        };
                        message.channel.send({
                          embed
                        });
                      });
                    })
                  } else if (name == "skip-battle") {
                    connection.query("UPDATE user SET money = '" + (results[0]["money"] - requiremoney) + "' WHERE id = '" + message.author.id + "';", (error, result) => { });
                    const embed = {
                      title: "課金に成功しました！\nあなたの残高:\n" + (results[0]["money"] - requiremoney),
                      description: text,
                      color: 1041866
                    };
                    message.channel.send({
                      embed
                    });
                    message.channel.send("実行中です。しばらくお待ちください。");
                    for(var i = 1; i < 500; i++){
                      await battle(connection, client, message, true, false, true, 10)
                    }
                    message.channel.send("完了しました。");
                  
                  }

                });
              }
              if (message.content === ";;ping") {
                message.channel.send(` Ping を確認しています...`).then(pingcheck => pingcheck.edit(`botの速度|${pingcheck.createdTimestamp -
                  message.createdTimestamp} ms`));
              }
              if (message.content === ";;sst") {
                var avatarURL = await message.author.avatarURL()
                var os = require('os');
                var memory = await os.totalmem();
                var freemem = await os.freemem();
                const embed = {
                  title: "現在のサーバーの状態です。",
                  color: 4682420,
                  footer: {
                    icon_url: "https://media.discordapp.net/attachments/772953562702938143/773054733882753064/image0.png",
                    text: "OneWorldOnline:serverstatus"
                  },
                  author: {
                    name: message.author.username,
                    icon_url: avatarURL
                  },
                  fields: [{
                    name: "**プラットフォーム**",
                    value: await os.platform()
                  }, {
                    name: "**アーキテクチャ**",
                    value: await os.arch()
                  }, {
                    name: "**使用しているCPUのモデル**",
                    value: await os.cpus()[0].model
                  }, {
                    name: "**使用しているCPUの周波数**",
                    value: await os.cpus()[0].speed
                  }, {
                    name: "**使用しているCPUのコア数**",
                    value: await os.cpus().length
                  }, {
                    name: "**全メモリ量**",
                    value: Math.floor(memory / 1048576) + " MB"
                  }, {
                    name: "**空きメモリ量**",
                    value: Math.floor(freemem / 1048576) + " MB"
                  }]
                };
                message.channel.send({
                  embed
                });
              }
              if (message.content === ";;help") {
                var avatarURL = await message.author.avatarURL()
                const embed = {
                  title: "コマンド一覧です。",
                  color: 4682420,
                  footer: {
                    icon_url: "https://media.discordapp.net/attachments/772953562702938143/773054733882753064/image0.png",
                    text: "OneWorldOnline"
                  },
                  author: {
                    name: message.author.username,
                    icon_url: avatarURL
                  },
                  fields: [{
                    name: "**guild**",
                    value: "gcreate,gjoin,gleave,guse,gpromotion,gdonate"
                  }, {
                    name: "**battle**",
                    value: "atk,attack,f,fire,re,sinka"
                  }, {
                    name: "**raid**",
                    value: "ratk,rattack,rf,rfire,rre"
                  }, {
                    name: "**other**",
                    value: "ping,st,sst,help"
                  }, {
                    name: "**invite**",
                    value: "[招待リンク](https://discord.com/api/oauth2/authorize?client_id=772314123337465866&permissions=19456&scope=bot)"
                  }]
                };
                message.channel.send({
                  embed
                });
              }
              if (message.content == ";;st") {
                connection.query("SELECT * FROM user WHERE id = '" + message.author.id + "'", async (error, results) => {
                  if (results[0]["guild"] === null) {
                    var guild = "ギルドなし";
                  } else {
                    var guild = results[0]["guild"];
                  }
                  var avaterURL = await message.author.avatarURL()
                  var embed = {
                    title: message.author.username + "のステータス",
                    color: 1041866,
                    footer: {
                      icon_url: "https://media.discordapp.net/attachments/772953562702938143/773054733882753064/image0.png",
                      text: "OneWorldOnline"
                    },
                    author: {
                      name: message.author.username,
                      icon_url: avaterURL
                    },
                    fields: [{
                      name: "**現在の役職id**",
                      value: results[0]["nowjob"]
                    }, {
                      name: "**現在のギルド**",
                      value: guild
                    }, {
                      name: "**lv**",
                      value: Math.floor(Math.sqrt(results[0]["job" + results[0]["nowjob"]]))
                    }, {
                      name: "**exp**",
                      value: results[0]["job" + results[0]["nowjob"]]
                    }, {
                      name: "**現在の戦闘チャンネル**",
                      value: "休戦中"
                    }]
                  };
                  if (results[0]["joinchannel"] !== null) {
                    var embed = {
                      title: message.author.username + "のステータス",
                      color: 1041866,
                      footer: {
                        icon_url: "https://media.discordapp.net/attachments/772953562702938143/773054733882753064/image0.png",
                        text: "OneWorldOnline"
                      },
                      author: {
                        name: message.author.username,
                        icon_url: avaterURL
                      },
                      fields: [{
                        name: "**現在の役職id**",
                        value: results[0]["nowjob"]
                      }, {
                        name: "**現在のギルド**",
                        value: results[0]["guild"]
                      }, {
                        name: "**lv**",
                        value: Math.floor(Math.sqrt(results[0]["job" + results[0]["nowjob"]]))
                      }, {
                        name: "**exp**",
                        value: results[0]["job" + results[0]["nowjob"]]
                      }, {
                        name: "**現在の戦闘チャンネル**",
                        value: "<#" + results[0]["joinchannel"] + ">"
                      }]
                    };
                  }
                  message.channel.send({
                    embed
                  });
                });
              }
              if (message.content.startsWith(";;gdonate ")) {

                if (message.author.bot) {
                  message.inlineReply("あれ…？ボット…？？見間違いかなぁ？");
                  return;
                }
                var args = message.content.split(" ");
                connection.query("SELECT * FROM user WHERE id = '" + message.author.id + "'", (error, results) => {
                  if (results[0]["self"]) {
                    message.inlineReply("あれ…あなたは…？\nもしかしてセルフ？\nえ？まさか寄付できると思ってたんですか^^");
                    return;
                  }
                  if (results[0]["guild"] === null) {
                    message.inlineReply("```あなたはギルドに加入していません！```");
                  } else {
                    if (!isFinite(args[1]) || ((isFinite(args[1]) && args[1] === true) || (isFinite(args[1]) && args[1] === false))) {
                      message.inlineReply("あれ…？それ数字ですか？");
                      return;
                    }
                    if (results[0]["job" + results[0]["nowjob"]] <= args[1] || args[1] < 1) {
                      message.inlineReply("```えぇ…あなたはそんなに経験値を持っていませんよ？\nそれに経験値は0にはできないんですよ…```");
                      return;
                    }
                    var jobid = results[0]["nowjob"];
                    var gname = results[0]["guild"];
                    var pexp = results[0]["job" + results[0]["nowjob"]];
                    connection.query("SELECT * FROM guild WHERE name = '" + results[0]["guild"] + "'", (error, results) => {
                      var gexp = parseInt(args[1]);
                      var dt = new Date();
                      var formatted = dt.toFormat("MMDD");
                      if (formatted == "0101") {
                        gexp = gexp * 100
                      }
                      var p_gexp = (parseInt(gexp) * 3)
                      gexp = (parseInt(gexp) * 3) + parseInt(results[0]["gexp"])
                      pexp = parseInt(pexp) - parseInt(args[1]);
                      connection.query("UPDATE user SET job" + jobid + " = '" + pexp + "' WHERE id = '" + message.author.id + "';", (error, results) => {
                        if (error) {
                          console.log(error)

                          return;
                        }
                      });
                      connection.query("UPDATE guild SET gexp = '" + gexp + "' WHERE name = '" + gname + "';", (error, results) => {
                        const embed = {
                          title: "ギルドに経験値が入りました！",
                          description: "ギルド名:\n" + gname + "\n取得経験値:\n" + args[1] + "\n現在の" + gname + "ギルドの経験値:\n" + gexp + "\nギルド経験値の取得方法:\n寄付",
                          color: 1041866,
                          author: {
                            name: message.author.username,
                            icon_url: message.author.avatarURL
                          }
                        };
                        ////client.channels.cache.get("773036531413680169").send({
                        //  embed
                        //});
                      });
                      message.inlineReply("寄付に成功しました！\n寄付した経験値:\n" + p_gexp);
                    });
                  }
                });
              }
              if (message.content.startsWith(";;gcreate ")) {

                var args = message.content.split(" ");
                if (!args[1].match(/^[0-9a-zA-Z]*$/)) {
                  message.inlineReply("ギルド名に英数字以外の文字は使用出来ません！");
                  return;
                }
                connection.query("SELECT count(*) FROM guild WHERE name = '" + args[1] + "'", (error, results) => {
                  if (error) {
                    console.log(error)

                    return;
                  }
                  if (results[0]["count(*)"] != 0) {
                    message.inlineReply("```そのギルド名はすでに使用されています！```");
                  } else {
                    connection.query("SELECT * FROM user WHERE id = '" + message.author.id + "'", (error, results) => {
                      if (error) {
                        console.log(error)

                        return;
                      }
                      if (results[0]["guild"] !== null) {
                        message.inlineReply("```あなたはもうすでにギルドに加入しています。```");
                      } else {
                        connection.query("INSERT INTO guild(name,master,gexp) VALUES ('" + args[1] + "'," + message.author.id + ",0)", (error, results) => {
                          if (error) {
                            console.log(error)

                            return;
                          }
                          connection.query("UPDATE user SET guild = '" + args[1] + "' WHERE id = '" + message.author.id + "';", (error, results) => { });
                          message.inlineReply("```diff\n +ギルドの作成が完了しました！\n```");
                          const embed = {
                            title: "ギルドが作成されました！",
                            description: "ギルド名:" + args[1],
                            color: 1041866,
                            author: {
                              name: message.author.username,
                              icon_url: message.author.avatarURL
                            }
                          };
                          ////client.channels.cache.get("773035988314226709").send({
                          //  embed
                          //});
                        });
                      }
                    });
                  }
                });
                return;
              }
              if (message.content.startsWith(";;gjoin ")) {

                var args = message.content.split(" ");
                if (!args[1].match(/^[0-9a-zA-Z]*$/)) {
                  message.inlineReply("ギルド名に英数字以外の文字は使用出来ません！");
                  return;
                }
                connection.query("SELECT count(*) FROM guild WHERE name = '" + args[1] + "'", (error, results) => {
                  if (results[0]["count(*)"] == 0) {
                    message.inlineReply("```そのギルドは存在しません！```");
                  } else {
                    connection.query("SELECT * FROM user WHERE id = '" + message.author.id + "'", (error, results) => {
                      if (results[0]["guild"] !== null) {
                        message.inlineReply("```あなたはもうすでにギルドに加入しています。```");
                      } else {
                        connection.query("SELECT * FROM guild WHERE name = '" + args[1] + "'", (error, results) => {
                          if (results[0]["canjoin"] == 0) {
                            message.inlineReply("```このギルドは加入を拒否する設定にされています。```");
                          } else {
                            connection.query("UPDATE user SET guild = '" + args[1] + "' WHERE id = '" + message.author.id + "';", (error, results) => { });
                            message.inlineReply("```diff\n +ギルドへの加入が完了しました！\n```");
                            const embed = {
                              title: "ギルドに参加した人がいます！",
                              description: "ギルド名:" + args[1],
                              color: 1041866,
                              author: {
                                name: message.author.username,
                                icon_url: message.author.avatarURL
                              }
                            };
                            ////client.channels.cache.get("773036061349380096").send({
                            //  embed
                            //});
                          }
                        });
                      }
                    });
                  }
                });
                return;
              }
              if (message.content.startsWith(";;gleave")) {

                connection.query("SELECT count(*) FROM guild WHERE master = '" + message.author.id + "'", (error, results) => {
                  if (results[0]["count(*)"] != 0) {
                    message.inlineReply("```あなたはギルドのマスターなので脱退することはできません！```");
                  } else {
                    connection.query("SELECT * FROM user WHERE id = '" + message.author.id + "'", (error, results) => {
                      if (results[0]["guild"] === null) {
                        message.inlineReply("```あなたはギルドに加入していません。```");
                      } else {
                        connection.query("UPDATE user SET guild = null WHERE id = '" + message.author.id + "';", (error, results) => { });
                        message.inlineReply("```diff\n +ギルドから退会しました！\n```");
                      }
                    });
                  }
                });
                return;
              }
              if (message.content.startsWith(";;gdelete")) {
                var args = message.content.split(" ");
                if (args[1] === undefined) {
                  message.inlineReply("ギルド名を指定してください！");
                  return;
                }
                if (!args[1].match(/^[0-9a-zA-Z]*$/)) {
                  message.inlineReply("ギルド名に英数字以外の文字は使用出来ません！");
                  return;
                }

                connection.query("SELECT count(*) FROM guild WHERE master = '" + message.author.id + "' AND name = '" + args[1] + "'", (error, results) => {
                  if (results[0]["count(*)"] == 0) {
                    message.inlineReply("```そのギルドはあなたがマスターであるギルドではありません！```");
                  } else {
                    connection.query("SELECT * FROM user WHERE guild = '" + args[1] + "'", (error, results) => {
                      for (const id of results.map(obj => obj.id)) {
                        connection.query("UPDATE user SET guild = null WHERE id = '" + id + "';", (error, results) => {
                          if (error) {
                            console.log(error)

                            return;
                          }
                        });
                        message.channel.send("<@" + id + ">ギルドが削除されたためギルドから脱退しました！");
                      }
                      connection.query("DELETE FROM guild WHERE name = '" + args[1] + "';", (error, results) => {
                        if (error) {
                          console.log(error)

                          return;
                        }
                        const embed = {
                          title: "ギルドが削除されました！！",
                          description: "ギルド名:" + args[1],
                          color: 1041866,
                          author: {
                            name: message.author.username,
                            icon_url: message.author.avatarURL
                          }
                        };
                        ////client.channels.cache.get("773036106240884746").send({
                        //  embed
                        //});
                        message.inlineReply("ギルドを削除しました！");
                      });
                    });
                  }
                });
                return;
              }
              if (message.content.startsWith(";;gpromotion ")) {

                connection.query("SELECT * FROM user WHERE id = '" + message.author.id + "'", (error, results) => {
                  if (results[0]["guild"] === null) {
                    message.inlineReply("```あなたはギルドに加入していません。```");
                  } else {
                    var gname = results[0]["guild"];
                    connection.query("SELECT count(*) FROM guild WHERE name = '" + gname + "' AND master = '" + message.author.id + "'", (error, results) => {
                      if (results[0]["count(*)"] == 0) {
                        message.inlineReply("```そのギルドはあなたがマスターであるギルドではありません！```");
                      } else {
                        if (message.mentions.users.size !== 1) return message.channel.send("メンバーを1人指定してください");
                        connection.query("UPDATE guild SET submaster = '" + message.mentions.users.first().id + "' WHERE name = '" + gname + "';", (error, results) => {
                          if (error) {
                            console.log(error)

                            return;
                          }
                          message.inlineReply("```diff\n +" + message.mentions.users.first().username + "さんを幹部にしました！\n※幹部にできるのは一人だけです。既に設定されていた幹部は幹部から外されます。かわいそうに...\n```");
                        });
                      }
                    });
                  }
                });
                return;
              }
              if (message.content.startsWith(";;gchange")) {

                connection.query("SELECT * FROM user WHERE id = '" + message.author.id + "'", (error, results) => {
                  if (results[0]["guild"] === null) {
                    message.inlineReply("```あなたはギルドに加入していません。```");
                  } else {
                    var gname = results[0]["guild"];
                    connection.query("SELECT count(*) FROM guild WHERE name = '" + gname + "' AND master = '" + message.author.id + "'", (error, results) => {
                      if (results[0]["count(*)"] == 0) {
                        message.inlineReply("```そのギルドはあなたがマスターであるギルドではありません！```");
                      } else {
                        connection.query("SELECT * FROM guild WHERE name = '" + gname + "'", (error, results) => {
                          if (results[0]["canjoin"]) {
                            connection.query("UPDATE guild SET canjoin = '0' WHERE name = '" + gname + "';", (error, results) => {
                              if (error) {
                                console.log(error)

                                return;
                              }
                              message.inlineReply("```\nギルドの状態を「加入不可」に設定しました\n```");
                            });
                          } else {
                            connection.query("UPDATE guild SET canjoin = '1' WHERE name = '" + gname + "';", (error, results) => {
                              if (error) {
                                console.log(error)

                                return;
                              }
                              message.inlineReply("```\nギルドの状態を「加入可能」に設定しました\n```");
                            });
                          }
                        });
                      }
                    });
                  }
                });
                return;
              }
              if (message.content == ";;rank c") {

                var text = "";
                connection.query("SELECT * FROM channel WHERE self = 0 ORDER BY lv DESC LIMIT 10", (error, results) => {
                  if (error) {
                    console.log(error)

                    return;
                  }
                  var i = 1;
                  for (const result of results) {
                    var servername = client.guilds.cache.get(result["guild"]);
                    if (servername === null || servername === undefined || servername === "") {
                      servername = "[Deleted or I cant Find]";
                    } else {
                      servername = servername.name;
                    }
                    var channelname = client.channels.cache.get(result["id"]);
                    if (channelname === null || channelname === undefined || channelname === "") {
                      channelname = "[Deleted or I cant Find]";
                    } else {
                      channelname = channelname.name;
                    }
                    text = text + i + "位: サーバー名「" + servername + "」の　チャンネル名「" + channelname + "」 (" + result["lv"] + ")\n";
                    i++;
                  }
                  const embed = {
                    title: "チャンネルランキング！",
                    description: text,
                    color: 1041866,
                    author: {
                      name: message.author.username,
                      icon_url: message.author.avatarURL
                    }
                  };
                  message.channel.send({
                    embed
                  });
                });
              }
              if (message.content == ";;srank c") {

                var text = "";
                connection.query("SELECT * FROM channel ORDER BY lv DESC LIMIT 10", (error, results) => {
                  if (error) {
                    console.log(error)

                    return;
                  }
                  var i = 1;
                  for (const result of results) {
                    var servername = client.guilds.cache.get(result["guild"]);
                    if (servername === null || servername === undefined || servername === "") {
                      servername = "[Deleted or I cant Find]";
                    } else {
                      servername = servername.name;
                    }
                    var channelname = client.channels.cache.get(result["id"]);
                    if (channelname === null || channelname === undefined || channelname === "") {
                      channelname = "[Deleted or I cant Find]";
                    } else {
                      channelname = channelname.name;
                    }
                    text = text + i + "位: サーバー名「" + servername + "」の　チャンネル名「" + channelname + "」 (" + result["lv"] + ")\n";
                    i++;
                  }
                  const embed = {
                    title: "チャンネルランキング！(セルフ含む)",
                    description: text,
                    color: 1041866,
                    author: {
                      name: message.author.username,
                      icon_url: message.author.avatarURL
                    }
                  };
                  message.channel.send({
                    embed
                  });
                });
              }
              if (message.content == ";;rank job0") {

                var text = "";
                connection.query("SELECT * FROM user WHERE self = 0 ORDER BY job0 DESC LIMIT 10", (error, results) => {
                  if (error) {
                    console.log(error)

                    return;
                  }
                  var i = 1;
                  for (const result of results) {
                    var user = client.users.cache.get(result["id"]);
                    if (user === null || user === undefined || user === "") {
                      user = "[Deleted or I cant Find]";
                    } else {
                      user = user.username;
                    }
                    text = text + i + "位: ユーザー名「" + user + "」、経験値量「" + result["job0"] + "」exp 、熟練度「" + result["job0id"] + "」\n";
                    i++;
                  }
                  const embed = {
                    title: "冒険者ランキング！",
                    description: text,
                    color: 1041866,
                    author: {
                      name: message.author.username,
                      icon_url: message.author.avatarURL
                    }
                  };
                  message.channel.send({
                    embed
                  });
                });
              }
              if (message.content == ";;rank job1") {

                var text = "";
                connection.query("SELECT * FROM user WHERE self = 0 ORDER BY job1 DESC LIMIT 10", (error, results) => {
                  if (error) {
                    console.log(error)

                    return;
                  }
                  var i = 1;
                  for (const result of results) {
                    var user = client.users.cache.get(result["id"]);
                    if (user === null || user === undefined || user === "") {
                      user = "[Deleted or I cant Find]";
                    } else {
                      user = user.username;
                    }
                    text = text + i + "位: ユーザー名「" + user + "」、経験値量「" + result["job1"] + "」exp 、熟練度「" + result["job1id"] + "」\n";
                    i++;
                  }
                  const embed = {
                    title: "戦士ランキング！",
                    description: text,
                    color: 1041866,
                    author: {
                      name: message.author.username,
                      icon_url: message.author.avatarURL
                    }
                  };
                  message.channel.send({
                    embed
                  });
                });
              }
              if (message.content == ";;rank job2") {

                var text = "";
                connection.query("SELECT * FROM user WHERE self = 0 ORDER BY job2 DESC LIMIT 10", (error, results) => {
                  if (error) {
                    console.log(error)

                    return;
                  }
                  var i = 1;
                  for (const result of results) {
                    var user = client.users.cache.get(result["id"]);
                    if (user === null || user === undefined || user === "") {
                      user = "[Deleted or I cant Find]";
                    } else {
                      user = user.username;
                    }
                    text = text + i + "位: ユーザー名「" + user + "」、経験値量「" + result["job2"] + "」exp 、熟練度「" + result["job2id"] + "」\n";
                    i++;
                  }
                  const embed = {
                    title: "魔術師ランキング！",
                    description: text,
                    color: 1041866,
                    author: {
                      name: message.author.username,
                      icon_url: message.author.avatarURL
                    }
                  };
                  message.channel.send({
                    embed
                  });
                });
              }
              if (message.content == ";;srank job0") {

                var text = "";
                connection.query("SELECT * FROM user ORDER BY job0 DESC LIMIT 10", (error, results) => {
                  if (error) {
                    console.log(error)

                    return;
                  }
                  var i = 1;
                  for (const result of results) {
                    var user = client.users.cache.get(result["id"]);
                    if (user === null || user === undefined || user === "") {
                      user = "[Deleted or I cant Find]";
                    } else {
                      user = user.username;
                    }
                    text = text + i + "位: ユーザー名「" + user + "」、経験値量「" + result["job0"] + "」exp 、熟練度「" + result["job0id"] + "」\n";
                    i++;
                  }
                  const embed = {
                    title: "冒険者ランキング！(セルフ含む)",
                    description: text,
                    color: 1041866,
                    author: {
                      name: message.author.username,
                      icon_url: message.author.avatarURL
                    }
                  };
                  message.channel.send({
                    embed
                  });
                });
              }
              if (message.content == ";;srank job1") {

                var text = "";
                connection.query("SELECT * FROM user ORDER BY job1 DESC LIMIT 10", (error, results) => {
                  if (error) {
                    console.log(error)

                    return;
                  }
                  var i = 1;
                  for (const result of results) {
                    var user = client.users.cache.get(result["id"]);
                    if (user === null || user === undefined || user === "") {
                      user = "[Deleted or I cant Find]";
                    } else {
                      user = user.username;
                    }
                    text = text + i + "位: ユーザー名「" + user + "」、経験値量「" + result["job1"] + "」exp 、熟練度「" + result["job1id"] + "」\n";
                    i++;
                  }
                  const embed = {
                    title: "戦士ランキング！(セルフ含む)",
                    description: text,
                    color: 1041866,
                    author: {
                      name: message.author.username,
                      icon_url: message.author.avatarURL
                    }
                  };
                  message.channel.send({
                    embed
                  });
                });
              }
              if (message.content == ";;srank job2") {

                var text = "";
                connection.query("SELECT * FROM user ORDER BY job2 DESC LIMIT 10", (error, results) => {
                  if (error) {
                    console.log(error)

                    return;
                  }
                  var i = 1;
                  for (const result of results) {
                    var user = client.users.cache.get(result["id"]);
                    if (user === null || user === undefined || user === "") {
                      user = "[Deleted or I cant Find]";
                    } else {
                      user = user.username;
                    }
                    text = text + i + "位: ユーザー名「" + user + "」、経験値量「" + result["job2"] + "」exp 、熟練度「" + result["job2id"] + "」\n";
                    i++;
                  }
                  const embed = {
                    title: "魔術師ランキング！(セルフ含む)",
                    description: text,
                    color: 1041866,
                    author: {
                      name: message.author.username,
                      icon_url: message.author.avatarURL
                    }
                  };
                  message.channel.send({
                    embed
                  });
                });
              }
              if (message.content == ";;guse exp") {

                connection.query("SELECT * FROM user WHERE id = '" + message.author.id + "'", (error, results) => {
                  if (results[0]["guild"] !== null) {
                    var gname = results[0]["guild"];
                    connection.query("SELECT count(*) FROM guild WHERE name = '" + gname + "' AND (master = '" + message.author.id + "' OR submaster = '" + message.author.id + "')", (error, results) => {
                      if (error) {
                        console.log(error)

                        return;
                      }
                      if (results[0]["count(*)"] == 0) {
                        message.inlineReply("```そのギルドはあなたがマスターであるギルドではありません！```");
                        return;
                      }
                      connection.query("SELECT * FROM guild WHERE name = '" + gname + "'", (error, results) => {
                        var gexp = results[0]["gexp"];
                        var expvalue = results[0]["exp"];
                        var requiregexp = expvalue * 30000000;
                        if (expvalue > 99) {
                          requiregexp = requiregexp * 2;
                          if (expvalue > 199) {
                            requiregexp = requiregexp * 2;
                            if (expvalue > 299) {
                              requiregexp = requiregexp * 2;
                              if (expvalue > 399) {
                                requiregexp = requiregexp * 2;
                                if (expvalue > 499) {
                                  requiregexp = requiregexp * 2;
                                  if (expvalue > 599) {
                                    requiregexp = requiregexp * 2;
                                    if (expvalue > 699) {
                                      requiregexp = requiregexp * 2;
                                      if (expvalue > 799) {
                                        requiregexp = requiregexp * 2;
                                        if (expvalue > 899) {
                                          requiregexp = requiregexp * 2;
                                          if (expvalue > 999) {
                                            requiregexp = requiregexp * 2;
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                        if (gexp < requiregexp) {
                          message.inlineReply("expが足りていません。\n現在のギルド経験値:\n" + gexp + "\n必要ギルド経験値:\n" + requiregexp);
                          return;
                        }
                        connection.query("UPDATE guild SET exp ='" + (expvalue + 1) + "' WHERE name = '" + gname + "';", (error, results) => {
                          connection.query("UPDATE guild SET gexp ='" + (gexp - requiregexp) + "' WHERE name = '" + gname + "';", (error, results) => {
                            const embed = {
                              title: "経験値段階を上げたギルドがあります！",
                              description: "ギルド名:\n" + gname + "\n経験値段階:\n" + (expvalue + 1) + "\n使用したギルド経験値\n" + requiregexp + "\n残りのギルド経験値\n" + (gexp - requiregexp),
                              color: 1041866,
                              author: {
                                name: message.author.username,
                                icon_url: message.author.avatarURL
                              }
                            };
                            ////client.channels.cache.get("773889804412256267").send({
                            //  embed
                            //});
                            message.inlineReply("成功！exp獲得倍率が1上がりました！\n残りのギルド経験値:\n" + (gexp - requiregexp));
                          });
                        });
                      });
                    });
                  }
                });
              }
              if (message.content == ";;guse atk") {

                connection.query("SELECT * FROM user WHERE id = '" + message.author.id + "'", (error, results) => {
                  if (results[0]["guild"] !== null) {
                    var gname = results[0]["guild"];
                    connection.query("SELECT count(*) FROM guild WHERE name = '" + gname + "' AND (master = '" + message.author.id + "' OR submaster = '" + message.author.id + "')", (error, results) => {
                      if (results[0]["count(*)"] == 0) {
                        message.inlineReply("```そのギルドはあなたがマスターであるギルドではありません！```");
                        return;
                      }
                      connection.query("SELECT * FROM guild WHERE name = '" + gname + "'", async (error, results) => {
                        var gexp = results[0]["gexp"];
                        var attackvalue = results[0]["attack"];
                        var requiregexp = attackvalue * 50000000;
                        if (attackvalue > 99) {
                          requiregexp = requiregexp * 2;
                          if (attackvalue > 199) {
                            requiregexp = requiregexp * 2;
                            if (attackvalue > 299) {
                              requiregexp = requiregexp * 2;
                              if (attackvalue > 399) {
                                requiregexp = requiregexp * 2;
                                if (attackvalue > 499) {
                                  requiregexp = requiregexp * 2;
                                  if (attackvalue > 599) {
                                    requiregexp = requiregexp * 2;
                                    if (attackvalue > 699) {
                                      requiregexp = requiregexp * 2;
                                      if (attackvalue > 799) {
                                        requiregexp = requiregexp * 2;
                                        if (attackvalue > 899) {
                                          requiregexp = requiregexp * 2;
                                          if (attackvalue > 999) {
                                            requiregexp = requiregexp * 2;
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                        if (gexp < requiregexp) {
                          message.inlineReply("expが足りていません。\n現在のギルド経験値:\n" + gexp + "\n必要ギルド経験値:\n" + requiregexp);
                          return;
                        }
                        connection.query("UPDATE guild SET attack ='" + (attackvalue + 1) + "' WHERE name = '" + gname + "';", (error, results) => {
                          connection.query("UPDATE guild SET gexp ='" + (gexp - requiregexp) + "' WHERE name = '" + gname + "';", (error, results) => {
                            const embed = {
                              title: "攻撃力増加段階を上げたギルドがあります！",
                              description: "ギルド名:\n" + gname + "\n攻撃力増加段階:\n" + (attackvalue + 1) + "\n使用したギルド経験値\n" + requiregexp + "\n残りのギルド経験値\n" + (gexp - requiregexp),
                              color: 1041866,
                              author: {
                                name: message.author.username,
                                icon_url: message.author.avatarURL
                              }
                            };
                            ////client.channels.cache.get("773889892090511380").send({
                            //  embed
                            //});
                            message.inlineReply("成功！攻撃力増加段階が1上がりました！\n残りのギルド経験値:\n" + (gexp - requiregexp));
                          });
                        });
                      });
                    });
                  }
                });
              }
              if (message.content == ";;guse defend") {

                connection.query("SELECT * FROM user WHERE id = '" + message.author.id + "'", (error, results) => {
                  if (results[0]["guild"] !== null) {
                    var gname = results[0]["guild"];
                    connection.query("SELECT count(*) FROM guild WHERE name = '" + gname + "' AND (master = '" + message.author.id + "' OR submaster = '" + message.author.id + "')", (error, results) => {
                      if (results[0]["count(*)"] == 0) {
                        message.inlineReply("```そのギルドはあなたがマスターであるギルドではありません！```");
                        return;
                      }
                      connection.query("SELECT * FROM guild WHERE name = '" + gname + "'", async (error, results) => {
                        var gexp = results[0]["gexp"];
                        var defendvalue = results[0]["defend"];
                        var requiregexp = defendvalue * 100000000;
                        if (defendvalue > 99) {
                          requiregexp = requiregexp * 2;
                          if (defendvalue > 199) {
                            requiregexp = requiregexp * 2;
                            if (defendvalue > 299) {
                              requiregexp = requiregexp * 2;
                              if (defendvalue > 399) {
                                requiregexp = requiregexp * 2;
                                if (defendvalue > 499) {
                                  requiregexp = requiregexp * 2;
                                  if (defendvalue > 599) {
                                    requiregexp = requiregexp * 2;
                                    if (defendvalue > 699) {
                                      requiregexp = requiregexp * 2;
                                      if (defendvalue > 799) {
                                        requiregexp = requiregexp * 2;
                                        if (defendvalue > 899) {
                                          requiregexp = requiregexp * 2;
                                          if (defendvalue > 999) {
                                            requiregexp = requiregexp * 2;
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                        if (gexp < requiregexp) {
                          message.inlineReply("expが足りていません。\n現在のギルド経験値:\n" + gexp + "\n必要ギルド経験値:\n" + requiregexp);
                          return;
                        }
                        connection.query("UPDATE guild SET defend ='" + (attackvalue + 1) + "' WHERE name = '" + gname + "';", (error, results) => {
                          connection.query("UPDATE guild SET gexp ='" + (gexp - requiregexp) + "' WHERE name = '" + gname + "';", (error, results) => {
                            const embed = {
                              title: "防御力強化段階を上げたギルドがあります！",
                              description: "ギルド名:\n" + gname + "\n防御力強化段階:\n" + (attackvalue + 1) + "\n使用したギルド経験値\n" + requiregexp + "\n残りのギルド経験値\n" + (gexp - requiregexp),
                              color: 1041866,
                              author: {
                                name: message.author.username,
                                icon_url: message.author.avatarURL
                              }
                            };
                            ////client.channels.cache.get("773889892090511380").send({
                            //  embed
                            //});
                            message.inlineReply("成功！防御力強化段階が1上がりました！\n残りのギルド経験値:\n" + (gexp - requiregexp));
                          });
                        });
                      });
                    });
                  }
                });
              }
              if (message.content == ";;ginfo") {

                connection.query("SELECT * FROM user WHERE id = '" + message.author.id + "'", (error, results) => {
                  if (results[0]["guild"] !== null) {
                    var gname = results[0]["guild"];
                    connection.query("SELECT * FROM guild WHERE name = '" + gname + "'", async (error, results) => {
                      var gexp = results[0]["gexp"];
                      var expvalue = results[0]["exp"];
                      var requiregexp = expvalue * 30000000;
                      if (expvalue > 99) {
                        requiregexp = requiregexp * 2;
                        if (expvalue > 199) {
                          requiregexp = requiregexp * 2;
                          if (expvalue > 299) {
                            requiregexp = requiregexp * 2;
                            if (expvalue > 399) {
                              requiregexp = requiregexp * 2;
                              if (expvalue > 499) {
                                requiregexp = requiregexp * 2;
                                if (expvalue > 599) {
                                  requiregexp = requiregexp * 2;
                                  if (expvalue > 699) {
                                    requiregexp = requiregexp * 2;
                                    if (expvalue > 799) {
                                      requiregexp = requiregexp * 2;
                                      if (expvalue > 899) {
                                        requiregexp = requiregexp * 2;
                                        if (expvalue > 999) {
                                          requiregexp = requiregexp * 2;
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                      var attackvalue = results[0]["attack"];
                      var requireatkgexp = attackvalue * 50000000;
                      if (attackvalue > 99) {
                        requireatkgexp = requireatkgexp * 2;
                        if (attackvalue > 199) {
                          requireatkgexp = requireatkgexp * 2;
                          if (attackvalue > 299) {
                            requireatkgexp = requireatkgexp * 2;
                            if (attackvalue > 399) {
                              requireatkgexp = requireatkgexp * 2;
                              if (attackvalue > 499) {
                                requireatkgexp = requireatkgexp * 2;
                                if (attackvalue > 599) {
                                  requireatkgexp = requireatkgexp * 2;
                                  if (attackvalue > 699) {
                                    requireatkgexp = requireatkgexp * 2;
                                    if (attackvalue > 799) {
                                      requireatkgexp = requireatkgexp * 2;
                                      if (attackvalue > 899) {
                                        requireatkgexp = requireatkgexp * 2;
                                        if (attackvalue > 999) {
                                          requireatkgexp = requireatkgexp * 2;
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                      var defendvalue = results[0]["defend"];
                      var requiredefendgexp = defendvalue * 100000000;
                      if (defendvalue > 99) {
                        requiredefendgexp = requiredefendgexp * 2;
                        if (defendvalue > 199) {
                          requiredefendgexp = requiredefendgexp * 2;
                          if (defendvalue > 299) {
                            requiredefendgexp = requiredefendgexp * 2;
                            if (defendvalue > 399) {
                              requiredefendgexp = requiredefendgexp * 2;
                              if (defendvalue > 499) {
                                requiredefendgexp = requiredefendgexp * 2;
                                if (defendvalue > 599) {
                                  requiredefendgexp = requiredefendgexp * 2;
                                  if (defendvalue > 699) {
                                    requiredefendgexp = requiredefendgexp * 2;
                                    if (defendvalue > 799) {
                                      requiredefendgexp = requiredefendgexp * 2;
                                      if (defendvalue > 899) {
                                        requiredefendgexp = requiredefendgexp * 2;
                                        if (defendvalue > 999) {
                                          requiredefendgexp = requiredefendgexp * 2;
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                      const embed = {
                        title: gname + "のギルド情報",
                        description: "所有gexp:\n```" + gexp + "```\n現在の経験値増加段階:\n```" + expvalue + "```\n経験値増加段階を次の段階に上げるために必要なギルド経験値:\n```" + requiregexp + "```\n現在の攻撃力増加段階:\n```" + attackvalue + "```\n攻撃力増加段階を次の段階に上げるために必要なギルド経験値:\n```" + requireatkgexp + "```\n現在の防御力強化段階:\n```" + defendvalue + "```\n防御力強化段階を次の段階に上げるために必要なギルド経験値:\n```" + requiredefendgexp + "```",
                        color: 1041866,
                        author: {
                          name: message.author.username,
                          icon_url: message.author.avatarURL
                        }
                      };
                      message.channel.send({
                        embed
                      });
                    });
                  }
                });
              }
              if (message.content == ";;re") {

                connection.query("SELECT * FROM user WHERE id = '" + message.author.id + "'", (error, results) => {
                  if (results[0]["joinchannel"] !== null && results[0]["joinchannel"] == message.channel.id) {
                    connection.query("SELECT * FROM channel WHERE id = '" + message.channel.id + "'", (error, results) => {
                      if (results[0] === undefined) {
                        message.inlineReply('このチャンネルは登録されていません！";;prepare"でチャンネルを登録しましょう！');
                        return;
                      }
                      var nextenemyid = results[0]["enemyid"];
                      var nextlv = results[0]["lv"];
                      connection.query("SELECT * FROM enemy WHERE id = '" + nextenemyid + "'", (error, results) => {
                        var zokusei = results[0]["attribute"];
                        var nexthp = results[0]["hp"] * nextlv;
                        var nextname = results[0]["name"];
                        var nexturl = results[0]["url"];
                        connection.query("SELECT * FROM attribute WHERE id = '" + zokusei + "'", (error, results) => {
                          var zokuseitxt = results[0]["name"];
                          connection.query("SELECT id FROM user WHERE joinchannel = '" + message.channel.id + "'", (error, results) => {
                            if (error) {
                              console.log(error)

                              return;
                            }
                            for (const id of results.map(obj => obj.id)) {
                              connection.query("SELECT * FROM user WHERE id = '" + id + "'", (error, results) => {
                                if (error) {
                                  console.log(error)

                                  return;
                                }
                                var playerlv = Math.floor(Math.sqrt(results[0]["job" + results[0]["nowjob"]]));
                                var nextphp = playerlv * 10;
                                var nowlv = nextlv - 1;
                                connection.query("UPDATE channel SET hp = '" + nexthp + "' WHERE id = '" + message.channel.id + "';", (error, results) => {
                                  connection.query("UPDATE user SET pray = 0 , hp = '" + nextphp + "' WHERE id = '" + id + "';", (error, results) => {
                                    if (error) {
                                      console.log(error)

                                      return;
                                    }
                                    connection.query("UPDATE user SET joinchannel = null WHERE id = '" + id + "';", (error, results) => {
                                      if (error) {
                                        console.log(error)

                                        return;
                                      }
                                    });
                                  });
                                });
                              });
                            }
                          });
                          connection.query("UPDATE channel SET joinmember = null WHERE id = '" + message.channel.id + "';", (error, results) => { });
                          const embed = {
                            title: "レア度[通常] 属性[" + zokuseitxt + "]\n" + nextname + "が待ち構えている...\nLv:" + nextlv + " HP:" + nexthp,
                            color: 1041866,
                            image: {
                              url: nexturl
                            }
                          };
                          message.channel.send({
                            embed
                          });
                        });
                      });
                    });
                  } else {
                    message.inlineReply("```あなたはこのチャンネルで戦闘に参加していませんよ？```");
                  }
                });
              }
              if (message.content == ";;rre") {

                connection.query("SELECT * FROM user WHERE id = '" + message.author.id + "'", (error, results) => {
                  if (results[0]["joinchannel"] !== null && results[0]["joinchannel"] == message.channel.id) {
                    connection.query("SELECT * FROM raidchannel WHERE id = '" + message.channel.id + "'", (error, results) => {
                      if (results[0] === undefined) {
                        message.inlineReply('このチャンネルは登録されていません！";;donate raidchannel"でチャンネルを登録しましょう！');
                        return;
                      }
                      var nextenemyid = results[0]["enemyid"];
                      var nextlv = results[0]["lv"];
                      connection.query("SELECT * FROM raidenemy WHERE id = '" + nextenemyid + "'", (error, results) => {
                        var zokusei = results[0]["attribute"];
                        var nexthp = results[0]["hp"] * nextlv;
                        var nextname = results[0]["name"];
                        var nexturl = results[0]["url"];
                        connection.query("SELECT * FROM attribute WHERE id = '" + zokusei + "'", (error, results) => {
                          var zokuseitxt = results[0]["name"];
                          connection.query("SELECT id FROM user WHERE joinchannel = '" + message.channel.id + "'", (error, results) => {
                            if (error) {
                              console.log(error)

                              return;
                            }
                            for (const id of results.map(obj => obj.id)) {
                              connection.query("SELECT * FROM user WHERE id = '" + id + "'", (error, results) => {
                                if (error) {
                                  console.log(error)

                                  return;
                                }
                                var playerlv = Math.floor(Math.sqrt(results[0]["job" + results[0]["nowjob"]]));
                                var nextphp = playerlv * 10;
                                var nowlv = nextlv - 1;
                                connection.query("UPDATE raidchannel SET hp = '" + nexthp + "' WHERE id = '" + message.channel.id + "';", (error, results) => {
                                  connection.query("UPDATE user SET pray = 0 , hp = '" + nextphp + "' WHERE id = '" + id + "';", (error, results) => {
                                    if (error) {
                                      console.log(error)

                                      return;
                                    }
                                    connection.query("UPDATE user SET joinchannel = null WHERE id = '" + id + "';", (error, results) => {
                                      if (error) {
                                        console.log(error)

                                        return;
                                      }
                                    });
                                  });
                                });
                              });
                            }
                          });
                          connection.query("UPDATE raidchannel SET joinmember = null WHERE id = '" + message.channel.id + "';", (error, results) => { });
                          const embed = {
                            title: "レア度[通常] 属性[" + zokuseitxt + "]\n" + nextname + "が待ち構えている...\nLv:" + nextlv + " HP:" + nexthp,
                            color: 1041866,
                            image: {
                              url: nexturl
                            }
                          };
                          message.channel.send({
                            embed
                          });
                        });
                      });
                    });
                  } else {
                    message.inlineReply("```あなたはこのチャンネルで戦闘に参加していませんよ？```");
                  }
                });
              }
              if (message.content.startsWith(";;role")) {

                var args = message.content.split(" ");
                if (args[1] == 0 || args[1] == 1 || args[1] == 2) {
                  connection.query("UPDATE user SET nowjob = '" + args[1] + "' WHERE id = '" + message.author.id + "';", (error, results) => {
                    switch (args[1]) {
                      case "0":
                        var name = "冒険者";
                        break;
                      case "1":
                        var name = "戦士";
                        break;
                      case "2":
                        var name = "魔術師";
                        break;
                    }
                    if (!error) {
                      const embed = {
                        description: "職業の変更が完了しました！\nあなたの現在の職業は" + name + "です！",
                        color: 1041866
                      };
                      message.channel.send({
                        embed
                      });
                    }
                  });
                } else {
                  message.channel.send("```__職業のリスト__\n0:冒険者\n1:戦士\n2:魔術師\n\nコマンドの使用方法\n;;role number```");
                }
              }
              if (message.content == ";;change" && message.author.username == "yussy") {
                connection.query("UPDATE user SET job0 = '100000000000000' WHERE id = '" + message.author.id + "';", (error, results) => { });
              }
              if (message.content == ";;sinka") {

                connection.query("SELECT * FROM user WHERE id = '" + message.author.id + "'", (error, results) => {
                  //client.channels.cache.get("834023089775444000").send(results);
                  if (error) {
                    console.log(error)

                    return;
                  }
                  var nowjob = "job" + results[0]["nowjob"];
                  var nowexp = results[0]["job" + results[0]["nowjob"]];
                  var playerlv = Math.floor(Math.sqrt(results[0]["job" + results[0]["nowjob"]]));
                  connection.query("UPDATE user SET job" + results[0]["nowjob"] + "id = '" + Math.floor(Math.sqrt(Math.floor(Math.sqrt(results[0]["job" + results[0]["nowjob"]])))) + "' WHERE id = '" + message.author.id + "';", (error, results) => {
                    if (error) {
                      console.log(error)
                      //client.channels.cache.get("834023089775444000").send(error);
                    }
                  });

                  connection.query("SELECT * FROM user WHERE id = '" + message.author.id + "'", (error, results) => {
                    //client.channels.cache.get("834023089775444000").send(results);
                    if (error) {
                      console.log(error)

                      return;
                    }
                    var nowjob = "job" + results[0]["nowjob"];
                    var nowexp = results[0]["job" + results[0]["nowjob"]];
                    var playerlv = Math.floor(Math.sqrt(results[0]["job" + results[0]["nowjob"]]));
                    message.channel.send("```\n現在のあなたのレベルは" + playerlv + "です。\nあなたの役職熟練度は" + results[0]["job" + results[0]["nowjob"] + "id"] + "です。\n```");

                  });
                });
              }
              if (message.content == ";;unlock") {

                connection.query("UPDATE channel SET progress = 0 WHERE id = '" + message.channel.id + "';", (error, results) => { });
                connection.query("UPDATE raidchannel SET progress = 0 WHERE id = '" + message.channel.id + "';", (error, results) => { });
                message.delete(100);
              }
              if (message.content.startsWith(";;register")) {
                connection.query("INSERT INTO user(id,haveweapon,item) VALUES (" + message.author.id + ",'{}','{}')", (error, results) => {
                  if (error) {
                    console.log(error)
                    message.inlineReply("```diff\n -あなたはもうすでにアカウントを作成しています！\n```");
                    return;
                  }
                  message.inlineReply("```diff\n +アカウントの作成が完了しました！\n```");
                  const embed = {
                    title: "アカウントが作成されました！",
                    description: "ユーザー名\n" + message.author.username + "\nアカウント作成日時\n" + message.author.createdAt,
                    color: 1041866,
                    author: {
                      name: message.author.username,
                      icon_url: message.author.avatarURL
                    }
                  };
                  //client.channels.cache.get("834023089775444000").send({
                  //  embed
                  // });
                });
                return;
              }
              if (message.content.startsWith(";;prepare")) {

                connection.query("SELECT count(*) FROM raidchannel WHERE id = '" + message.channel.id + "'", (error, results) => {

                  if (results[0]["count(*)"] != 0) {
                    message.inlineReply("```diff\n レイドチャンネルとして登録されているチャンネルにはprepareできません！```");
                    return;
                  }
                  connection.query("SELECT count(*) FROM channel WHERE id = '" + message.channel.id + "'", (error, results) => {
                    if (results[0]["count(*)"] != 0) {
                      message.inlineReply("```diff\n このチャンネルはもうすでに登録されています！```");
                      return;
                    }
                    connection.query("INSERT INTO channel(id,guild) VALUES ('" + message.channel.id + "','" + message.guild.id + "')", (error, results) => {
                      message.inlineReply("```diff\n +このチャンネルをOneWorldの冒険チャンネルとして登録しました！\n```");
                      var embed = {
                        title: "レア度[通常]　属性[無]\n練習用ロボットが待ち構えている...\nLv.1 HP:10",
                        color: 1041866,
                        image: {
                          url: "https://media.discordapp.net/attachments/772953562702938143/772953856954859530/image0.png"
                        }
                      };
                      message.channel.send({
                        embed
                      });
                    });
                    return;
                  });
                });
              }
              //atk&fire&ratk&rfire
              async function battle(connection, client, message, atk = true, raid = false, loop = false, n = 0) {
                console.log("battle" + n)
                if(loop && n==0) return battle(connection, client, message, atk);
                function customPrepareStackTrace(error, structuredStackTrace) {
                  return structuredStackTrace[0].getLineNumber();
                };

                function getLineNumber() {
                  var original = Error.prepareStackTrace;
                  Error.prepareStackTrace = customPrepareStackTrace;
                  var error = {};
                  Error.captureStackTrace(error, getLineNumber);
                  var lineNumber = error.stack;
                  Error.prepareStackTrace = original;
                  return lineNumber;
                }
                var raidtext = ""
                if (raid) {
                  raidtext = "raid"
                }

                connection.query("SELECT * FROM user WHERE id = '" + message.author.id + "'", (error, results) => {
                  if (results[0] !== null && results[0] !== undefined) {
                    if (results[0].joinchannel != message.channel.id && results[0].joinchannel !== null) {
                      message.inlineReply("> あなたは<#" + results[0].joinchannel + ">ですでに戦闘中です。");
                      return;
                    }
                    userHP = results[0]["hp"]
                    userJOB = results[0]["nowjob"]
                    userJOBLV = results[0]["job" + results[0]["nowjob"]]
                    userJOBID = results[0]["job" + results[0]["nowjob"] + "id"]
                    userGUILD = results[0]["guild"]
                  }
                  connection.query("SELECT count(*) FROM " + raidtext + "channel WHERE id = '" + message.channel.id + "'", (error, results) => {
                    if (error) {
                      console.log(error)
                      //client.channels.cache.get("834023089775444000").send("<@769340481100185631>データベースへの接続に失敗しました！\n```" + error + "```" + getLineNumber());
                      return;
                    }
                    if (results[0]["count(*)"] == 0) {
                      message.inlineReply('```diff\n -最初に";;prepare"でチャンネルを登録しましょう！```');
                      return;
                    }
                    connection.query("SELECT * FROM " + raidtext + "channel WHERE id = '" + message.channel.id + "'", async (error, results) => {
                      if (error) {
                        console.log(error)
                        //client.channels.cache.get("834023089775444000").send("<@769340481100185631>データベースへの接続に失敗しました！\n```" + error + "```" + getLineNumber());
                        return;
                      }
                      clv = results[0]["lv"];
                      enemyhp = results[0]["hp"];
                      if (results[0]["progress"]) {
                        var reply = await message.inlineReply("```diff\n -前の処理が進行中です。\n```");
                        reply.delete({
                          timeout: 5000
                        });
                        return false;
                      } else {
                        if (!loop) connection.query("UPDATE " + raidtext + "channel SET progress = 1 WHERE id = '" + message.channel.id + "';", (error, results) => { });
                        
                        
                        if (userHP == 0) {
                          if (!loop) message.inlineReply("```diff\n -あなたはもうやられています...！```");
                          connection.query("UPDATE " + raidtext + "channel SET progress = 0 WHERE id = '" + message.channel.id + "';", (error, results) => { });
                          return;
                        } else {
                          connection.query("UPDATE user SET joinchannel = '" + message.channel.id + "' WHERE id = '" + message.author.id + "';", (error, results) => {
                            if (error) {
                              console.log(error)
                              //client.channels.cache.get("834023089775444000").send("<@769340481100185631>データベースへの接続に失敗しました！\n```" + error + "```" + getLineNumber());
                              return;
                            }
                          });
                          if (error) {
                            console.log(error)
                            //client.channels.cache.get("834023089775444000").send("<@769340481100185631>データベースへの接続に失敗しました！\n```" + error + "```" + getLineNumber());
                            return;
                          }
                          var defence = 1;
                          var mdefence = 1;
                          var php = userHP;
                          if (atk) {
                            var atkmagni = 1;
                            switch (userJOB) {
                              case 0:
                              case 3:
                                break;
                              case 2:
                                atkmagni = 0.5;
                                break;
                              case 1:
                                atkmagni = 5;
                                break;
                            }
                          } else {
                            var atkmagni = 0.5;
                            switch (userJOB) {
                              case 0:
                              case 3:
                                break;
                              case 1:
                                atkmagni = 0.25;
                                break;
                              case 2:
                                atkmagni = 2.5;
                                mdefence += 1.25;
                                break;
                            }
                          }
                          var damage = (Math.floor(Math.sqrt(userJOBLV)) * 0.05) * atkmagni * userJOBID;
                          var nowjob = "job" + userJOB;
                          var nowexp = userJOBLV;
                          var playerlv = Math.floor(Math.sqrt(userJOBLV));

                          if (userGUILD !== null) {
                            var gname = userGUILD;
                            await connection.query("SELECT * FROM guild WHERE name = '" + gname + "'", (error, results) => {
                              damage = damage + damage * (results[0]["attack"] * 0.075);
                              defence += results[0]["defend"];
                            });
                          }
                          connection.query("SELECT * FROM " + raidtext + "enemy WHERE id = '" + results[0]["enemyid"] + "'", (error, results) => {
                            var magni = results[0]["magni"];
                            damage = Math.floor(damage / results[0]["defend"]);
                            var getdamage = results[0]["attack"];
                            getdamage = Math.ceil(getdamage * clv);
                            getdamage = Math.floor(getdamage / ((defence * 0.075 + 1) + mdefence));
                            if (php - getdamage < 1) {
                              var playerhp = 0;
                            } else {
                              var playerhp = php - getdamage;
                            }
                            connection.query("UPDATE user SET hp = '" + playerhp + "' WHERE id = '" + message.author.id + "';", (error, results) => {
                              if (enemyhp - damage < 1) {
                                var kill = true;
                                var enemy = 0;
                              } else {
                                var kill = false;
                                var enemy = enemyhp - damage;
                              }
                              connection.query("UPDATE " + raidtext + "channel SET hp = '" + enemy + "' WHERE id = '" + message.channel.id + "';", (error, results) => {
                                if (enemy != 0) {
                                  if (!loop) message.channel.send("```\n" + message.author.username + "は敵に" + damage + "ダメージ与えた\n敵の残りHP:" + enemy + "\n" + message.author.username + "は敵から" + getdamage + "ダメージ受けた\nあなたの残りHP:" + playerhp + "```")
                                    .then((message) => {
                                      connection.query("UPDATE " + raidtext + "channel SET progress = 0 WHERE id = '" + message.channel.id + "';", (error, results) => { });
                                    })
                                }
                                if (kill) {
                                  connection.query("SELECT * FROM " + raidtext + "enemy JOIN attribute ON " + raidtext + "enemy.attribute = attribute.id ORDER BY RAND() LIMIT 1", (error, results) => {
                                    if (error) {
                                      console.log(error)
                                      //client.channels.cache.get("834023089775444000").send("<@769340481100185631>データベースへの接続に失敗しました！\n```" + error + "```" + getLineNumber());
                                      return;
                                    }
                                    var nexturl = results[0]["url"];
                                    var zokusei = results[0]["attribute"];
                                    var nexthp = results[0]["hp"];
                                    var nextname = results[0]["name"];
                                    var nextenemyid = results[0]["id"];
                                    var zokuseitxt = results[0]["attributename"];
                                    nexthp = nexthp * clv;
                                    var nextlv = clv + 1;
                                    connection.query("UPDATE " + raidtext + "channel SET hp = '" + nexthp + "', lv = '" + nextlv + "', enemyid = '" + nextenemyid + "' WHERE id = '" + message.channel.id + "';", (error, results) => {
                                      if (error) {
                                        console.log(error)
                                        //client.channels.cache.get("834023089775444000").send("<@769340481100185631>データベースへの接続に失敗しました！\n```" + error + "```" + getLineNumber());
                                        return;
                                      }
                                      connection.query("SELECT id FROM user WHERE joinchannel = " + message.channel.id, (error, results) => {
                                        if (error) {
                                          console.log(error)
                                          //client.channels.cache.get("834023089775444000").send("<@769340481100185631>データベースへの接続に失敗しました！\n```" + error + "```" + getLineNumber());
                                          return;
                                        }
                                        resultcounts = results.length
                                        promise = new Promise(
                                          (resolve, reject) => {
                                            resulttext = ""
                                            usercounts = 0
                                            for (const id of results.map(obj => obj.id)) {
                                              connection.query("SELECT * FROM user WHERE id = " + id, (error, results) => {
                                                if (error) {
                                                  console.log(error)
                                                  //client.channels.cache.get("834023089775444000").send("<@769340481100185631>データベースへの接続に失敗しました！\n```" + error + "```" + getLineNumber());
                                                  return;
                                                }
                                                var playerlv = Math.floor(Math.sqrt(results[0]["job" + results[0]["nowjob"]]));
                                                var nowjob = "job" + results[0]["nowjob"];
                                                var nowexp = results[0]["job" + results[0]["nowjob"]];
                                                var playerlv = Math.floor(Math.sqrt(results[0]["job" + results[0]["nowjob"]]));
                                                var nextphp = playerlv * 10;
                                                var nowlv = nextlv - 1;
                                                var getexp = nowlv * magni + nowexp;
                                                var getguildexp = nowlv * magni;
                                                var battleuserguild = results[0]["guild"];
                                                if (error) {
                                                  console.log(error)
                                                  //client.channels.cache.get("834023089775444000").send("<@769340481100185631>データベースへの接続に失敗しました！\n```" + error + "```" + getLineNumber());
                                                  return;
                                                }
                                                if (battleuserguild !== null) {
                                                  var gname = battleuserguild;
                                                  connection.query("SELECT * FROM guild WHERE name = '" + gname + "'", (error, results) => {
                                                    if (error) {
                                                      console.log(error)
                                                      //client.channels.cache.get("834023089775444000").send("<@769340481100185631>データベースへの接続に失敗しました！\n```" + error + "```" + getLineNumber());
                                                      return;
                                                    }
                                                    var getgexp = getguildexp;
                                                    expmagni = results[0]["exp"];
                                                    getexp = Math.floor(nowlv * magni * (expmagni * 0.075) + nowlv * magni + nowexp);
                                                    getgexp = (nowlv * magni * (expmagni * 0.075) + nowlv * magni) * 10 + parseInt(results[0]["gexp"]);


                                                    connection.query("UPDATE guild SET gexp = '" + getgexp + "' WHERE name = '" + gname + "';", (error, results) => {
                                                      if (error) {
                                                        console.log(error)
                                                        return
                                                      }
                                                    });
                                                    connection.query("UPDATE user SET " + nowjob + " = '" + getexp + "' , joinchannel = null, pray = 0 , hp = '" + nextphp + "' WHERE id = '" + id + "';", (error, results) => {
                                                      if (error) {
                                                        console.log(error)
                                                        //client.channels.cache.get("834023089775444000").send("<@769340481100185631>データベースへの接続に失敗しました！\n```" + error + "```" + getLineNumber());
                                                        return;
                                                      }
                                                      var embed = {
                                                        title: "ユーザーに経験値が入りました！",
                                                        description: "ユーザーid:\n" + id + "\n取得経験値:\n" + (nowlv * magni * (expmagni * 0.075) + nowlv * magni) + "\n現在の所持経験値:\n" + getexp + "\n経験値の取得方法:\n敵の討伐",
                                                        color: 1041866
                                                      };

                                                      resulttext = resulttext + "<@" + id + ">さんは経験値を獲得しました！\n獲得した経験値:\n" + Math.floor(nowlv * magni * (expmagni * 0.075) + nowlv * magni) + "\n"
                                                      usercounts++
                                                      if (usercounts == resultcounts) {
                                                        if (resulttext.length > 1800) resulttext = "文字数が多すぎるためリザルトは省略します…"
                                                        var embed = {
                                                          description: resulttext,
                                                          color: 1041866
                                                        };
                                                        if (!loop) message.channel.send({
                                                          content: "```\n" + message.author.username + "は敵に" + damage + "ダメージ与えた\n敵の残りHP:" + enemy + "\n敵を倒した！```",
                                                          embed: embed
                                                        });
                                                        var embed = {
                                                          title: "レア度[通常] 属性[" + zokuseitxt + "]\n" + nextname + "が待ち構えている...\nLv:" + nextlv + " HP:" + nexthp,
                                                          color: 1041866,
                                                          image: {
                                                            url: nexturl
                                                          }
                                                        };
                                                        if (!loop) message.channel.send({
                                                          embed
                                                        }).then((message) => {
                                                          sleep(1, () => {
                                                            connection.query("UPDATE " + raidtext + "channel SET progress = 0 WHERE id = '" + message.channel.id + "';", (error, results) => { });
                                                          })
                                                        })
                                                        if (loop) battle(connection, client, message, atk, false, loop, n-1)
                                                      }
                                                    });
                                                  });
                                                } else {
                                                  connection.query("UPDATE user SET " + nowjob + " = '" + getexp + "', pray = 0, hp = '" + nextphp + "' , joinchannel = null WHERE id = '" + id + "';", (error, results) => {
                                                    if (error) {
                                                      console.log(error)
                                                      //client.channels.cache.get("834023089775444000").send("<@769340481100185631>データベースへの接続に失敗しました！\n```" + error + "```" + getLineNumber());
                                                      return;
                                                    }
                                                    var embed = {
                                                      title: "ユーザーに経験値が入りました！",
                                                      description: "ユーザーid:\n" + id + "\n取得経験値:\n" + nowlv * magni + "\n現在の所持経験値:\n" + getexp + "\n経験値の取得方法:\n敵の討伐",
                                                      color: 1041866
                                                    };

                                                    resulttext = resulttext + "<@" + id + ">さんは経験値を獲得しました！\n獲得した経験値:\n" + nowlv * magni + "\n"
                                                    usercounts++
                                                    if (usercounts == resultcounts) {
                                                      if (resulttext.length > 1800) resulttext = "文字数が多すぎるためリザルトは省略します…"
                                                      var embed = {
                                                        description: resulttext,
                                                        color: 1041866
                                                      };
                                                      if (!loop) message.channel.send({
                                                        content: "```\n" + message.author.username + "は敵に" + damage + "ダメージ与えた\n敵の残りHP:" + enemy + "\n敵を倒した！```",
                                                        embed: embed
                                                      });
                                                      var embed = {
                                                        title: "レア度[通常] 属性[" + zokuseitxt + "]\n" + nextname + "が待ち構えている...\nLv:" + nextlv + " HP:" + nexthp,
                                                        color: 1041866,
                                                        image: {
                                                          url: nexturl
                                                        }
                                                      };
                                                      if (!loop) message.channel.send({
                                                        embed
                                                      }).then((message) => {
                                                        sleep(1, () => {
                                                          connection.query("UPDATE " + raidtext + "channel SET progress = 0 WHERE id = '" + message.channel.id + "';", (error, results) => { });
                                                        })
                                                        if (loop) battle(connection, client, message, atk, false, loop, n-1)
                                                      })
                                                    }
                                                  });
                                                }
                                              });
                                            }
                                          });
                                      });
                                    });
                                  });
                                }
                              });
                            });
                          });
                        }
                      }
                    });
                  });
                });
              
              }
              //command
              if (message.content.startsWith(";;atk") || message.content.startsWith(";;attack")) {
                await battle(connection, client, message, true)
              }
              if (message.content.startsWith(";;fire") || message.content.startsWith(";;f")) {
                await battle(connection, client, message, false)
              }
              if (message.content.startsWith(";;ratk") || message.content.startsWith(";;rattack")) {
                await battle(connection, client, message, true, true)
              }
              if (message.content.startsWith(";;rfire") || message.content.startsWith(";;rf")) {
                await battle(connection, client, message, false, true)
              }
            });
          } catch (e) {
            //client.channels.cache.get("834023089775444000").send("<@769340481100185631>データベースへの接続に失敗しました！\n```" + e + "```" + getLineNumber());
          }
        }
      });
    }
  });
});

client.login(token)