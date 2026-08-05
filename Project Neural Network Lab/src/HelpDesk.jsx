/* eslint-disable react-refresh/only-export-components */
import * as Blockly from "blockly";
import { definitions } from "./definitions";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { ExportImport } from "./Export_Import";

function Icon({ name }) {
  const paths = {
    save: <><path d="M5 4h12l2 2v14H5V4Z" /><path d="M8 4v6h8V4M8 20v-6h8v6" /></>,
    file: <><path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v5h5" /></>,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9.8 9a2.3 2.3 0 1 1 3.3 2.1c-.8.4-1.1.9-1.1 1.7M12 16.5v.1" /></>,
  };
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function loadList() {
  const rawData = localStorage.getItem("data_stored");
  if (rawData == null) return [];

  try {
    return JSON.parse(rawData);
  } catch {
    return [];
  }
}

export function getCurrentCode(workspace) {
  if (!workspace) return null;
  return Blockly.serialization.workspaces.save(workspace);
}

function loadFile(localStorageName, workspace) {
  const rawData = localStorage.getItem(localStorageName);
  if (!rawData || !workspace) return;
  Blockly.serialization.workspaces.load(JSON.parse(rawData), workspace);
}

function SavedFiles({ workspace, files }) {
  if (files.length === 0) {
    return (
      <div className="emptyFiles">
        <span><Icon name="file" /></span>
        <p>No saved projects yet</p>
        <small>Save this canvas to pick it up later.</small>
      </div>
    );
  }

  return (
    <div className="savedFileList">
      {files.map((file, index) => (
        <button type="button" key={`${file.localStorageName}-${index}`} onClick={() => loadFile(file.localStorageName, workspace)}>
          <span><Icon name="file" /></span>
          <span>{file.localStorageName}</span>
          <small>Open</small>
        </button>
      ))}
    </div>
  );
}

export function HelpDesk({ workspace }) {
  const [selectedDefinition, setSelectedDefinition] = useState("");
  const [fileName, setFileName] = useState("");
  const [files, setFiles] = useState(loadList);

  useEffect(() => {
    if (!workspace) return undefined;

    function handleWorkspaceChange(event) {
      if (event.type !== Blockly.Events.CLICK || !event.blockId) return;
      const block = workspace.getBlockById(event.blockId);
      if (!block) return;

      setSelectedDefinition(
        definitions[block.type]?.replace(/^[ \t]{4}/gm, "").trim()
        ?? `No help is available for ${block.type}.`,
      );
    }

    workspace.addChangeListener(handleWorkspaceChange);
    return () => workspace.removeChangeListener(handleWorkspaceChange);
  }, [workspace]);

  function saveFile(event) {
    event.preventDefault();
    const trimmedName = fileName.trim();
    if (!trimmedName || !workspace) return;

    const currentList = loadList().filter((file) => file.localStorageName !== trimmedName);
    const nextList = [...currentList, { localStorageName: trimmedName }];
    localStorage.setItem(trimmedName, JSON.stringify(getCurrentCode(workspace)));
    localStorage.setItem("data_stored", JSON.stringify(nextList));
    setFiles(nextList);
    setFileName("");
  }

  return (
    <aside className="toolsHelpDesk">
      <div className="sectionHeading">
        <div>
          <p className="eyebrow">Project Management</p>
          <h2>Files & reference</h2>
        </div>
      </div>

      <form className="saveForm" onSubmit={saveFile}>
        <label htmlFor="nameFile">Save this canvas</label>
        <div>
          <input type="text" id="nameFile" value={fileName} onChange={(event) => setFileName(event.target.value)} placeholder="e.g. Digit classifier" />
          <button type="submit" disabled={!workspace || !fileName.trim()}><Icon name="save" /> Save</button>
        </div>
      </form>

      <div className="subsectionHeader"><span>Saved projects</span><small>{files.length}</small></div>
      <SavedFiles workspace={workspace} files={files} />

      <ExportImport workspace={workspace} />

      <div className="helpSection">
        <div className="subsectionHeader"><span><Icon name="help" /> Block reference</span></div>
        <p className="helpHint">Select any block on the canvas to view its notes.</p>
        <div className={`blockDefinition ${selectedDefinition ? "hasSelection" : ""}`}>
          <Markdown>{selectedDefinition || "Nothing selected yet."}</Markdown>
        </div>
      </div>
    </aside>
  );
}
