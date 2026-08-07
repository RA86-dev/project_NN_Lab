/* eslint-disable react-refresh/only-export-components */
import { useRef, useState } from "react";
import * as Blockly from "blockly";

const DEFAULT_FILE_NAME = "neural_network_model.json";

function parseWorkspaceJSON(code) {
  const data = typeof code === "string" ? JSON.parse(code) : code;
  if (!data || typeof data !== "object" || Array.isArray(data)) {throw new TypeError("The selected file does not contain a Blockly workspace.");}
  return data;
}

export function saveCurrentCodeAsJSON(workspace, fileName = DEFAULT_FILE_NAME) {
  if (!workspace) return null;
  const data = Blockly.serialization.workspaces.save(workspace);
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName.toLowerCase().endsWith(".json")
    ? fileName
    : `${fileName}.json`;
  link.hidden = true;
  document.body.appendChild(link);
  link.click();
  link.remove();

  // Waiting until the click has been handled avoids cancelled downloads in
  // browsers that do not consume object URLs synchronously.
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
  return data;
}

export function loadFile(workspace, code) {
  if (!workspace || code == null) return null;

  const data = parseWorkspaceJSON(code);
  Blockly.serialization.workspaces.load(data, workspace);
  return data;
}

export async function loadJSONFile(workspace, file) {
  if (!workspace || !file) return null;

  const contents = await file.text();
  return loadFile(workspace, contents);
}

function TransferIcon({ direction }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v12" />
      {direction === "down"
        ? <path d="m7 10 5 5 5-5M5 20h14" />
        : <path d="m7 8 5-5 5 5M5 20h14" />}
    </svg>
  );
}

export function ExportImport({ workspace }) {
  const fileInput = useRef(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  function exportWorkspace() {
    try {
      saveCurrentCodeAsJSON(workspace);
      setIsError(false);
      setMessage("Project exported.");
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Could not export this project.");
    }
  }

  async function importWorkspace(event) {
    const input = event.currentTarget;
    const [file] = input.files ?? [];
    if (!file) return;

    try {
      await loadJSONFile(workspace, file);
      setIsError(false);
      setMessage(`Imported ${file.name}.`);
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Could not import this project.");
    } finally {
      // Allow choosing the same file again after fixing or changing it.
      input.value = "";
    }
  }

  return (
    <div className="exportImport">
      <div className="subsectionHeader"><span>Transfer project</span></div>
      <div className="transferActions">
        <button type="button" onClick={exportWorkspace} disabled={!workspace}>
          <TransferIcon direction="up" /> Export JSON
        </button>
        <button type="button" onClick={() => fileInput.current?.click()} disabled={!workspace}>
          <TransferIcon direction="down" /> Import JSON
        </button>
        <input
          ref={fileInput}
          className="visuallyHidden"
          type="file"
          accept=".json,application/json"
          onChange={importWorkspace}
          tabIndex={-1}
        />
      </div>
      {message && (
        <p className={isError ? "transferMessage isError" : "transferMessage"} role="status">
          {message}
        </p>
      )}
    </div>
  );
}
