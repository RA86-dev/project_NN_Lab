/* eslint-disable react-refresh/only-export-components */
import * as Blockly from "blockly";
import { useEffect, useRef, useState } from "react";
import { ExportImport } from "./Export_Import";
import { registerExtension } from "./extensions";

function Icon({ name, direction }) {
  const paths = {
    save: (
      <>
        <path d="M5 4h12l2 2v14H5V4Z" />
        <path d="M8 4v6h8V4M8 20v-6h8v6" />
      </>
    ),
    file: (
      <>
        <path d="M6 3h8l4 4v14H6V3Z" />
        <path d="M14 3v5h5" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.8 9a2.3 2.3 0 1 1 3.3 2.1c-.8.4-1.1.9-1.1 1.7M12 16.5v.1" />
      </>
    ),
    import: (
      <>
        <path d="M12 3v12M8 11l4 4 4-4" />
        <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
      </>
    ),
  };
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] ?? paths.file}
    </svg>
  );
}

export function loadList() {
  const rawData = localStorage.getItem("data_stored");
  if (rawData == null) return [];

  try {
    return JSON.parse(rawData);
  } catch {
    return [];
  }
}

const MNIST_1 = {
  blocks: {
    languageVersion: 0,
    blocks: [
      {
        type: "main_program",
        id: "qagL)GfXE6?Fv,tl7PoL",
        x: 60,
        y: 60,
        inputs: {
          STACK: {
            block: {
              type: "train_model",
              id: "38b8TjJ4w.!bF*J$!|6r",
              fields: {
                EPOCHS: 15,
                OPTIMIZER: "adam",
                LOSS_FUNCTION: "categoricalCrossentropy",
              },
              inputs: {
                MODEL: {
                  block: {
                    type: "sequential_neural_network",
                    id: "MVZ{qWoW{HU_:)ME^viH",
                    fields: {
                      MODEL_NAME: "Model1",
                    },
                    inputs: {
                      LAYERS: {
                        block: {
                          type: "conv2d_layer",
                          id: "CmceI|~%K0Jmkxc@{33t",
                          fields: {
                            FILTERS: 32,
                            KERNEL_SIZE: 3,
                            STRIDES: 1,
                            PADDING: "same",
                            ACTIVATION: "relu",
                          },
                          next: {
                            block: {
                              type: "max_pooling2d_layer",
                              id: "Ir}`)/99Nbbqx}{Hnx$8",
                              fields: {
                                POOL_SIZE: 2,
                                STRIDES: 2,
                              },
                              next: {
                                block: {
                                  type: "flatten_layer",
                                  id: "L_/EBDu[Rx$7:4#3IH|#",
                                  next: {
                                    block: {
                                      type: "dense_layer",
                                      id: "k;$L=D4!}=1?`0:b@=zT",
                                      fields: {
                                        UNITS: 128,
                                        ACTIVATION: "elu",
                                      },
                                      next: {
                                        block: {
                                          type: "dense_layer",
                                          id: "@Hu:FapsE^CKs3=aEZ19",
                                          fields: {
                                            UNITS: 128,
                                            ACTIVATION: "elu",
                                          },
                                          next: {
                                            block: {
                                              type: "dense_layer",
                                              id: "{S;fQNk8OM6mWQ!U:`][",
                                              fields: {
                                                UNITS: 10,
                                                ACTIVATION: "softmax",
                                              },
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                DATASET: {
                  block: {
                    type: "mnist_dataset",
                    id: "O;Re}UMhos!Ol@w^68#w",
                    fields: {
                      Classes: 10,
                      NORMALIZE: true,
                      Split: "TRAINING",
                      DATASET_SIZE: 3000,
                    },
                  },
                },
              },
              next: {
                block: {
                  type: "mnist_inference_model",
                  id: "?q(8THFqrot}#?%jQ^kw",
                  fields: {
                    MODEL_ID: "Model1",
                  },
                },
              },
            },
          },
        },
      },
    ],
  },
};

export function addDefaultItems() {
  const currentList = loadList();
  const hiddenDefaults = JSON.parse(
    localStorage.getItem("deleted_default_items") ?? "[]"
  );
  const uniqueList = currentList.filter(
    (file, index, files) =>
      file?.localStorageName &&
      files.findIndex(
        (candidate) => candidate?.localStorageName === file.localStorageName
      ) === index
  );
  if (
    !hiddenDefaults.includes("MNIST Template Project") &&
    !uniqueList.some((file) => file.localStorageName === "MNIST Template Project")
  ) {
    localStorage.setItem("MNIST Template Project", JSON.stringify(MNIST_1));
    uniqueList.push({ localStorageName: "MNIST Template Project" });
  }
  localStorage.setItem("data_stored", JSON.stringify(uniqueList));
  return uniqueList;
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
        <span>
          <Icon name="file" />
        </span>
        <p>No saved projects yet</p>
        <small>Save this canvas to pick it up later.</small>
      </div>
    );
  }

  return (
    <div className="savedFileList">
      {files.map((file, index) => (
        <button
          type="button"
          key={`${file.localStorageName}-${index}`}
          onClick={() => loadFile(file.localStorageName, workspace)}
        >
          <span>
            <Icon name="file" />
          </span>
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
  const [files, setFiles] = useState(addDefaultItems);
  const jsImportRef = useRef(null);

  useEffect(() => {
    if (!workspace) return undefined;

    function handleWorkspaceChange(event) {
      if (event.type !== Blockly.Events.CLICK || !event.blockId) return;
      const block = workspace.getBlockById(event.blockId);
      if (!block) return;

      setSelectedDefinition(
        definitions[block.type]?.replace(/^[ \t]{4}/gm, "").trim() ??
          `No help is available for ${block.type}.`
      );
    }

    workspace.addChangeListener(handleWorkspaceChange);
    return () => workspace.removeChangeListener(handleWorkspaceChange);
  }, [workspace]);

  async function handleImportJS(event) {
    const input = event.currentTarget;
    const [file] = input.files ?? [];
    if (!file) return;

    try {
      const codeText = await file.text();
      const success = await registerExtension(codeText, Blockly, workspace);
      if (success) {
        alert(`Successfully imported extension: ${file.name}`);
      }
    } catch (error) {
      console.error("Failed to load extension file:", error);
      alert(`Error reading extension: ${error.message}`);
    } finally {
      input.value = "";
    }
  }

  function saveFile(event) {
    event.preventDefault();
    const trimmedName = fileName.trim();
    if (!trimmedName || !workspace) return;

    const currentList = loadList().filter(
      (file) => file.localStorageName !== trimmedName
    );
    const nextList = [...currentList, { localStorageName: trimmedName }];
    localStorage.setItem(
      trimmedName,
      JSON.stringify(getCurrentCode(workspace))
    );
    localStorage.setItem("data_stored", JSON.stringify(nextList));
    if (trimmedName === "MNIST Template Project") {
      const hiddenDefaults = JSON.parse(
        localStorage.getItem("deleted_default_items") ?? "[]"
      );
      localStorage.setItem(
        "deleted_default_items",
        JSON.stringify(
          hiddenDefaults.filter((name) => name !== trimmedName)
        )
      );
    }
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
          <input
            type="text"
            id="nameFile"
            value={fileName}
            onChange={(event) => setFileName(event.target.value)}
            placeholder="e.g. Digit classifier"
          />
          <button
            type="submit"
            disabled={!workspace || !fileName.trim()}
          >
            <Icon name="save" /> Save
          </button>
        </div>
      </form>

      <div className="subsectionHeader">
        <span>Saved projects</span>
        <small>{files.length}</small>
      </div>
      <SavedFiles workspace={workspace} files={files} />

      <ExportImport workspace={workspace} />

      <div className="extensionImport">
        <div className="extensionImportHeader">
          <span className="extensionImportIcon">
            <Icon name="import" />
          </span>
          <div>
            <span className="extensionImportTitle">Add an extension</span>
            <p>Load custom blocks and model features from a JavaScript file.</p>
          </div>
          <span className="extensionFileType">.JS</span>
        </div>
        <input
          ref={jsImportRef}
          className="visuallyHidden"
          type="file"
          accept=".js"
          onChange={handleImportJS}
          tabIndex={-1}
        />
        <button
          type="button"
          className="extensionImportButton"
          onClick={() => jsImportRef.current?.click()}
          disabled={!workspace}
        >
          <Icon name="import" />
          <span>Import JS extension</span>
          <small>Choose file</small>
        </button>
        <p className="extensionImportNote">Only import extensions from sources you trust.</p>
      </div>

    </aside>
  );
}
