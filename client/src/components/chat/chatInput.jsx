import { useEffect, useRef, useState } from "react";
import { Paperclip, Mic, SendHorizontal, X, } from "lucide-react";
import IconButton from "../ui/IconButton";
function ChatInput({ onSend, isTyping, stopGenerating, }) {

  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      textareaRef.current.scrollHeight + "px";
  }, [message]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const startListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;

    let finalTranscript = "";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {

      let interimTranscript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {

        const transcript =
          event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }

      }

      const transcript = (
        finalTranscript + interimTranscript
      ).trim();

      setMessage((prev) => {
        if (!prev.trim()) return transcript;

        return `${prev} ${transcript}`;
      });
    };

    recognition.onerror = (event) => {
      console.log(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedFile(file);
  };

  const removeFile = () => {

    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

  };

  const handleSend = () => {

    if (!message.trim() && !selectedFile) return;

    recognitionRef.current?.stop();

    onSend(message, selectedFile);

    setMessage("");
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setTimeout(() => {

      if (textareaRef.current) {

        textareaRef.current.style.height =
          "auto";

      }

    }, 0);

  };

  return (
    <div className="border-t border-zinc-800 bg-black p-5">

      <div className="max-w-5xl mx-auto">

        {/* Selected File */}
        {selectedFile && (
          <div className="mb-3 flex items-center justify-between rounded-xl bg-zinc-800 px-4 py-3">

            <div className="truncate text-sm text-white">
              📎 {selectedFile.name}
            </div>

            <button
              onClick={removeFile}
              className="text-red-400 hover:text-red-500 transition"
            >
              <X size={18} />
            </button>

          </div>
        )}

        {/* Listening */}
        {isListening && (
          <div className="mb-2 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">

            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>

            Listening...

          </div>
        )}

        {/* Input Box */}
        <div className="flex items-end gap-3 rounded-2xl border border-zinc-700 bg-zinc-900 px-3 py-2">

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept=".pdf,.txt,.doc,.docx,image/*"
            onChange={handleFileSelect}
          />

          {/* File Button */}
          <IconButton
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip size={20} />
          </IconButton>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {

              if (
                e.key === "Enter" &&
                !e.shiftKey
              ) {

                e.preventDefault();

                handleSend();

              }

            }}
            rows={1}
            placeholder="Message Nova AI..."
            className="
            flex-1
            resize-none
            bg-transparent
            outline-none
            text-white
            placeholder:text-gray-400
            py-3
            max-h-48
            overflow-y-auto
          "
          />

          {/* Voice */}
          <IconButton
            onClick={startListening}
          >
            <Mic
              size={20}
              className={`transition-all duration-300 ${isListening
                ? "text-red-500 scale-110 animate-pulse"
                : "hover:text-white"
                }`}
            />
          </IconButton>

          {/* Send / Stop */}
          <button
            onClick={() => {

              if (isTyping) {

                stopGenerating();

              } else {

                handleSend();

              }

            }}
            className="
            h-10
            w-10
            rounded-full
            bg-white
            text-black
            flex
            items-center
            justify-center
            hover:bg-gray-200
            transition
            disabled:opacity-50
          "
          >

            {isTyping ? (

              <div className="h-3 w-3 rounded-sm bg-black" />

            ) : (

              <SendHorizontal size={18} />

            )}

          </button>

        </div>

      </div>

    </div>
  );
}

export default ChatInput;