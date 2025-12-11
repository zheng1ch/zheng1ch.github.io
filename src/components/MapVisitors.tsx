"use client";

export default function MapVisitors() {
  return (
    <div className="flex justify-center items-center mt-8">
      <iframe
        src="/visitors.html"
        width="480"
        height="250"
        style={{ border: "none" }}
        loading="lazy"
      />
    </div>
  );
}