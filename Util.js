exports.whitelistConfig = function(userID) {
	var isUserWhitelisted = false;

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
	
	return isUserWhitelisted;
	
}

exports.blacklistConfig = function(userID) {
	var isUserBlacklisted = false;
	
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
	
	return isUserBlacklisted;
}

exports.whitelistEvent = function(userID) {
	var isUserWhitelisted = false;

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
	
	return isUserWhitelisted;
}

exports.blacklistEvent = function(userID) {
	var isUserBlacklisted = false;
	
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
	
	return isUserBlacklisted;	
}

exports.whitelistPermissions = function(userID) {
	var isUserWhitelisted;
	
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
	
	return isUserWhitelisted;
}

exports.blacklistPermissions = function(userID) {
	var isUserBlacklisted = false;
	
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
	
	return isUserBlacklisted;
}

exports.whitelistTeam = function(userID) {
	var isUserWhitelisted;
	
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
	
	return isUserWhitelisted;
}

exports.blacklistTeam = function(userID) {
	var isUserBlacklisted = false;
	
	for (i = 0; i < server.members[userID].roles.length; i++) {
		for (j = 0; j < gatekeeper.team.blacklist.length; j++) {
			if(server.members[userID].roles[i] == gatekeeper.team.blacklist[j]) {
				isUserBlacklisted = true;
				break;
			}
		}
		if (isUserBlacklisted) {
			break;
		}
	}
	
	return isUserBlacklisted;	
}