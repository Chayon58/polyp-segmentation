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
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-orange-100 to-yellow-50 text-gray-800 font-[Poppins]">
      {/* ===================== 🌅 NAVBAR ===================== */}
      <header className="bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-wide drop-shadow-lg">
            🌅 Polyp Segmentation Portal
          </h1>
        <nav
  className="flex flex-row flex-wrap justify-center items-center"
  style={{ gap: "16px", padding: "10px 0" }} // ✅ guaranteed spacing even if Tailwind gap fails
>
  {["home", "upload", "demo", "about"].map((p) => (
    <button
      key={p}
      onClick={() => setPage(p)}
      className={`px-5 py-2 rounded-full font-bold text-white transition-all duration-300 shadow-md border-none
        ${
          page === p
            ? "bg-green-600 scale-105"
            : "bg-orange-500 hover:bg-green-600 hover:shadow-lg hover:scale-105"
        }`}
      style={{
        backgroundColor: page === p ? "#B6F500" : "#FC4100", // Force orange colors
        margin: "8px", // ✅ fallback spacing between buttons,
        padding: "12px 20px", // ✅ consistent padding
        color: "white", // ✅ Force text color
        fontWeight: "700", // ✅ Force bold text
        fontFamily: "Poppins, Arial, sans-serif", // ✅ Modern clean font
        letterSpacing: "0.5px"
      }}
    >
      {p.charAt(0).toUpperCase() + p.slice(1)}
    </button>
  ))}
</nav>



        </div>
      </header>

      {/* ===================== 🌄 MAIN ===================== */}
      <main className="container mx-auto px-6 py-12">
        {/* ===================== HOME PAGE ===================== */}
        {page === "home" && (
          <section className="text-center py-10">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600 mb-4">
              Automated Polyp Segmentation
            </h2>
            <p className="max-w-2xl mx-auto text-gray-700 mb-6">
              Upload colonoscopy images and automatically detect and segment
              polyps using advanced AI-based segmentation models.
            </p>
            <button
              onClick={() => setPage("upload")}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full shadow-md hover:from-orange-600 hover:to-pink-600 transition transform hover:scale-105"
            >
              🚀 Try Upload
            </button>
          </section>
        )}

        {/* ===================== UPLOAD PAGE ===================== */}
   {page === "upload" && (
  <section className="bg-white/70 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-2xl shadow-lg border border-orange-200 max-w-md sm:max-w-lg mx-auto mt-8">
    <h2 className="text-2xl font-semibold text-orange-600 mb-3 text-center">
      Upload Colonoscopy Image
    </h2>

    {/* 🔸 Smaller Upload Box */}
    <div className="border-2 border-dashed border-orange-300 rounded-xl p-3 sm:p-4 text-center hover:border-orange-500 transition bg-white/40">
      <input
        type="file"
        id="fileInput"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
      <label
        htmlFor="fileInput"
        className="cursor-pointer flex flex-col items-center justify-center text-orange-600 text-sm sm:text-base py-3"
      >
        {/* 🔽 Smaller Upload Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 sm:h-7 sm:w-7 mb-1 text-orange-500"
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
          <span className="text-gray-800 font-medium truncate max-w-[140px]">
            {imageFile.name}
          </span>
        ) : (
          <span className="text-xs sm:text-sm">
            <strong>Click to upload</strong> or drag & drop
          </span>
        )}
      </label>
    </div>

    {/* Preview */}
    {previewUrl && (
      <div className="mt-4">
        <h3 className="font-medium text-orange-600 mb-2 text-center">
          Preview:
        </h3>
        <div className="flex justify-center">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full max-w-xs sm:max-w-sm rounded-xl shadow-md border border-orange-200"
          />
        </div>
      </div>
    )}

    {/* Run Segmentation Button */}
    <div className="mt-5 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-3">
      <button
        onClick={handleRunSegmentation}
        disabled={loading}
        className="px-5 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full shadow-md hover:from-orange-600 hover:to-pink-600 disabled:opacity-60 transition transform hover:scale-105"
      >
        {loading ? "Processing..." : "Run Segmentation"}
      </button>
      {error && <p className="text-red-600 text-sm text-center">{error}</p>}
    </div>

    {/* Segmentation Result */}
    {segResultUrl && (
      <div className="mt-5">
        <h3 className="font-medium text-orange-600 mb-2 text-center">
          Segmentation Result:
        </h3>
        <div className="flex justify-center">
          <img
            src={segResultUrl}
            alt="Segmentation Result"
            className="w-full max-w-xs sm:max-w-sm rounded-xl shadow-md border border-orange-200"
          />
        </div>
        <div className="text-center mt-3">
          <a
            href={segResultUrl}
            download="segmentation.png"
            className="text-pink-600 underline text-sm hover:text-orange-600"
          >
            ⬇️ Download Result
          </a>
        </div>
      </div>
    )}
  </section>
)}



        {/* ===================== DEMO PAGE ===================== */}
        {page === "demo" && (
  <section className="relative overflow-hidden p-10 sm:p-14 rounded-3xl shadow-2xl border border-orange-200 max-w-4xl mx-auto mt-10 bg-gradient-to-br from-yellow-100 via-pink-100 to-orange-100">
    
    {/* 🌈 Background Glow Effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-pink-300/30 via-yellow-200/30 to-orange-300/30 blur-3xl opacity-70 -z-10"></div>

    <h2 className="text-4xl font-extrabold text-green-700 mb-6 text-center drop-shadow-md">
      🌅 Explore the Demo
    </h2>

    <p className="text-gray-800 max-w-2xl mx-auto mb-10 text-center text-lg">
      Experience how our <span className="text-orange-600 font-semibold">AI-powered Polyp Segmentation</span> 
      system processes colonoscopy images and highlights potential polyps automatically.
    </p>

    {/* 🔸 Steps Section */}
    <div className="grid sm:grid-cols-3 gap-8 text-left">
      {/* Step 1 */}
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-green-200 hover:shadow-2xl hover:scale-105 transition-all duration-300">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl text-green-600 animate-bounce">📤</span>
          <h3 className="text-green-700 font-semibold text-lg">1. Upload</h3>
        </div>
        <p className="text-gray-700 text-sm">
          Choose a colonoscopy image and upload it to start the segmentation workflow.
        </p>
      </div>

      {/* Step 2 */}
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-pink-200 hover:shadow-2xl hover:scale-105 transition-all duration-300">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl text-pink-500 animate-pulse">⚙️</span>
          <h3 className="text-pink-600 font-semibold text-lg">2. Process</h3>
        </div>
        <p className="text-gray-700 text-sm">
          The uploaded image is processed by a deep learning segmentation model in seconds.
        </p>
      </div>

      {/* Step 3 */}
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-yellow-200 hover:shadow-2xl hover:scale-105 transition-all duration-300">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl text-yellow-500 animate-pulse">✨</span>
          <h3 className="text-yellow-600 font-semibold text-lg">3. Visualize</h3>
        </div>
        <p className="text-gray-700 text-sm">
          Instantly view and download the segmented image with highlighted polyps.
        </p>
      </div>
    </div>

    {/* 🔘 Call-to-Action */}
    <div className="mt-10 flex justify-center">
      <button
        onClick={() => setPage("upload")}
        className="px-8 py-3 bg-green-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700 hover:shadow-xl transition-transform transform hover:scale-105"
      >
        🚀 Try Segmentation Now
      </button>
    </div>

    {/* 🌤 Decorative Gradient Circles */}
    <div className="absolute -top-10 -right-10 w-48 h-48 bg-pink-400/30 rounded-full blur-3xl"></div>
    <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-yellow-300/30 rounded-full blur-3xl"></div>
  </section>
)}


        {/* ===================== ABOUT PAGE ===================== */}
        {page === "about" && (
          <section className="bg-white/70 p-8 rounded-2xl shadow-xl border border-orange-200 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-orange-600 mb-4">
              About this Project
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              This web application provides a clean, elegant, and sunrise-themed
              interface for colon polyp segmentation research. Designed for
              researchers and clinicians, it can be integrated with AI inference
              APIs or used as a demonstration tool.
            </p>
          </section>
        )}
      </main>

      {/* ===================== 🌇 FOOTER ===================== */}
      <footer className="bg-gradient-to-r from-pink-500 to-orange-400 text-white py-6 mt-16">
        <div className="container mx-auto text-center">
          <p className="font-medium text-sm">
            © {new Date().getFullYear()} Polyp Segmentation — Built for
            Medical AI Research 🌤️
          </p>
          <p className="text-xs text-yellow-100 mt-2">
            Designed using React & TailwindCSS
          </p>
          <div className="flex justify-center items-center gap-2 mb-3">
      <a
        href="mailto:chayonbiswas872@gmail.com"
        className="text-sm text-white hover:text-yellow-200 underline underline-offset-4 transition"
      >
        chayonbiswas872@gmail.com
      </a>
    </div>

        </div>
      </footer>
    </div>
  );
}
