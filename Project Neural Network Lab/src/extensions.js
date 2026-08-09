export const ExtensionRegistry = {
    compileBlockRules: [],
    compileCodeRules: [],
    compileBlock(block) {
        const extensionBlock = {
            ...block,
            getFieldValue(name) {
                return block?.fields?.[name] ?? null;
            },
        };
        for (const rule of this.compileBlockRules) {
            const result = rule(extensionBlock);
            if (result) return result;
        }
        return null
    },
    compileCode(node, firstInputShape) {
        for (const rule of this.compileCodeRules) {
            const result = rule(node, firstInputShape);
            if (result) return result;
        }
        return null
    }
}
export async function registerExtension(inputJSCode, Blockly, workspace) {
    let confirmation = confirm("Warning! Importing Extensions that you don't know what content has inside is very dangerous! Are you sure you want to import this extension")
    if (!confirmation) { return null; } // If they don't like the extension, return nothing to signify that there is nothing in the extension
    try {
        let encodedJS = encodeURIComponent(inputJSCode);
        console.log(`Converted code into string! ${encodedJS}`);
        let dataURI = `data:text/javascript;charset=utf-8, ${encodedJS}`
        const extensionModule = await import(/* @vite-ignore */ dataURI);
        const extension = extensionModule.default;
        if (!extension || !extension.id) {throw new Error("Invalid Extension Format! Missing default export or ID.")}
        if (typeof extension.registerBlocks === "function") {
            extension.registerBlocks(Blockly);
        }
        if (typeof extension.compileBlock === "function") {
            ExtensionRegistry.compileBlockRules.push(extension.compileBlock);
        }
        if (typeof extension.compileCode === "function") {
            ExtensionRegistry.compileCodeRules.push(extension.compileCode);
        }
        if (workspace && extension.toolboxItems) {
            const toolboxDef = workspace.options.languageTree;
            let extensionCategory = toolboxDef.contents.find(
                (cat) => cat.name === "extensions"
            )
            if (extensionCategory) {
                extensionCategory.contents.push(...extension.toolboxItems)
            } else {
                toolboxDef.contents.push({
                    kind: "category",
                    name: "Extensions",
                    colour: "#e06c75",
                    contents: [...extension.toolboxItems]
                })
            }
            workspace.updateToolbox(toolboxDef)
        }
        return true;
    } catch (error) {
        return false;
    }


}
