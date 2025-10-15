import React, { useState, useRef } from "react";

export default function MoodCheck({ onResult }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setImage(url);
  }

  function analyze() {
    if (!image) return alert("Please upload a selfie or an image.");
    setLoading(true);
    setTimeout(() => {
      const emotions = [
        { label: "Calm", score: 0.9 },
        { label: "Happy", score: 0.85 },
        { label: "Neutral", score: 0.7 },
        { label: "Anxious", score: 0.6 },
        { label: "Sad", score: 0.55 },
        { label: "Stressed", score: 0.5 },
      ];
      const idx = Math.floor(Math.random() * emotions.length);
      const result = emotions[idx];
      setLoading(false);
      onResult(result);
      alert(`Detected: ${result.label} (${Math.round(result.score * 100)}%)`);
    }, 900);
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Mood Check (Image)</h2>
      <p className="text-gray-600 mb-4">
        Upload a recent selfie to get a quick, private mood estimate.
      </p>
      <div className="bg-white p-6 rounded-lg shadow flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="h-64 w-full border border-dashed rounded flex items-center justify-center overflow-hidden bg-gray-50">
            {image ? (
              <img src={image} alt="preview" className="object-cover h-full w-full" />
            ) : (
              <div className="text-gray-400">No image selected</div>
            )}
          </div>
          <div className="mt-3 flex gap-3">
            <input ref={fileRef} accept="image/*" type="file" onChange={handleFile} className="hidden" id="mood-file" />
            <label htmlFor="mood-file" onClick={() => fileRef.current && fileRef.current.click()} className="px-4 py-2 bg-indigo-600 text-white rounded cursor-pointer">Upload Photo</label>
            <button onClick={analyze} className="px-4 py-2 bg-sky-500 text-white rounded">Analyze</button>
          </div>
        </div>
        <div className="w-80 bg-sky-50 p-4 rounded">
          <h3 className="font-medium">Result</h3>
          <div className="mt-3">{loading ? "Analyzing..." : "No analysis yet."}</div>
        </div>
      </div>
    </div>
  );
}
