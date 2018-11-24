var fs = require('fs');
var Discord = require('discord.io');
var Event = require('./Event.js');
var Util = require('./Util.js')
var logger = require('winston');
var auth = require('./auth.json');
var permissionsFile;
var gatekeeper;

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
var selectedRole = undefined;
var selectedEvent = undefined;

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
    
    fs.access('./permissions.json', fs.constants.F_OK, (err) => {
    	if (err) {
    		arrayWhiteBlack = '"whitelist":[], "blacklist":[]';
    		catConfigure = '"configure":{' + arrayWhiteBlack + '}';
    		catEvent = '"event":{' + arrayWhiteBlack + '}';
    		catPermissions = '"permissions":{' + arrayWhiteBlack + '}';
    		catTeam = '"team":{' + arrayWhiteBlack + '}';
    		
    		gatekeeperConcat = '{' + arrayWhiteBlack + '}';
    		gatekeeperJSON = JSON.parse(gatekeeperConcat);
    		gatekeeperPrettified = JSON.stringify(gatekeeperJSON, null, 4);
    		
    		fs.writeFile('./permissions.json', gatekeeperPrettified);
    		console.log("Permissions file was not found; a new one has been generated.");
    		
    		permissionsFile = ('./permissions.json');
    		gatekeeper = require(permissionsFile);
    	}
    	else {
    		permissionsFile = ('./permissions.json');
    		gatekeeper = require(permissionsFile);
    		console.log("Permissions file found; a new one has not been generated.");
    	}
	});
});

bot.on('message', 
		function (user, userID, channelID, message, evt) {
		    // Our bot needs to know if it will execute a command
		    // It will listen for messages that will start with `!`
		    if (message.substring(0, 1) == '!') {
		    	var serverID = bot.channels[channelID].guild_id;
		    	var server = bot.servers[serverID];
		    	var serverOwner = server.owner_id;
		    	
		    	var serverRoles = Object.keys(server.roles);
		    	var numRoles = serverRoles.length;
		    	var listRoles = "";
		    	for (i = 1; i < numRoles; i++) {
		    		listRoles += "\n" + i.toString() + ' - ' + server.roles[serverRoles[i]].name;
		    	}
		    	
		    	var isUserBlacklisted = false;
		    	var isUserWhitelisted = false;
		    	var userUnauthorized = "Mmm, nope, sorry... that looks like an unauthorized account there buddy...";

		        var args = message.substring(1).split(' '); // Converts the string 'message' into an array object where each word is an item in the array
		        var cmdPrefix = args[0];
		        var cmdCategory = args[1];
		        var cmdOperation = args[2];
		        var cmdParam1 = args[3];
		        
		        //args = args.splice(1);
		        if (cmdPrefix.toLowerCase() == "tc") {
		        	switch(cmdCategory.toLowerCase()) {
			            case "help":
			                bot.sendMessage({
			                    to: channelID,
			                    message: 	'Valid categories include:\n' +
			                    			'!tc configure\n' +
			                    			'!tc event\n' +
			                    			'!tc permissions\n' +
			                    			'!tc source\n' +
			                    			'!tc team'
			                });
			                break;
			            
			            case "configure":
			            	if (cmdOperation != null) {
			            		for (i = 0; i < server.members[userID].roles.length; i++) {
			            			for (j = 0; j < gatekeeper.configure.blacklist.length; j++) {
			            				if(server.members[userID].roles[i] == gatekeeper.configure.blacklist[j]) {
			            					isUserBlacklisted = true;
			            					break;
			            				}
			            			}
			            			if (isUserBlacklisted) {
			            				break;
			            			}
			            		}
			            	
			            		for(i = 0; i < server.members[userID].roles.length; i++) {
			            			for (j = 0; j < gatekeeper.configure.whitelist.length; j++) {
			            				if (server.members[userID].roles[i] == gatekeeper.configure.whitelist[j]) {
			            					isUserWhitelisted = true;
			            					break;
			            				}
			            			}
			            			if (isUserWhitelisted) {
			            				break;
			            			}
			            		}
			            		
			            		if (userID == serverOwner || (Util.whitelistConfig(userID) && !Util.blacklistConfig(userID))) {
			            			switch(cmdOperation.toLowerCase()) {
				            			case "maxEvents":
				            				bot.sendMessage({
				            					to: channelID,
				            					message: 'This operation will allow you to set a limit on the number of tournaments that can be open at once.'
				            				});
				            				break;
				            				
				            			default:
				            				bot.sendMessage({
				            					to: channelID, message: 'Not a valid operation; valid operations include: `maxEvents`'
				            				});
			            			}
			            		}
			            		else {
			            			bot.sendMessage({
			            				to: channelID,
			            				message: userUnauthorized
			            			});
			            			break;
			            		}			            		
			            	}
			            	else {
			            		bot.sendMessage({
			            			to: channelID, 
			            			message: '`' + cmdCategory + '` what?  Do you need `help`?'
			            		});
			            	}
			            	break;
			            	
			            case "event":
			            	if (cmdOperation != null) {
			            		/*
			            		for (i = 0; i < server.members[userID].roles.length; i++) {
			            			for (j = 0; j < gatekeeper.event.blacklist.length; j++) {
			            				if(server.members[userID].roles[i] == gatekeeper.event.blacklist[j]) {
			            					isUserBlacklisted = true;
			            					break;
			            				}
			            			}
			            			if (isUserBlacklisted) {
			            				break;
			            			}
			            		}
			            	
			            		for(i = 0; i < server.members[userID].roles.length; i++) {
			            			for (j = 0; j < gatekeeper.event.whitelist.length; j++) {
			            				if (server.members[userID].roles[i] == gatekeeper.event.whitelist[j]) {
			            					isUserWhitelisted = true;
			            					break;
			            				}
			            			}
			            			if (isUserWhitelisted) {
			            				break;
			            			}
			            		}
			            		*/
			            		
			            		if (userID == serverOwner || (Util.whitelistEvent == true && Util.blacklistEvent == false)) {
			            			switch(cmdOperation.toLowerCase()) {
					            		case "addGame":
					            			bot.sendMessage({
					            				to: channelID, 
					            				message: 'To be honest, this operation might not even get used... we\'ll see...'
					            			});
					            			break;
					            	
				            			case "addPhase":
					            			bot.sendMessage({
					            				to: channelID,
					            				message: 'This operation will create a new phase for a selected tournament.'
					            			});
					            			break;
					            			
					            		case "addRound":
					            			bot.sendMessage({
					            				to: channelID, 
					            				message: 'This operation will create a new round for a selected phase of a selected tournament.  It will likely accept a value as the number of games played in that round.'
					            			});
					            			break;
					            		
					            		case "close":
					            			bot.sendMessage({
					            				to: channelID,
					            				message: 'This operation will officially end a tournament.'
					            			});
					            			break;
					            		
					            		case "create":
				            				bot.sendMessage({
				            					to: channelID, 
				            					message: 'Yep, you\'re authorized.'
				            				});
							            	
					            			// Check if tournament name was provided
					            	
					            				// If true
					            	
					            					// Create new instance of tournament object
					            					// var tournament = new Event.tournament;
				            			
				            						// Generate new .json file and assign tournament name value to file
				            						
				            						// Select new tournament
					            	
					            					// Create new server category named after tournament
					            	
					            					// Create new text channel in the category called "register"
					            	
					            					// Check for undefined property values
					            	
					            						// Output list of undefined properties
					            	
					            				// If false
					            	
					            					// Output missing parameter message
				            			
					            			break;
				            			
					            		case "delete":
					            			bot.sendMessage({
					            				to: channelID,
					            				message: 'This operation will delete a selected tournament.'
					            			});
					            			break;
					            			
					            		case "deleteGame":
					            			bot.sendMessage({
					            				to: channelID, 
					            				message: 'To be honest, this operation might not even get used... we\'ll see...'
					            			});
					            			
					            		case "deletePhase":
					            			bot.sendMessage({
					            				to: channelID, 
					            				message: 'This operation will delete a selected phase of a tournament.'
					            			});
					            			
					            		case "deleteRound":
					            			bot.sendMessage({
					            				to: channelID,
					            				message: 'This operation will delete a selected round of a selected phase of a selected tournament.  Whew, that was a mouthful.'
					            			});
					            			break;
					            			
					            		case "escape":
					            			bot.sendMessage({
					            				to: channelID,
					            				message: 'This operation will deselect the object you have selected.'
					            			});
					            			break;
					            			
					            		case "open":
					            			bot.sendMessage({
					            				to: channelID,
					            				message: 'This operation will begin a selected tournament.'
					            			});
					            			break;
					            			
					            		case "select":
					            			bot.sendMessage({
					            				to: channelID,
					            				message: 'This operation will select a tournament or possibly a child object, allowing you to perform more specific tasks on it.'
					            			});
					            			break;
				            			
				            			default:
				            				bot.sendMessage({
				            					to: channelID,
				            					message: 'Not a valid "' + cmdCategory + '" operation.  Valid operations include: `create`, `delete`, `open`, `close`, `select`, `addPhase`, `deletePhase`, `escape`,'
				            				});
			            			
			            			}
			            		}
			            		else {
			            			bot.sendMessage({
			            				to: channelID,
			            				message: userUnauthorized
			            			});
			            			break;
			            		}
				            	
			            	}
			            	else {
			            		bot.sendMessage({
			            			to: channelID, 
			            			message: cmdCategory + 'what?  Do you need `help`?'
			            		});
			            	}
			            	break;
			            
			            case "permissions":
			            	console.log("!tc " + cmdCategory + " entered");
			            	
			            	if (cmdOperation != null) {
			            		for (i = 0; i < server.members[userID].roles.length; i++) {
			            			for (j = 0; j < gatekeeper.permissions.blacklist.length; j++) {
			            				if(server.members[userID].roles[i] == gatekeeper.permissions.blacklist[j]) {
			            					isUserBlacklisted = true;
			            					break;
			            				}
			            			}
			            			if (isUserBlacklisted) {
			            				break;
			            			}
			            		}
			            	
			            		for(i = 0; i < server.members[userID].roles.length; i++) {
			            			for (j = 0; j < gatekeeper.permissions.whitelist.length; j++) {
			            				if (server.members[userID].roles[i] == gatekeeper.permissions.whitelist[j]) {
			            					isUserWhitelisted = true;
			            					break;
			            				}
			            			}
			            			if (isUserWhitelisted) {
			            				break;
			            			}
			            		}
			            		
			            		if (userID == serverOwner || (isUserWhitelisted && !isUserBlacklisted)) {
			            			switch(cmdOperation.toLowerCase()) {
				            			case "escape":
				            				selectedRole = undefined;
				            				bot.sendMessage({
					            					to: channelID, 
					            					message: 'Selected role has been cleared.'
					            				});
				            				break;
					            				
				            			case "grant":
				            				if (selectedRole != undefined) {
				            					switch(cmdParam1.toLowerCase()) {
						            				case "configure":
						            					gatekeeper.configure.whitelist.push(selectedRole.id);
						            					fs.writeFile(permissionsFile, JSON.stringify(gatekeeper, null, 4), function (err) {
						            						if (err) return console.log(err);
						            						console.log("Permissions file has been updated.  Permissions for bot configuration " +
						            									"has been granted to users of role \"" + selectedRole + ",\" with ID " + selectedRole.id);
						            					});
						            					bot.sendMessage({
						            						to: channelID,
						            						message: 'Configure permissions have been granted to members of role "' + selectedRole.name + '"'
						            					});
						            					break;
						            					
						            				case "event":
						            					gatekeeper.event.whitelist.push(selectedRole.id);
						            					fs.writeFile(permissionsFile, JSON.stringify(gatekeeper, null, 4), function (err) {
						            						if (err) return console.log(err);
						            						console.log("Permissions file has been updated.  Permissions for event management " +
						            									"has been granted to users of role \"" + selectedRole.name + ",\" with ID " + selectedRole.id);
						            					});
						            					bot.sendMessage({
						            						to: channelID,
						            						message: 'Event permissions have been granted to members of role "' + selectedRole.name + '"'
						            					});
						            					break;
						            					
						            				case "permissions":
						            					gatekeeper.permissions.whitelist.push(selectedRole.id);
						            					fs.writeFile(permissionsFile, JSON.stringify(gatekeeper, null, 4), function (err) {
						            						if (err) return console.log(err);
						            						console.log("Permissions file has been updated.  Permissions to update member permissions " +
						            									"has been granted to users of role \"" + selectedRole.name + ",\" with ID " + selectedRole.id);
						            					});
						            					bot.sendMessage({
						            						to: channelID,
						            						message: 'The ability to change permissions have been granted to members of role "' + selectedRole.name + '"'
						            					});
						            					break;
						            					
						            				case "team":
						            					gatekeeper.team.whitelist.push(selectedRole.id);
						            					fs.writeFile(permissionsFile, JSON.stringify(gatekeeper, null, 4), function (err) {
						            						if (err) return console.log(err);
						            						console.log("Permissions file has been updated.  Permissions for teams management " +
						            									"has been granted to users of role \"" + selectedRole.name + ",\" with ID " + selectedRole.id);
						            					});
						            					bot.sendMessage({
						            						to: channelID,
						            						message: 'Team permissions have been granted to members of role "' + selectedRole.name + '"'
						            					});
						            					break;
						            					
						            				default:
						            					bot.sendMessage({
						            						to: channelID,
						            						message: 'Not a valid category; valid categories include: `configure`, `event`, `permissions`, and `team`'
						            					});
						            					break;
				            					}
				            				}
				            				else {
				            					bot.sendMessage({
				            						to: channelID,
				            						message: 'No role selected.  Run `!tc permissions list` to see a list of available roles.'
				            					});
				            				}
				            				break;
				            				
				            				
				            			case "list":
				            				bot.sendMessage({
				            					to: channelID,
				            					message: "Here's a list of the roles on your server.  Use the select operation to select the number of the role for which you want to edit permissions:\n" + 
				            							 listRoles
				            				});
				            				break;
				            				
				            			case "pardon":
				            				if (selectedRole != undefined) {
				            					switch (cmdParam1.toLowerCase()) {
					            					case "configure":
					            						roleToPardon = gatekeeper.configure.blacklist.indexOf(selectedRole.id);
					            						gatekeeper.configure.blacklist.splice(roleToPardon, 1);
					            						fs.writeFile(permissionsFile, JSON.stringify(gatekeeper, null, 4), function(err) {
					            							console.log("Permissions file has been updated.  Role \"" + selectedRole.name + "\" has been " +
					            										"removed from the blacklist of bot configurations.")
					            						});
					            						bot.sendMessage({
					            							to: channelID,
					            							message: 'Role "' + selectedRole.name + '" has been removed from the blacklist of `' + cmdParam1.toLowerCase() + '`.'
					            						});
					            						break;
					            					case "event":
					            						roleToPardon = gatekeeper.event.blacklist.indexOf(selectedRole.id);
					            						gatekeeper.event.blacklist.splice(roleToPardon, 1);
					            						fs.writeFile(permissionsFile, JSON.stringify(gatekeeper, null, 4), function(err) {
					            							console.log("Permissions file has been updated.  Role \"" + selectedRole.name + "\" has been " +
					            										"removed from the blacklist of bot configurations.")
					            						});
					            						bot.sendMessage({
					            							to: channelID,
					            							message: 'Role "' + selectedRole.name + '" has been removed from the blacklist of `' + cmdParam1.toLowerCase() + '`.'
					            						});
					            						break;
					            					case "permissions":
					            						roleToPardon = gatekeeper.permissions.blacklist.indexOf(selectedRole.id);
					            						gatekeeper.permissions.blacklist.splice(roleToPardon, 1);
					            						fs.writeFile(permissionsFile, JSON.stringify(gatekeeper, null, 4), function(err) {
					            							console.log("Permissions file has been updated.  Role \"" + selectedRole.name + "\" has been " +
					            										"removed from the blacklist of bot configurations.")
					            						});
					            						bot.sendMessage({
					            							to: channelID,
					            							message: 'Role "' + selectedRole.name + '" has been removed from the blacklist of `' + cmdParam1.toLowerCase() + '`.'
					            						});
					            						break;
					            					case "team":
					            						roleToPardon = gatekeeper.team.blacklist.indexOf(selectedRole.id);
					            						gatekeeper.team.blacklist.splice(roleToPardon, 1);
					            						fs.writeFile(permissionsFile, JSON.stringify(gatekeeper, null, 4), function(err) {
					            							console.log("Permissions file has been updated.  Role \"" + selectedRole.name + "\" has been " +
					            										"removed from the blacklist of bot configurations.")
					            						});
					            						bot.sendMessage({
					            							to: channelID,
					            							message: 'Role "' + selectedRole.name + '" has been removed from the blacklist of `' + cmdParam1.toLowerCase() + '`.'
					            						});
					            						break;
					            					default:
					            						bot.sendMessage({
						            						to: channelID,
						            						message: 'Not a valid category; valid categories include: `configure`, `event`, `permissions`, and `team`'
						            					});
						            					break;
					            				}
				            				}
				            				else {
				            					bot.sendMessage({
				            						to: channelID,
				            						message: 'No role selected.  Run `!tc permissions list` to see a list of available roles.'
				            					});
				            				}
				            				break;
				            				
				            			case "repeal":
				            				if (selectedRole != undefined) {
				            					switch (cmdParam1.toLowerCase()) {
					            					case "configure":
					            						roleToRepeal = gatekeeper.configure.whitelist.indexOf(selectedRole.id);
					            						gatekeeper.configure.whitelist.splice(roleToRepeal, 1);
					            						fs.writeFile(permissionsFile, JSON.stringify(gatekeeper, null, 4), function(err) {
					            							if (err) throw err;
					            							console.log("Permissions file has been updated.  Role \"" + selectedRole.name + "\" has been " +
					            										"removed from the whitelist of bot configurations.")
					            						});
					            						bot.sendMessage({
					            							to: channelID,
					            							message: 'Role "' + selectedRole.name + '" has been removed from the whitelist of `' + cmdParam1.toLowerCase() + '`.'
					            						});
					            						break;
					            					case "event":
					            						roleToRepeal = gatekeeper.event.whitelist.indexOf(selectedRole.id);
					            						gatekeeper.event.whitelist.splice(roleToRepeal, 1);
					            						fs.writeFile(permissionsFile, JSON.stringify(gatekeeper, null, 4), function(err) {
					            							if (err) throw err;
					            							console.log("Permissions file has been updated.  Role \"" + selectedRole.name + "\" has been " +
					            										"removed from the whitelist of bot configurations.")
					            						});
					            						bot.sendMessage({
					            							to: channelID,
					            							message: 'Role "' + selectedRole.name + '" has been removed from the whitelist of `' + cmdParam1.toLowerCase() + '`.'
					            						});
					            						break;
					            					case "permissions":
					            						roleToRepeal = gatekeeper.permissions.whitelist.indexOf(selectedRole.id);
					            						gatekeeper.permissions.whitelist.splice(roleToPardon, 1);
					            						fs.writeFile(permissionsFile, JSON.stringify(gatekeeper, null, 4), function(err) {
					            							if (err) throw err;
					            							console.log("Permissions file has been updated.  Role \"" + selectedRole.name + "\" has been " +
					            										"removed from the whitelist of bot configurations.")
					            						});
					            						bot.sendMessage({
					            							to: channelID,
					            							message: 'Role "' + selectedRole.name + '" has been removed from the whitelist of `' + cmdParam1.toLowerCase() + '`.'
					            						});
					            						break;
					            					case "team":
					            						roleToRepeal = gatekeeper.team.whitelist.indexOf(selectedRole.id);
					            						gatekeeper.team.whitelist.splice(roleToPardon, 1);
					            						fs.writeFile(permissionsFile, JSON.stringify(gatekeeper, null, 4), function(err) {
					            							if (err) throw err;
					            							console.log("Permissions file has been updated.  Role \"" + selectedRole.name + "\" has been " +
					            										"removed from the whitelist of bot configurations.")
					            						});
					            						bot.sendMessage({
					            							to: channelID,
					            							message: 'Role "' + selectedRole.name + '" has been removed from the whitelist of `' + cmdParam1.toLowerCase() + '`.'
					            						});
					            						break;
					            					default:
					            						bot.sendMessage({
						            						to: channelID,
						            						message: 'Not a valid category; valid categories include: `configure`, `event`, `permissions`, and `team`'
						            					});
						            					break;
					            				}
				            				}
				            				else {
				            					bot.sendMessage({
				            						to: channelID,
				            						message: 'No role selected.  Run `!tc permissions list` to see a list of available roles.'
				            					});
				            				}
				            				break;
			            				
				            			case "revoke":
				            				if (selectedRole != undefined) {
				            					switch (cmdParam1.toLowerCase()) {
					            					case "configure":
					            						gatekeeper.configure.blacklist.push(selectedRole.id);
					            						fs.writeFile(permissionsFile, JSON.stringify(gatekeeper, null, 4), function(err) {
					            							if (err) throw err;
					            							console.log("Permissions file has been updated.  Bot configuration permissions have " + 
					            										"been revoked for members of role \"" + selectedRole.name + "\" with ID " + 
					            										selectedRole.id);
					            						});
					            					case "event":
					            						gatekeeper.event.blacklist.push(selectedRole.id);
					            						fs.writeFile(permissionsFile, JSON.stringify(gatekeeper, null, 4), function(err) {
					            							if (err) throw err;
					            							console.log("Permissions file has been updated.  Event management permissions have " + 
					            										"been revoked for members of role \"" + selectedRole.name + "\" with ID " + 
					            										selectedRole.id);
					            						});
					            					case "permissions":
					            						gatekeeper.permissions.blacklist.push(selectedRole.id);
					            						fs.writeFile(permissionsFile, JSON.stringify(gatekeeper, null, 4), function(err) {
					            							if (err) throw err;
					            							console.log("Permissions file has been updated.  The ability to modify user " +
					            										"permissions has been revoked for members of role \"" + selectedRole.name + 
					            										"\" with ID " + selectedRole.id);
					            						});
					            					case "team":
					            						gatekeeper.team.blacklist.push(selectedRole.id);
					            						fs.writeFile(permissionsFile, JSON.stringify(gatekeeper, null, 4), function(err) {
					            							if (err) throw err;
					            							console.log("Permissions file has been updated.  Teams management permissions have " + 
					            										"been revoked for members of role \"" + selectedRole.name + "\" with ID " + 
					            										selectedRole.id);
					            						});
					            					default:
					            						bot.sendMessage({
						            						to: channelID,
						            						message: 'Not a valid category; valid categories include: `configure`, `event`, `permissions`, and `team`'
						            					});
						            					break;
				            					}
				            				}
				            				else {
				            					bot.sendMessage({
				            						to: channelID,
				            						message: 'No role selected.  Run `!tc permissions list` to see a list of available roles.'
				            					});
				            				}
				            				break;
				            				
				            			case "select":
				            				console.log(cmdOperation + " operation entered");
				            				if (cmdParam1 != null) {
				            					console.log(cmdParam1 + " entered as first parameter");
				            					if (parseInt(cmdParam1) > 0 && parseInt(cmdParam1) <= numRoles) {
				            						selectedRole = server.roles[serverRoles[parseInt(cmdParam1)]];
				            						bot.sendMessage({
				            							to: channelID,
				            							message: 'Role "' + selectedRole.name + '" selected.'
				            						});
				            					}
				            					else {
				            						bot.sendMessage({
				            							to: channelID,
				            							message: 'Please enter a valid number from the list of available roles.'
				            						});
				            					}
				            				}
				            				else {
				            					bot.sendMessage({
					            					to: channelID, 
					            					message: 'No role selection was detected.  Here\'s a list of the roles on your server.  Remember to select the role number, not the role name:\n' +
					            							 listRoles
					            				});
				            				}
				            				break;
				            			
				            			default:
				            				bot.sendMessage({
				            					to: channelID, 
				            					message: 'Not a valid ' + cmdCategory + ' operation; valid operations include: `escape`, `grant`, `revoke`, `select`'
				            				});
			            			}
			            		}
			            		else {
			            			bot.sendMessage({
			            				to: channelID,
			            				message: userUnauthorized
			            			})
			            		}
		            		}
			            	else {
			            		bot.sendMessage({
			            			to: channelID, 
			            			message: '`' + cmdCategory + '` what?  Do you need `help`?'
			            		});
			            	}
			            	break;
			            	
			            case "source":
			            	bot.sendMessage({
			            		to: channelID,
			            		message: 'Check out my source code on the GitHub repository! - https://github.com/ThePwnd/TournamentCreatorBot'
			            	});
			            	break;
			            	
			            case "team":
		            		if (cmdOperation != null) {
		            			for (i = 0; i < server.members[userID].roles.length; i++) {
			            			for (j = 0; j < gatekeeper.event.blacklist.length; j++) {
			            				if(server.members[userID].roles[i] == gatekeeper.event.blacklist[j]) {
			            					isUserBlacklisted = true;
			            					break;
			            				}
			            			}
			            			if (isUserBlacklisted) {
			            				break;
			            			}
			            		}
			            	
			            		for(i = 0; i < server.members[userID].roles.length; i++) {
			            			for (j = 0; j < gatekeeper.event.whitelist.length; j++) {
			            				if (server.members[userID].roles[i] == gatekeeper.event.whitelist[j]) {
			            					isUserWhitelisted = true;
			            					break;
			            				}
			            			}
			            			if (isUserWhitelisted) {
			            				break;
			            			}
			            		}
			            		
		            			switch(cmdOperation.toLowerCase()) {
				            		case "accept":
				            			bot.sendMessage({
				            				to: channelID,
				            				message: 'This operation will allow you to accept an invitation to join a team.'
				            			});
				            			break;
			            			
				            		case "add":
				            			if (userID == serverOwner || (isUserWhitelisted && !isUserBlacklisted)) {
				            				bot.sendMessage({
					            				to: channelID,
					            				message: 'This operation will add a player to the selected team.  It bypasses the usual invitation process.'
					            			});
				            			}
				            			else {
				            				bot.sendMessage({
				            					to: channelID,
				            					message: userUnauthorized
				            				});
				            			}
				            			break;
				            			
				            		case "cancel":
				            			bot.sendMessage({
				            				to: channelID,
				            				message: 'This operation will cancel an invitation sent to a player to join a team.'
				            			});
				            			break;
				            		
				            		case "create":
				            			// Check that channelID is for a valid tournament
				            			
				            				// If true
				            					
						            			// Check if user is already part of a team
						            			
						            				// If true
						            				
						            					// Output already on team message
						            				
						            				// If false
						            					
						            					// Check if team name was provided
						            					
						            						// If true
				            									
				            									// Check if name is valid and not taken
				            										
				            										// If true
						            									
										            					// Create new instance of team object
										            					
										            					// Generate new .json file named after the team in 
				            											
				            											// Assign team name to name property
				            											
				            											// Assign user to team as captain
						            									
						            									// Create new role with team name
								            							
								            							// Create private voice channel for team role and a max of 2 users
					            		
					            										// Output confirmation message
					            										bot.sendMessage({
					            											to: channelID,
					            											message: 'This command will create a new team and add you to the team as the team captain.  It will accept one parameter - the team name.'
					            										});
				            											
				            										// If false
				            											
				            											// Output invalid/name already taken message
				            								// If false
				            									
				            									// Output missing parameter message and list of valid parameters
		            						// If false
				            					
			            						// Output tournament doesn't exist or invalid channel message - tell player to look for the register channel
					            		break;
					            		
			            			case "decline":
			            				bot.sendMessage({
			            					to: channelID,
			            					message: 'This operation will decline an invitation that has been sent to you to join a team.'
			            				});
			            				break;
		            				
			            			case "display":
			            				bot.sendMessage({
			            					to: channelID,
			            					message: 'This operation will display a list of members who are part of a selected team, along with their role on the team.'
			            				});
			            				break;
			            				
		            				// This command may be deprecated later in favor of adding an operation for each individual property
			            			case "edit":
			            				bot.sendMessage({
			            					to: channelID,
			            					message: 'This operation will let you edit the properties of a selected team.'
			            				});
			            				break;
			            				
			            			case "escape":
			            				bot.sendMessage({
			            					to: channelID,
			            					message: 'This operation will deselect the team you have selected.'
			            				});
			            				break;
			            				
			            			case "invite":
			            				bot.sendMessage({
			            					to: channelID,
			            					message: 'This operation will send an invite to a player to join a team.'
			            				});
			            				break;
			            				
			            			case "kick":
			            				bot.sendMessage({
			            					to: channelID,
			            					message: 'This operation will remove a player from the selected team.'
			            				});
			            				break;
			            				
			            			case "leave":
			            				bot.sendMessage({
			            					to: channelID,
			            					message: 'This operation will remove you from your team.'
			            				});
			            				break;
			            				
			            			case "register":
			            				bot.sendMessage({
			            					to: channelID,
			            					message: 'This operation will register a selected team for an event.'
			            				});
			            				break;
			            				
			            			case "select":
			            				bot.sendMessage({
			            					to: channelID,
			            					message: 'This operation will select a team, allowing you to perform more specific operations on that team.'
			            				});
			            				break;
			            				
			            			case "unregister":
			            				bot.sendMessage({
			            					to: channelID,
			            					message: 'This operation will unregister your team from an event.'
			            				});
			            				break;
				            		
				            		default:
				            			bot.sendMessage({
				            				to: channelID,
				            				message: 'Not a valid "' + cmdCategory + '" operation; valid operations include: `accept`, `add`, `cancel`, `create`, `decline`, `display`, `edit`, `escape`, `invite`, `leave`, `remove`, `register`, `select`, `unregister`'
				            			});
		            			}          		
	            			}
			            	else {
			            		bot.sendMessage({
			            			to: channelID, 
			            			message: '`' + cmdCategory + '` what?  Do you need `help`?'
			            		});
			            	}
		            		break;
		            		
			            case "test":
			            	if (cmdOperation != null) {
			            		switch(cmdOperation.toLowerCase()) {
			            			case "args":
			            				bot.sendMessage({
			            					to: channelID,
			            					message: 	'user =      ' + user + '\n' +
			            								'userID =    ' + userID + '\n' +
			            								'channelID = ' + channelID + '\n' +
			            								'message =   ' + message + '\n' +
			            								'evt =       ' + evt
			            				});
			            				break;
			            				
			            			case "serverProps":
			            				bot.sendMessage({
			            					to: channelID,
			            					message: 	'Server name     = ' + bot.name + '\n' +
			            								'Server ID       = ' + bot.id + '\n' +
			            								'Server owner ID = ' + bot.owner_id + '\n' +
			            								'Server roles    = ' + bot.roles + '\n' +
			            								'Server channels = ' + bot.channels
			            				});
			            				break;
			            		}
			            	}
			            	else {
			            		bot.sendMessage({
			            			to: channelID, 
			            			message: '`' + cmdCategory + '` what?  Do you need `help`?'
			            		});
			            	}
			            	break;
			            	
			            default:
			            	bot.sendMessage({
			            		to: channelID,
			            		message: 'Not a valid category; for a list of valid command categories, type `!tc help`'
			            	})
			            

		        	}
		        }
		        else {
		        	bot.sendMessage({
		        		to: channelID,
		        		message: 'Not a valid command;  All commmands must start with "!tc";  For help, type `!tc help`'
		        	});
		        }
		     }
		}
);