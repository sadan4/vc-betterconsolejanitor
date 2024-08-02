/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 sadan
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";

const DONT_LOG = new Set<string>();
const settings = definePluginSettings({
    dontLog: {
        type: OptionType.STRING,
        description: "strings of loggers, broken by semicolons",
        onChange(){
            settings.store.dontLog?.split(";").forEach(e => DONT_LOG.add(e));
        }
    },
    disableALL: {
        description: "disables all of discord logging. \n**NOT RECCOMENDED**",
        type: OptionType.BOOLEAN,
        default: false
    }
});
export default definePlugin({
    authors: [{
        id: 521819891141967883n,
        name: "sadan"
    }],
    settings,
    name: "BetterConsoleJanitor",
    description: "patches things that console janitor doesnt",
    start(){
        settings.store.dontLog?.split(";").forEach(e => DONT_LOG.add(e));
    },
    patches: [
        {
            find: "Σ:",
            replacement: {
                match: /(&&)(console)/,
                replace: "$1$self.shouldLog(arguments[0])&&$2"
            }
        }
    ],
    shouldLog(logger: string){
        return settings.store.disableALL ? false : !DONT_LOG.has(logger);
    }
});
