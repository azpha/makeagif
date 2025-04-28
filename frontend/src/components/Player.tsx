import { useState, useRef, useEffect } from "react";

const ScreenSelectionPlayer = ({
  url,
  id,
  onStepComplete,
}: {
  url: string;
  id: string;
  onStepComplete: () => void;
}) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selection, setSelection] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [timeSegment, setTimeSegment] = useState({ start: 0, end: 0 });
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState({
    width: 0,
    height: 0,
  });
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  const onSubmitVideo = async () => {
    const editedData = {
      id,
      start: timeSegment.start,
      end: timeSegment.end,
      dimensions:
        selection.x && selection.y && selection.width && selection.height
          ? {
              x: selection.x,
              y: selection.y,
              width: selection.width,
              height: selection.height,
            }
          : null,
    };

    await fetch("http://localhost:3001/generate", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(editedData),
    });

    onStepComplete();
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setVideoDuration(video.duration);
      setTimeSegment({ start: 0, end: video.duration });
      setVideoDimensions({
        width: video.videoWidth,
        height: video.videoHeight,
      });
      setVideoLoaded(true);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  const handleMouseDown = (e) => {
    if (isPlaying) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setStartPoint({ x, y });
    setIsSelecting(true);
    setSelection({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e) => {
    if (!isSelecting) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = x - startPoint.x;
    const height = y - startPoint.y;

    setSelection({
      x: width >= 0 ? startPoint.x : x,
      y: height >= 0 ? startPoint.y : y,
      width: Math.abs(width),
      height: Math.abs(height),
    });
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleTimeSegmentChange = (type, value) => {
    setTimeSegment((prev) => {
      const newValue = parseFloat(value);
      if (type === "start") {
        return { ...prev, start: Math.min(newValue, prev.end - 0.5) };
      } else {
        return { ...prev, end: Math.max(newValue, prev.start + 0.5) };
      }
    });
  };

  const playSelectedArea = () => {
    const video = videoRef.current;

    if (!video) return;

    // Set video to start at the segment start time
    video.currentTime = timeSegment.start;

    // In a real implementation, you would use the selection coordinates
    // to crop/focus on that area of the video
    setIsPlaying(true);
    video.play();
  };

  const stopPlaying = () => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = timeSegment.start;
    setIsPlaying(false);
  };

  // Check if we need to stop playback when reaching the end time
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const checkTimeUpdate = () => {
      if (isPlaying && video.currentTime >= timeSegment.end) {
        video.pause();
        setIsPlaying(false);
      }
    };

    video.addEventListener("timeupdate", checkTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", checkTimeUpdate);
    };
  }, [isPlaying, timeSegment.end]);

  return (
    <div className="flex flex-col items-center w-full mx-auto">
      <div className="flex gap-4 my-4">
        <button
          onClick={playSelectedArea}
          disabled={isPlaying || !videoLoaded}
          className={`px-4 py-2 rounded ${
            isPlaying || !videoLoaded
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
        >
          Play Selected Area
        </button>

        <button
          onClick={onSubmitVideo}
          className={`px-4 py-2 rounded text-white`}
        >
          Submit
        </button>

        <button
          onClick={() => setSelection({ x: 0, y: 0, width: 0, height: 0 })}
          disabled={isPlaying || selection.width === 0}
          className={`px-4 py-2 rounded ${
            isPlaying || selection.width === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-600 hover:bg-gray-700"
          } text-white`}
        >
          Clear Selection
        </button>
      </div>

      <div
        ref={containerRef}
        className="relative bg-gray-800 cursor-crosshair overflow-hidden"
        style={{
          width: videoLoaded ? `${videoDimensions.width}px` : "100%",
          height: videoLoaded ? `${videoDimensions.height}px` : "auto",
          maxWidth: "100%",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Video element */}
        <video
          ref={videoRef}
          src={url}
          className="w-full h-full"
          onEnded={() => setIsPlaying(false)}
        />

        {/* Selection overlay */}
        {!isPlaying && selection.width > 0 && selection.height > 0 && (
          <div
            className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20"
            style={{
              left: `${selection.x}px`,
              top: `${selection.y}px`,
              width: `${selection.width}px`,
              height: `${selection.height}px`,
            }}
          />
        )}
      </div>

      {/* Time segment selection */}
      {videoLoaded && (
        <div className="w-full mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Time Segment:</span>
            <span className="text-sm">
              {formatTime(timeSegment.start)} - {formatTime(timeSegment.end)}
            </span>
          </div>

          <div className="flex w-full gap-4 items-center">
            <input
              type="range"
              min="0"
              max={videoDuration}
              step="0.1"
              value={timeSegment.start}
              onChange={(e) => handleTimeSegmentChange("start", e.target.value)}
              className="w-1/2"
            />
            <input
              type="range"
              min="0"
              max={videoDuration}
              step="0.1"
              value={timeSegment.end}
              onChange={(e) => handleTimeSegmentChange("end", e.target.value)}
              className="w-1/2"
            />
          </div>

          {/* Visual representation of video timeline */}
          <div className="relative h-6 bg-gray-200 w-full mt-2 rounded-md overflow-hidden">
            <div
              className="absolute h-full bg-blue-400"
              style={{
                left: `${(timeSegment.start / videoDuration) * 100}%`,
                width: `${
                  ((timeSegment.end - timeSegment.start) / videoDuration) * 100
                }%`,
              }}
            />
            {isPlaying && (
              <div
                className="absolute h-full w-1 bg-red-500"
                style={{
                  left: `${
                    (videoRef.current?.currentTime / videoDuration) * 100
                  }%`,
                  transition: "left 0.1s linear",
                }}
              />
            )}
          </div>
        </div>
      )}

      <div className="mt-4 p-2 bg-gray-100 rounded w-full text-black">
        <p className="text-sm">
          Area Selection: X={Math.round(selection.x)}, Y=
          {Math.round(selection.y)}, Width={Math.round(selection.width)},
          Height={Math.round(selection.height)}
        </p>
        <p className="text-sm mt-1">
          Time Selection: {formatTime(timeSegment.start)} -{" "}
          {formatTime(timeSegment.end)}
          (Duration: {formatTime(timeSegment.end - timeSegment.start)})
        </p>
      </div>
    </div>
  );
};

export default ScreenSelectionPlayer;
