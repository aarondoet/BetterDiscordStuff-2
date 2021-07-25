/**
 * @name SendTimestamps
 * @author Taimoor
 * @authorId 220161488516546561
 * @version 1.0.0
 * @description Use Discord's latest feature of using timestamps in your messages easily.
 * @authorLink https://github.com/Taimoor-Tariq
 * @source https://raw.githubusercontent.com/Taimoor-Tariq/BetterDiscordStuff/main/Plugins/SendTimestamps/SendTimestamps.plugin.js
 * @updateUrl https://raw.githubusercontent.com/Taimoor-Tariq/BetterDiscordStuff/main/Plugins/SendTimestamps/SendTimestamps.plugin.js
 */
/*@cc_on
@if (@_jscript)
    
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
    var pathSelf = WScript.ScriptFullName;
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();

@else@*/

module.exports = (() => {
    const config = {
        "info": {
            "name":"Send Timestamps",
            "authors": [
                {
                    "name": "Taimoor",
                    "discord_id": "220161488516546561",
                    "github_username": "Taimoor-Tariq"
                }
            ],
            "version": "1.0.0",
            "description": "Use Discord's latest feature of using timestamps in your messages easily.",
            "github": "https://github.com/Taimoor-Tariq/BetterDiscordStuff/blob/main/Plugins/SendTimestamps/SendTimestamps.plugin.js",
            "github_raw": "https://raw.githubusercontent.com/Taimoor-Tariq/BetterDiscordStuff/main/Plugins/SendTimestamps/SendTimestamps.plugin.js"
        }
    };

    return !global.ZeresPluginLibrary ? class {
        constructor() {this._config = config;}
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {
            BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                    });
                }
            });
        }
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Library) => {
    const
        css = `.timestamp-button button {
	min-height: 32px; min-width: 32px;
	margin-left: 0px;
}

.timestamp-button svg { width: 28px; height: 28px; }

.timestamp-button path { fill: var(--interactive-normal); }
.timestamp-button:hover path { fill: var(--interactive-hover); }`,
        buttonHTML = `<div class="buttonContainer-28fw2U timestamp-button">
    <button tabindex="0" aria-label="Enter timestamp" type="button" class="button-318s1X button-38aScr lookBlank-3eh9lL colorBrand-3pXr91 grow-q77ONN">
        <svg role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path fill="currentColor" d="M256,8C119,8,8,119,8,256S119,504,256,504,504,393,504,256,393,8,256,8Zm92.49,313h0l-20,25a16,16,0,0,1-22.49,2.5h0l-67-49.72a40,40,0,0,1-15-31.23V112a16,16,0,0,1,16-16h32a16,16,0,0,1,16,16V256l58,42.5A16,16,0,0,1,348.49,321Z"></path>
        </svg>
    </button>
</div>`,
        {DiscordSelectors, PluginUtilities, DOMTools, Modals, WebpackModules} = Api,
        {Logger} = Library;

    return class SendTimestamp extends Plugin {
        onStart() {
            PluginUtilities.addStyle(this.getName(), css);
            if (document.querySelector("form")) this.addButton(document.querySelector("form"));
        }

        onStop() {
            const button = document.querySelector(".timestamp-button");
            if (button) button.remove();
            PluginUtilities.removeStyle(this.getName());
        }

        addButton(form) {
            if (form.querySelector(".timestamp-button")) return;
            const button = DOMTools.createElement(buttonHTML);
            form.querySelector(DiscordSelectors.Textarea.buttons).append(button);
        
            button.on("click", () => {
                const { FormItem } = BdApi.findModuleByProps("FormItem");
                const createUpdateWrapper = (Component, changeProp = "onChange") => props => {
                    const [value, setValue] = BdApi.React.useState(props["value"]);
                    return BdApi.React.createElement(Component, {
                        ...props,
                        ["value"]: value,
                        [changeProp]: value => {
                            if (typeof props[changeProp] === "function") props[changeProp](value);
                            setValue(value);
                        }
                    });
                };

                let inputDate = new Date(), inputTime = new Date(),
                    blank = BdApi.React.createElement(FormItem, { title: " " }),
                    dateInput = BdApi.React.createElement(FormItem, {
                        title: "Date",
                        children: [
                            BdApi.React.createElement(createUpdateWrapper(WebpackModules.getByDisplayName("DateInput"), "onSelect"), { onSelect: (date) => { inputDate = date._d } }),
                        ]
                    }),
                    timeInput = BdApi.React.createElement(FormItem, {
                        title: "Time",
                        children: [
                            BdApi.React.createElement(createUpdateWrapper(WebpackModules.getByDisplayName("TimeInput")), { onChange: (time) => { inputTime = time._d } })
                        ]
                    });

                Modals.showModal( "Enter Time", [ dateInput, blank, timeInput ], {
                    confirmText: "Enter",
                    onConfirm: () => {
                        let timestamp = new Date();

                        timestamp.setDate(inputDate.getDate());
                        timestamp.setMonth(inputDate.getMonth());
                        timestamp.setFullYear(inputDate.getFullYear());

                        timestamp.setHours(inputTime.getHours());
                        timestamp.setMinutes(inputTime.getMinutes());
                        timestamp.setSeconds(0);
                    
                        BdApi.findModuleByProps("ComponentDispatch").ComponentDispatch.dispatchToLastSubscribed(BdApi.findModuleByProps("ComponentActions").ComponentActions.INSERT_TEXT, {content: `<t:${Math.floor(timestamp.getTime()/1000)}> `});
                    }
                });
            });
        }

        observer(e) {
            if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element)) return;
            if (e.addedNodes[0].querySelector(DiscordSelectors.Textarea.inner)) {
                this.addButton(e.addedNodes[0]);
            }
        }
    };

};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/