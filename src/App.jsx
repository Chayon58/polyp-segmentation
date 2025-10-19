import React, { useState } from "react";

export default function App() {
  const [page, setPage] = useState("home");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [segResultUrl, setSegResultUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setSegResultUrl(null);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
  }

  async function handleRunSegmentation() {
    setError(null);
    if (!imageFile) {
      setError("Please upload an image first.");
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append("image", imageFile);

      const res = await fetch("/api/segment", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Server error: ${res.status} ${txt}`);
      }

      const data = await res.json();
      if (data.segmentation_image_url) {
        setSegResultUrl(data.segmentation_image_url);
      } else if (data.segmentation_base64) {
        setSegResultUrl(`data:image/png;base64,${data.segmentation_base64}`);
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            Polyp Segmentation in Colonoscopy
          </h1>
          <nav className="space-x-4">
            <button onClick={() => setPage("home")} className="hover:underline">
              Home
            </button>
            <button onClick={() => setPage("upload")} className="hover:underline">
              Upload
            </button>
            <button onClick={() => setPage("demo")} className="hover:underline">
              Demo
            </button>
            <button onClick={() => setPage("about")} className="hover:underline">
              About
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* ===================== 🏠 HOME PAGE ===================== */}
        {page === "home" && (
          <section className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Automated Polyp Segmentation
            </h2>
            <p className="max-w-2xl mx-auto text-gray-700 mb-6">
              Upload colonoscopy images and automatically segment polyps using a
              deep learning model.
            </p>
            <button
              onClick={() => setPage("upload")}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
            >
              Try Upload
            </button>
          </section>
        )}

        {/* ===================== 🖼️ UPLOAD PAGE ===================== */}
        {page === "upload" && (
          <section className="bg-white p-8 rounded-2xl shadow-md max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">
              Upload Colonoscopy Image
            </h2>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-400 transition">
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
              />
              <label
                htmlFor="fileInput"
                className="cursor-pointer flex flex-col items-center justify-center text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mb-2 text-indigo-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01.88-2.51L12 7l4.12 6.49A4 4 0 0117 16m-5 0v4m0 0H9m3 0h3"
                  />
                </svg>
                {imageFile ? (
                  <span className="text-gray-800 font-medium">
                    {imageFile.name}
                  </span>
                ) : (
                  <span>
                    <strong>Click to upload</strong> or drag & drop
                  </span>
                )}
              </label>
            </div>

            {previewUrl && (
              <div className="mt-6">
                <h3 className="font-medium mb-2">Preview:</h3>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full rounded-xl shadow"
                />
              </div>
            )}

            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={handleRunSegmentation}
                disabled={loading}
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60"
              >
                {loading ? "Processing..." : "Run Segmentation"}
              </button>

              {error && <p className="text-red-600 text-sm">{error}</p>}
            </div>

            {segResultUrl && (
              <div className="mt-6">
                <h3 className="font-medium mb-2">Segmentation Result:</h3>
                <img
                  src={segResultUrl}
                  alt="Segmentation Result"
                  className="w-full rounded-xl shadow"
                />
                <a
                  href={segResultUrl}
                  download="segmentation.png"
                  className="inline-block mt-2 text-indigo-600 underline text-sm"
                >
                  Download Result
                </a>
              </div>
            )}
          </section>
        )}

        {/* ===================== DEMO PAGE ===================== */}
        {page === "demo" && (
          <section className="text-center text-gray-700">
            <h2 className="text-2xl font-semibold mb-2">Demo Instructions</h2>
            <p>
              This demo shows how the segmentation workflow would look once the
              backend model is connected.
            </p>
          </section>
        )}

        {/* ===================== ABOUT PAGE ===================== */}
        {page === "about" && (
          <section className="bg-white p-8 rounded-2xl shadow-md max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">About this Project</h2>
            <p className="text-gray-700 mb-4">
              This web app provides a minimal and elegant frontend for colon
              polyp segmentation research. You can connect it with your model
              inference API or use it as a standalone UI shell.
            </p>
          </section>
        )}
      </main>

      <footer className="bg-white border-t py-6 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Polyp Segmentation — built for research
        demos.
      </footer>
    </div>
  );
}

