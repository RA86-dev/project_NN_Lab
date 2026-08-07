/* eslint-disable react-refresh/only-export-components */
import { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";

import "./App.css";
import "./index.css";

const FILE_INDEX_KEY = "data_stored";
const HIDDEN_DEFAULTS_KEY = "deleted_default_items";

function readFiles() {
  try {
    const stored = JSON.parse(localStorage.getItem(FILE_INDEX_KEY) ?? "[]");
    if (!Array.isArray(stored)) return [];

    return stored.filter((file, index, files) =>
      typeof file?.localStorageName === "string"
      && file.localStorageName.trim()
      && files.findIndex((candidate) => candidate?.localStorageName === file.localStorageName) === index
    );
  } catch {
    return [];
  }
}

function countBlocks(value) {
  if (Array.isArray(value)) {
    return value.reduce((total, item) => total + countBlocks(item), 0);
  }
  if (!value || typeof value !== "object") return 0;

  const current = typeof value.type === "string" ? 1 : 0;
  return current + Object.values(value).reduce(
    (total, item) => total + countBlocks(item),
    0,
  );
}

function describeFile(file) {
  const name = file.localStorageName;
  const raw = localStorage.getItem(name);

  if (!raw) return { ...file, blockCount: 0, size: 0, isMissing: true };

  try {
    return {
      ...file,
      blockCount: countBlocks(JSON.parse(raw)),
      size: new Blob([raw]).size,
      isMissing: false,
    };
  } catch {
    return { ...file, blockCount: 0, size: new Blob([raw]).size, isMissing: true };
  }
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(bytes < 10240 ? 1 : 0)} KB`;
}

function Icon({ name }) {
  const paths = {
    file: <><path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v5h5" /></>,
    search: <><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></>,
    download: <><path d="M12 3v12m-5-5 5 5 5-5" /><path d="M5 20h14" /></>,
    trash: <><path d="M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7" /><path d="M10 11v6m4-6v6" /></>,
  };

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function FileManager() {
  const [files, setFiles] = useState(readFiles);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  const visibleFiles = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return files
      .map(describeFile)
      .filter((file) => file.localStorageName.toLocaleLowerCase().includes(normalizedQuery));
  }, [files, query]);

  function openFile(name) {
    window.location.assign(`./?project=${encodeURIComponent(name)}`);
  }

  function exportFile(name) {
    const raw = localStorage.getItem(name);
    if (!raw) {
      setMessage(`${name} has no readable project data.`);
      return;
    }

    const url = URL.createObjectURL(new Blob([raw], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${name.replace(/[^a-z0-9_-]+/gi, "-") || "project"}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage(`Exported ${name}.`);
  }

  function deleteFile(name) {
    if (!window.confirm(`Delete “${name}”? This cannot be undone.`)) return;

    const nextFiles = files.filter((file) => file.localStorageName !== name);
    localStorage.removeItem(name);
    localStorage.setItem(FILE_INDEX_KEY, JSON.stringify(nextFiles));

    if (name === "MNIST Template Project") {
      const hiddenDefaults = new Set(JSON.parse(localStorage.getItem(HIDDEN_DEFAULTS_KEY) ?? "[]"));
      hiddenDefaults.add(name);
      localStorage.setItem(HIDDEN_DEFAULTS_KEY, JSON.stringify([...hiddenDefaults]));
    }

    setFiles(nextFiles);
    setMessage(`Deleted ${name}.`);
  }

  return (
    <div className="fileManagerShell">
      <header className="appHeader">
        <div className="brandCopy">
          <strong>Neural Network Lab</strong>
          <span>Local project storage</span>
        </div>
        <nav className="managerNav" aria-label="Primary navigation">
          <a href="./">Playground</a>
          <a href="./fileManager.html" aria-current="page">File Manager</a>
          <a href="https://github.com/RA86-dev/Project_NN_Lab" target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </header>

      <main className="fileManagerMain">
        <section className="fileManagerHeading">
          <div>
            <p className="eyebrow">Project Management</p>
            <h1>Your saved projects</h1>
            <p>Open, export, or permanently remove projects stored in this browser.</p>
          </div>
          <span className="fileCount">{files.length} {files.length === 1 ? "project" : "projects"}</span>
        </section>

        <section className="fileManagerPanel">
          <label className="fileSearch">
            <Icon name="search" />
            <span className="visuallyHidden">Search projects</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search saved projects…" />
          </label>

          {message && <p className="fileManagerMessage" role="status">{message}</p>}

          {visibleFiles.length > 0 ? (
            <div className="detailedFileList">
              {visibleFiles.map((file) => (
                <article className="detailedFile" key={file.localStorageName}>
                  <span className="detailedFileIcon"><Icon name="file" /></span>
                  <div className="detailedFileInfo">
                    <strong>{file.localStorageName}</strong>
                    <span>{file.isMissing ? "Unreadable project data" : `${file.blockCount} blocks · ${formatSize(file.size)}`}</span>
                  </div>
                  <div className="detailedFileActions">
                    <button type="button" onClick={() => openFile(file.localStorageName)} disabled={file.isMissing}>Open</button>
                    <button type="button" className="iconButton" onClick={() => exportFile(file.localStorageName)} disabled={file.isMissing} aria-label={`Export ${file.localStorageName}`} title="Export JSON"><Icon name="download" /></button>
                    <button type="button" className="iconButton dangerButton" onClick={() => deleteFile(file.localStorageName)} aria-label={`Delete ${file.localStorageName}`} title="Delete project"><Icon name="trash" /></button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="fileManagerEmpty">
              <span><Icon name="file" /></span>
              <strong>{query ? "No matching projects" : "No saved projects"}</strong>
              <p>{query ? "Try a different search." : "Save a canvas in the Playground and it will appear here."}</p>
              {!query && <a href="./">Go to Playground</a>}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <FileManager />
  </StrictMode>,
);
