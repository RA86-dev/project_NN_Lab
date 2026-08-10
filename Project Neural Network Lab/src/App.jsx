import { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly";
import * as tf from "@tensorflow/tfjs";
import ModernTheme from '@blockly/theme-modern';
import Chart from "chart.js/auto";
import '@tensorflow/tfjs-backend-webgpu'
import '@tensorflow/tfjs-backend-webgl'
import "./App.css";
import { HelpDesk } from "./HelpDesk";


import { toolbox } from "./ToolBox";
import { Interpreter } from "./compiler";

function Icon({ name, size = 18 }) {
  const paths = {
    play: <path d="m8 5 11 7-11 7V5Z" />,
    blocks: <><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><path d="M16.5 14v5M14 16.5h5" /></>,
    spark: <><path d="M12 3v3M12 18v3M3 12h3M18 12h3" /><circle cx="12" cy="12" r="3.5" /></>,
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function BlocklyEditor({ setWorkspace }) {
  const blocklyDiv = useRef(null);

  useEffect(() => {
    const workspace = Blockly.inject(blocklyDiv.current, {
      toolbox,
      trashcan: true,
      renderer: "thrasos",
      theme: ModernTheme,
      scrollbars: true,
      zoom: { controls: true, wheel: true, startScale: 0.9, maxScale: 1.6, minScale: 0.45 },
      grid: { spacing: 24, length: 2, colour: "#d8dee9", snap: true },
      move: { scrollbars: true, drag: true, wheel: true },
    });

    const closeFlyoutAfterInsert = (event) => {
      if (event.type === Blockly.Events.BLOCK_CREATE) {
        workspace.getToolbox()?.clearSelection();
      }
    };
    workspace.addChangeListener(closeFlyoutAfterInsert);

    const projectName = new URLSearchParams(window.location.search).get("project");
    const savedProject = projectName ? localStorage.getItem(projectName) : null;
    if (savedProject) {
      try {
        Blockly.serialization.workspaces.load(JSON.parse(savedProject), workspace);
        window.history.replaceState({}, "", window.location.pathname);
      } catch (error) {
        console.error(`Could not open saved project ${projectName}.`, error);
      }
    }

    setWorkspace(workspace);
    return () => {
      workspace.removeChangeListener(closeFlyoutAfterInsert);
      setWorkspace(null);
      workspace.dispose();
    };
  }, [setWorkspace]);

  return <div ref={blocklyDiv} className="blocklyEditor" />;
}

function formatLogPart(value) {
  if (typeof value === "string") return value;
  if (value instanceof Error) return value.message;

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function formatChartNumber(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "—";
  if (Math.abs(number) >= 1000) {
    return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 2 }).format(number);
  }
  if (Math.abs(number) > 0 && Math.abs(number) < 0.001) return number.toExponential(2);
  return new Intl.NumberFormat("en", { maximumFractionDigits: 4 }).format(number);
}

function usePrefersDarkMode() {
  const [isDark, setIsDark] = useState(() => window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event) => setIsDark(event.matches);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  return isDark;
}

function LossChart({ lossHistory }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const isDark = usePrefersDarkMode();

  useEffect(() => {
    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Training loss",
            data: [],
            borderColor: isDark ? "#60a5fa" : "#2563eb",
            backgroundColor: isDark ? "rgba(96, 165, 250, 0.08)" : "rgba(37, 99, 235, 0.06)",
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0.28,
            fill: true,
          },
          {
            label: "Validation loss",
            data: [],
            borderColor: isDark ? "#fb923c" : "#ea580c",
            borderDash: [5, 4],
            borderWidth: 1.5,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0.28,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        interaction: { intersect: false, mode: "index" },
        plugins: {
          legend: {
            display: true,
            align: "end",
            labels: { boxWidth: 16, boxHeight: 2, color: isDark ? "#a8b3c3" : "#667085", font: { size: 9 } },
          },
          tooltip: {
            displayColors: true,
            padding: 10,
            callbacks: {
              title: ([item]) => `Epoch ${item.label}`,
              label: (item) => `${item.dataset.label}: ${formatChartNumber(item.raw)}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: isDark ? "#8995a7" : "#7b8494", maxTicksLimit: 8 },
            title: { display: false },
          },
          y: {
            beginAtZero: true,
            border: { display: false },
            grid: { color: isDark ? "rgba(148, 163, 184, 0.12)" : "rgba(148, 163, 184, 0.18)" },
            ticks: {
              color: isDark ? "#8995a7" : "#7b8494",
              maxTicksLimit: 5,
              callback: (value) => formatChartNumber(value),
            },
            title: { display: false },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [isDark]);

  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.data.labels = lossHistory.map(({ epoch }) => epoch);
    chartRef.current.data.datasets[0].data = lossHistory.map(({ loss }) => loss);
    chartRef.current.data.datasets[1].data = lossHistory.map(({ valLoss }) => valLoss ?? null);
    chartRef.current.update("none");
  }, [lossHistory]);

  return (
    <div className="lossChart">
      {lossHistory.length === 0 && (
        <div className="chartPlaceholder">
          <span className="placeholderIcon"><Icon name="spark" /></span>
          <span>Your loss curve will appear here</span>
        </div>
      )}
      <canvas ref={canvasRef} role="img" aria-label="Training loss by epoch" />
    </div>
  );
}

function activationColor(value, maxMagnitude) {
  if (value == null) return "var(--heatmap-empty)";
  const strength = Math.min(Math.abs(value) / (maxMagnitude || 1), 1);
  const alpha = 0.12 + strength * 0.82;
  return value < 0
    ? `rgba(234, 88, 12, ${alpha})`
    : `rgba(37, 99, 235, ${alpha})`;
}

function ActivationHeatmap({ layers }) {
  const [selectedLayer, setSelectedLayer] = useState("");

  const layer = layers.find((item) => item.id === selectedLayer) ?? layers[0];
  const flatValues = layer?.values.flat().filter((value) => value != null) ?? [];
  const maxMagnitude = Math.max(...flatValues.map(Math.abs), 0);

  return (
    <div className="activationInspector">
      <div className="activationHeader">
        <div>
          <span className="inspectorTitle">Neuron activations</span>
          <small>A sample of 12 inputs × up to 24 neurons</small>
        </div>
        <label>
          <span>Layer</span>
          <select value={layer?.id ?? ""} onChange={(event) => setSelectedLayer(event.target.value)} disabled={!layers.length}>
            {!layers.length && <option>Run model first</option>}
            {layers.map((item, index) => (
              <option key={item.id} value={item.id}>Layer {index + 1} · {item.type}</option>
            ))}
          </select>
        </label>
      </div>

      {layer ? (
        <>
          <div className="heatmapMeta">
            <span>{layer.name}</span>
            <span>Output [{layer.outputShape.join(" × ")}]</span>
            <span>Showing {layer.values[0]?.length ?? 0} of {layer.totalNeurons}</span>
          </div>
          <div className="heatmapScroll">
            <div
              className="heatmapGrid"
              style={{ gridTemplateColumns: `repeat(${layer.values[0]?.length ?? 1}, minmax(10px, 1fr))` }}
              role="img"
              aria-label={`Activation heatmap for ${layer.name}`}
            >
              {layer.values.flatMap((row, rowIndex) => row.map((value, columnIndex) => (
                <span
                  key={`${rowIndex}-${columnIndex}`}
                  style={{ backgroundColor: activationColor(value, maxMagnitude) }}
                  title={`Sample ${rowIndex + 1}, neuron ${columnIndex + 1}: ${value == null ? "not finite" : value.toFixed(5)}`}
                />
              )))}
            </div>
          </div>
          <div className="heatmapLegend"><span>Low</span><i /><span>High</span></div>
        </>
      ) : (
        <div className="heatmapEmpty">
          <span className="placeholderIcon"><Icon name="spark" /></span>
          <span>Run your model to inspect its layers</span>
        </div>
      )}
    </div>
  );
}

function MnistPad({ onPredict, isPredicting }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);

  function clearCanvas() {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  useEffect(() => {
    clearCanvas();
  }, []);

  function pointFromEvent(event) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function startDrawing(event) {
    drawing.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    const context = canvasRef.current.getContext("2d");
    const point = pointFromEvent(event);
    context.beginPath();
    context.moveTo(point.x, point.y);
  }

  function draw(event) {
    if (!drawing.current) return;
    const context = canvasRef.current.getContext("2d");
    const point = pointFromEvent(event);
    context.strokeStyle = "#fff";
    context.lineWidth = 24;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineTo(point.x, point.y);
    context.stroke();
  }

  function finishDrawing() {
    drawing.current = false;
  }

  function extractPixels() {
    const source = canvasRef.current;
    const context = source.getContext("2d");
    const image = context.getImageData(0, 0, source.width, source.height);
    let left = source.width;
    let right = -1;
    let top = source.height;
    let bottom = -1;

    for (let y = 0; y < source.height; y += 1) {
      for (let x = 0; x < source.width; x += 1) {
        if (image.data[(y * source.width + x) * 4] > 18) {
          left = Math.min(left, x);
          right = Math.max(right, x);
          top = Math.min(top, y);
          bottom = Math.max(bottom, y);
        }
      }
    }

    if (right < left || bottom < top) return [];

    const target = document.createElement("canvas");
    target.width = 28;
    target.height = 28;
    const targetContext = target.getContext("2d");
    targetContext.fillStyle = "#000";
    targetContext.fillRect(0, 0, 28, 28);
    const width = right - left + 1;
    const height = bottom - top + 1;
    const scale = Math.min(20 / width, 20 / height);
    const drawWidth = width * scale;
    const drawHeight = height * scale;
    targetContext.drawImage(source, left, top, width, height, (28 - drawWidth) / 2, (28 - drawHeight) / 2, drawWidth, drawHeight);
    const pixels = targetContext.getImageData(0, 0, 28, 28).data;
    return Array.from({ length: 784 }, (_, index) => pixels[index * 4]);
  }

  return (
    <div className="mnistPad">
      <canvas
        ref={canvasRef}
        width="280"
        height="280"
        aria-label="Draw a digit from zero to nine"
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={finishDrawing}
        onPointerCancel={finishDrawing}
      />
      <div>
        <button type="button" className="secondaryButton" onClick={clearCanvas}>Clear</button>
        <button type="button" className="predictButton" disabled={isPredicting} onClick={() => onPredict(extractPixels())}>
          {isPredicting ? "Predicting…" : "Predict digit"}
        </button>
      </div>
    </div>
  );
}

function PredictionOutput({ output, classification }) {
  if (!output) return null;
  if (classification && output.length === 10) {
    const winner = output.indexOf(Math.max(...output));
    return (
      <div className="digitResult">
        <div className="predictedDigit"><span>Prediction</span><strong>{winner}</strong><small>{(output[winner] * 100).toFixed(1)}% confidence</small></div>
        <div className="probabilityList">
          {output.map((value, digit) => (
            <div key={digit}><span>{digit}</span><i><b style={{ width: `${Math.max(1, value * 100)}%` }} /></i><small>{(value * 100).toFixed(1)}%</small></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="numericPrediction">
      <span>Prediction</span>
      <strong>{output.length === 1 ? Number(output[0]).toFixed(6) : `[${output.map((value) => Number(value).toFixed(4)).join(", ")}]`}</strong>
    </div>
  );
}

function InferencePanel({ target, initialResult, predict }) {
  const [input, setInput] = useState("1");
  const [output, setOutput] = useState(null);
  const [error, setError] = useState("");
  const [isPredicting, setIsPredicting] = useState(false);

  async function run(values) {
    if (!target || !predict || isPredicting) return;
    setError("");
    setIsPredicting(true);
    try {
      setOutput(await predict(target.modelId, values));
    } catch (predictionError) {
      setError(formatLogPart(predictionError));
    } finally {
      setIsPredicting(false);
    }
  }

  if (!target) return null;
  const shownOutput = output ?? (initialResult?.modelId === target.modelId ? initialResult.output : null);
  const isMnist = target.mode === "mnist";
  const expected = target.metadata.inputShape.reduce((total, size) => total * size, 1);

  return (
    <div className="inferencePanel">
      <div className="inferenceHeading">
        <div><p className="eyebrow">Inference</p><h3>{isMnist ? "Draw a digit" : target.mode === "math" ? "Test an x value" : "Raw model input"}</h3></div>
        <span>{target.modelId}</span>
      </div>

      {isMnist ? (
        <MnistPad onPredict={run} isPredicting={isPredicting || !predict} />
      ) : (
        <form className="inferenceForm" onSubmit={(event) => {
          event.preventDefault();
          const values = input.trim().split(/[\s,]+/).filter(Boolean).map(Number);
          run(values);
        }}>
          <label htmlFor="inferenceInput">{target.mode === "math" ? "x value" : `Input values (${expected} required)`}</label>
          <div><input id="inferenceInput" value={input} onChange={(event) => setInput(event.target.value)} inputMode="decimal" placeholder={target.mode === "math" ? "e.g. 4.5" : "e.g. 0.2, 0.8"} /><button type="submit" disabled={isPredicting || !predict}>{isPredicting ? "Running…" : "Predict"}</button></div>
        </form>
      )}

      {error && <p className="inferenceError">{error}</p>}
      <PredictionOutput output={shownOutput} classification={target.metadata.task === "classification"} />
    </div>
  );
}

function ValidationResult({ result }) {
  if (!result) return null;
  return (
    <div className="validationResult">
      <div><p className="eyebrow">Validation</p><h3>{result.modelId}</h3></div>
      <dl>
        <div><dt>Samples</dt><dd>{result.samples}</dd></div>
        <div><dt>Loss</dt><dd>{Number(result.loss).toFixed(5)}</dd></div>
        {result.accuracy != null && <div><dt>Accuracy</dt><dd>{(result.accuracy * 100).toFixed(1)}%</dd></div>}
      </dl>
    </div>
  );
}

function ResultsPanel({ logs, lossHistory, activationLayers, inferenceTarget, inferenceResult, validationResult, predict }) {
  const lastLoss = lossHistory.at(-1)?.loss;
  const [activeView, setActiveView] = useState("training");
  const views = [
    { id: "training", label: "Training", ready: lossHistory.length > 0 },
    { id: "neurons", label: "Neurons", ready: activationLayers.length > 0 },
    { id: "inference", label: "Inference", ready: Boolean(inferenceTarget) },
    { id: "console", label: "Console", ready: logs.length > 0 },
  ];

  return (
    <section className="resultsPanel" aria-live="polite">
      <div className="sectionHeading">
        <div>
          <p className="eyebrow">Output</p>
          <h2>Training results</h2>
        </div>
      </div>

      <nav className="resultsTabs" aria-label="Output views">
        {views.map((view) => (
          <button
            type="button"
            key={view.id}
            className={activeView === view.id ? "active" : ""}
            onClick={() => setActiveView(view.id)}
          >
            {view.label}{view.ready && <span />}
          </button>
        ))}
      </nav>

      <div className="resultView">
        {activeView === "training" && (
          <>
            <div className="metricRow">
              <div><span>Epochs</span><strong>{lossHistory.length || "—"}</strong></div>
              <div><span>Latest loss</span><strong>{lastLoss == null ? "—" : formatChartNumber(lastLoss)}</strong></div>
            </div>
            <LossChart lossHistory={lossHistory} />
            <ValidationResult result={validationResult} />
          </>
        )}

        {activeView === "neurons" && <ActivationHeatmap layers={activationLayers} />}

        {activeView === "inference" && (
          inferenceTarget
            ? <InferencePanel target={inferenceTarget} initialResult={inferenceResult} predict={predict} />
            : <div className="resultEmpty"><span className="placeholderIcon"><Icon name="spark" /></span><p>Add an inference block after training to use this view.</p></div>
        )}

        {activeView === "console" && (
          <>
            <div className="logHeader">
              <span>Console</span>
              <span>{logs.length} {logs.length === 1 ? "entry" : "entries"}</span>
            </div>
            <textarea
              id="logs"
              aria-label="Execution logs"
              value={logs.length === 0 ? "Waiting for a run…" : logs.join("\n")}
              rows={8}
              readOnly
            />
          </>
        )}
      </div>
    </section>
  );
}
async function fullExecution(workspace, logger) {
  const code = Interpreter(workspace);

  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL("./worker/nnExecutionWorker.js", import.meta.url),
      { type: "module" }
    );
    const pendingPredictions = new Map();
    let nextRequestId = 1;
    let trainingSettled = false;

    const client = {
      predict(modelId, values) {
        return new Promise((resolvePrediction, rejectPrediction) => {
          const requestId = nextRequestId;
          nextRequestId += 1;
          pendingPredictions.set(requestId, {
            resolve: resolvePrediction,
            reject: rejectPrediction,
          });
          worker.postMessage({ type: "PREDICT", requestId, modelId, values });
        });
      },
      terminate() {
        worker.terminate();
        const error = new Error("The model worker was stopped.");
        pendingPredictions.forEach(({ reject: rejectPrediction }) => rejectPrediction(error));
        pendingPredictions.clear();
      },
    };

    worker.onmessage = (event) => {
      const data = event.data;
      if (data?.type === "TRAINING_COMPLETE") {
        trainingSettled = true;
        resolve(client);
      } else if (data?.type === "PREDICTION_RESULT") {
        const pending = pendingPredictions.get(data.requestId);
        pendingPredictions.delete(data.requestId);
        pending?.resolve(data.output);
      } else if (data?.type === "ERROR") {
        const error = new Error(data.message);
        if (data.requestId != null) {
          const pending = pendingPredictions.get(data.requestId);
          pendingPredictions.delete(data.requestId);
          pending?.reject(error);
        } else if (!trainingSettled) {
          client.terminate();
          reject(error);
        } else {
          logger({ type: "worker-error", message: error.message });
        }
      } else {
        logger(data);
      }
    };

    worker.onerror = (error) => {
      client.terminate();
      if (!trainingSettled) reject(error);
      else logger({ type: "worker-error", message: error.message });
    };

    worker.postMessage({ type: "START_TRAINING", code });
  });
}
function LowerElements({ workspace }) {
  const [logs, setLogs] = useState([]);
  const [lossHistory, setLossHistory] = useState([]);
  const [activationLayers, setActivationLayers] = useState([]);
  const [inferenceTarget, setInferenceTarget] = useState(null);
  const [inferenceResult, setInferenceResult] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [executionClient, setExecutionClient] = useState(null);
  const executionClientRef = useRef(null);

  useEffect(() => () => executionClientRef.current?.terminate(), []);

  async function executeWorkspace() {
    if (!workspace || isRunning) return;

    executionClientRef.current?.terminate();
    executionClientRef.current = null;
    setExecutionClient(null);
    setLogs(["Starting training worker…"]);
    setLossHistory([]);
    setActivationLayers([]);
    setInferenceTarget(null);
    setInferenceResult(null);
    setValidationResult(null);
    setIsRunning(true);

    try {
      const client = await fullExecution(workspace, (message) => {
        if (typeof message === "object" && message.type === "epoch") {
          setLossHistory((current) => [...current, {
            epoch: message.epoch,
            loss: message.loss,
            valLoss: message.valLoss,
            accuracy: message.accuracy,
            valAccuracy: message.valAccuracy,
          }]);
          setLogs((current) => [
            ...current,
            `Epoch ${message.epoch}: loss=${formatChartNumber(message.loss)}`,
          ]);
          return;
        }
        if (typeof message === "object" && message.type === "activation-map") {
          setActivationLayers(message.layers);
          return;
        }
        if (typeof message === "object" && message.type === "model-trained") {
          setLogs((current) => [...current, `Model ${message.modelId} is trained and ready.`]);
          return;
        }
        if (typeof message === "object" && message.type === "inference-ready") {
          setInferenceTarget(message);
          return;
        }
        if (typeof message === "object" && message.type === "inference-result") {
          setInferenceResult(message);
          setLogs((current) => [...current, `Inference (${message.modelId}): ${message.output.join(", ")}`]);
          return;
        }
        if (typeof message === "object" && message.type === "validation") {
          setValidationResult(message);
          setLogs((current) => [...current, `Validation (${message.modelId}): loss ${message.loss}${message.accuracy == null ? "" : `, accuracy ${(message.accuracy * 100).toFixed(1)}%`}`]);
          return;
        }
        if (typeof message === "object" && message.type === "worker-error") {
          setLogs((current) => [...current, `Worker error: ${message.message}`]);
          return;
        }
        setLogs((current) => [...current, formatLogPart(message)]);
      });
      executionClientRef.current = client;
      setExecutionClient(client);
      setLogs((current) => [...current, "Execution complete."]);
    } catch (error) {
      setLogs((current) => [...current, `Error: ${formatLogPart(error)}`]);
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <>
      <div className="executeBar">
        <button type="button" onClick={executeWorkspace} disabled={!workspace || isRunning} className="executeButton">
          {isRunning ? <span className="spinner" /> : <Icon name="play" />}
          {isRunning ? "Training…" : "Run model"}
        </button>
      </div>
      <div className="resultsMain">
        <HelpDesk workspace={workspace} />
        <ResultsPanel
          logs={logs}
          lossHistory={lossHistory}
          activationLayers={activationLayers}
          inferenceTarget={inferenceTarget}
          inferenceResult={inferenceResult}
          validationResult={validationResult}
          predict={executionClient?.predict}
          isRunning={isRunning}
        />
      </div>
    </>
  );
}async function setupTensorFlow() {
  console.log(tf.getBackend())
  if ('gpu' in navigator) {
    try {
      await tf.setBackend('webgpu');
      await tf.ready();
      console.log('Successfully running on WebGPU:', tf.getBackend());
      return;
    } catch (e) {
      console.warn('WebGPU failed to initialize, falling back to WebGL...', e);
    }
  } else {
    console.warn('WebGPU is not supported on this browser.');
    alert(
      'WebGPU is not set up in this browser! This might result in:\n 1. Slower Performance\n 2. More CPU usage than normal.'
    );
  }

  await tf.setBackend('webgl');
  await tf.ready();
  console.log('Running on fallback backend:', tf.getBackend());
}

function App() {
  const [workspace, setWorkspace] = useState(null);
  const [isTfReady, setIsTfReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    setupTensorFlow().then(() => {
      if (isMounted) {
        setIsTfReady(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isTfReady) {
    return (
      <div className="appShell">
        <div className="loadingSpinner">Initializing TensorFlow...</div>
      </div>
    );
  }

  return (
    <div className="appShell">
      <header className="appHeader">
        <div className="brandCopy">
          <strong>Neural Network Lab</strong>
          <span>An easy-to-use visual model builder for simple neural networks.</span>
        </div>

        <div className="headerMeta">
          <a href="https://github.com/RA86-dev/Project_NN_Lab" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
        <div className="headerMeta">
          <a href="/project_NN_Lab/">Playground</a>
        </div>
        <div className="headerMeta">
          <a href="/project_NN_Lab/fileManager.html">File Manager</a>
        </div>
      </header>

      <main>
        <section className="workspacePanel">
          <div className="workspaceHeading">
            <div>
              <h1>Build a Neural Network</h1>
            </div>
            <p>
              Drag blocks from the library and connect them into a training pipeline. First, always
              start with the Main Program input block. Connect all other blocks using that. For
              inference using a model, please set a decent name for it.
            </p>
          </div>
          <div className="canvasFrame">
            <BlocklyEditor setWorkspace={setWorkspace} />
          </div>
          <LowerElements workspace={workspace} />
        </section>
      </main>
    </div>
  );
}

export default App;
