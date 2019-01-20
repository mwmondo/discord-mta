var DiscordRPC = require('discord-rpc');
var clientId = '465264679674183681';
var rpc = new DiscordRPC.Client({ transport: 'ipc' });
var config = require('../config.js');
var Gamedig = require('gamedig');
var cron = require('node-cron');
console.log("Discord Rich Presence for Multi Theft Auto" + '\n'
    + "To finish press CTRL + C or close the window" + '\n');
if (!config.server) {
    console.error("You don`t set IP address");
    return;
}
console.log("Server IP: " + config.server + "\n"
    + "Timer enable: " + config.timer + "\n"
    + "You can change this option in config.js file")
if (config.timer == true) {
    var startTimestamp = new Date();
} else {
    var startTimestamp = '';
}

rpc.on('ready', () => {
    Gamedig.query({
        type: 'mtasa',
        host: config.server
    }).then((state) => {
        console.log("Starting MTA...");
        let connect = state.connect;
        require("openurl").open("mtasa://" + connect);
        console.log("Connected RPC!");
        rpc.setActivity({
            details: state.name,
            state: 'Online',
            startTimestamp,
            largeImageKey: 'mta',
            largeImageText: 'Multi Theft Auto',
            partySize: state.raw.numplayers,
            partyMax: state.maxplayers,
          });
    }).catch((error) => {
        console.error("I can't connect with server (" + config.server + ")");
        process.exit();
    });
});

cron.schedule('0 */1,5 * * * *', function() {
    Gamedig.query({
        type: 'mtasa',
        host: config.server
    }).then((state) => {
        rpc.setActivity({
            details: state.name,
            state: 'Online',
            startTimestamp,
            largeImageKey: 'mta',
            largeImageText: 'Multi Theft Auto',
            partySize: state.raw.numplayers,
            partyMax: state.maxplayers,
          });
    }).catch((error) => {
        console.error("Connection lost");
    });
})
rpc.login({ clientId }).catch(console.error);