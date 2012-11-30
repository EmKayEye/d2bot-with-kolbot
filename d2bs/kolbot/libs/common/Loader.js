/**
*	@filename	Loader.js
*	@author		kolton
*	@desc		script loader, based on mBot's Sequencer.js
*/

var global = this;

var Loader = {
	scriptList: [],
	printToOOG: false,
	screenshotErrors: false,

	init: function () {
		this.getScripts();
		this.loadScripts();
	},

	getScripts: function () {
		var i,
			fileList = dopen("libs/bots/").getFiles();

		for (i = 0; i < fileList.length; i += 1) {
			if (fileList[i].indexOf(".js") > -1) {
				this.scriptList.push(fileList[i].substring(0, fileList[i].indexOf(".js")));
			}
		}
	},

	loadScripts: function () {
		var i, townCheck;

		if (!this.scriptList.length) {
			showConsole();

			throw new Error("You don't have any valid scripts in bots folder.");
		}

ScriptLoop:
		for (i in Scripts) {
			if (Scripts.hasOwnProperty(i) && this.scriptList.indexOf(i) > -1 && Scripts[i]) {
				include("bots/" + i + ".js");

				if (typeof (global[i]) === "function") {
					if (i !== "Test" && i !== "Follower") {
						try {
							townCheck = Town.goToTown();
						} catch (e1) {
							print("�c1Loader: Failed to go to town, skipping to next script.");
						}
					} else {
						townCheck = true;
					}

					if (townCheck) {
						try {
							print("�c2Starting script: �c9" + i);
							global[i]();
						} catch (e) {
							if (this.printToOOG) {
								D2Bot.printToConsole(e.message + " in " + e.fileName.substring(e.fileName.lastIndexOf("\\") + 1, e.fileName.length) + " line " + e.lineNumber + ". Ping:" + me.ping + ";9");
							}

							Misc.errorReport("�c1Error in �c0" + i + " �c1(" + e.fileName.substring(e.fileName.lastIndexOf("\\") + 1, e.fileName.length) + " line �c1" + e.lineNumber + "): �c1" + e.message);

							if (this.screenshotErrors) {
								takeScreenshot();
								delay(500);
							}
						}
					}
				} else {
					print("�c1Loader: Error in script, skipping;");
				}
			}
		}
	}
};