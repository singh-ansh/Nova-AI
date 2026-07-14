import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import {
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
} from "lucide-react";

function ChatMessage({
  sender,
  message,
  prompt,
  onRegenerate,
}) {
  const isUser = sender === "user";

  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"
        }`}
    >
      <div
        className={`
          w-fit
          max-w-[95%]
          sm:max-w-[80%]
          px-5
          py-3
          rounded-2xl
          break-words

          ${isUser
            ? "bg-blue-600 text-white"
            : "bg-zinc-800 text-white"
          }
        `}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{

            // ===========================
            // Headings
            // ===========================
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold mt-6 mb-4">
                {children}
              </h1>
            ),

            h2: ({ children }) => (
              <h2 className="text-2xl font-semibold mt-5 mb-3">
                {children}
              </h2>
            ),

            h3: ({ children }) => (
              <h3 className="text-xl font-semibold mt-4 mb-2">
                {children}
              </h3>
            ),

            h4: ({ children }) => (
              <h4 className="text-lg font-semibold mt-3 mb-2">
                {children}
              </h4>
            ),

            // ===========================
            // Paragraph
            // ===========================
            p: ({ children }) => (
              <p className="leading-7 mb-3">
                {children}
              </p>
            ),

            // ===========================
            // Lists
            // ===========================
            ul: ({ children }) => (
              <ul className="list-disc ml-6 my-3">
                {children}
              </ul>
            ),

            ol: ({ children }) => (
              <ol className="list-decimal ml-6 my-3">
                {children}
              </ol>
            ),

            li: ({ children }) => (
              <li className="mb-1">
                {children}
              </li>
            ),

            // ===========================
            // Links
            // ===========================
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 underline"
              >
                {children}
              </a>
            ),

            // ===========================
            // Blockquote
            // ===========================
            blockquote: ({ children }) => (
              <blockquote
                className="
                  border-l-4
                  border-blue-500
                  pl-4
                  italic
                  text-gray-300
                  my-4
                "
              >
                {children}
              </blockquote>
            ),

            // ===========================
            // Tables
            // ===========================
            table: ({ children }) => (
              <div className="overflow-x-auto my-4">
                <table className="border border-zinc-700 w-full">
                  {children}
                </table>
              </div>
            ),

            th: ({ children }) => (
              <th
                className="
                  border
                  border-zinc-700
                  bg-zinc-900
                  px-4
                  py-2
                "
              >
                {children}
              </th>
            ),

            td: ({ children }) => (
              <td
                className="
                  border
                  border-zinc-700
                  px-4
                  py-2
                "
              >
                {children}
              </td>
            ),

            // ===========================
            // Code
            // ===========================
            code({
              className,
              children,
              ...props
            }) {

              const match = /language-(\w+)/.exec(
                className || ""
              );

              const isCodeBlock = !!match;

              if (isCodeBlock) {

                const code = String(children).replace(/\n$/, "");

                return (
                  <div
                    className="
                      my-4
                      overflow-hidden
                      rounded-xl
                      border
                      border-zinc-700
                    "
                  >
                    {/* Header */}
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        bg-zinc-900
                        px-4
                        py-2
                        text-sm
                      "
                    >
                      <span className="text-gray-400">
                        {match[1]}
                      </span>

                      <button
                        onClick={() =>
                          copyToClipboard(code)
                        }
                        className="
                          flex
                          items-center
                          gap-2
                          text-gray-300
                          hover:text-white
                          transition
                        "
                      >
                        {copied ? (
                          <>
                            <Check size={16} />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy size={16} />
                            Copy
                          </>
                        )}
                      </button>
                    </div>

                    {/* Code */}
                    <SyntaxHighlighter
                      wrapLongLines={true}
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{
                        margin: 0,
                        borderRadius: 0,
                        background: "#18181b",
                        overflowX: "auto",
                        fontSize: "14px"
                      }}
                      {...props}
                    >
                      {code}
                    </SyntaxHighlighter>
                  </div>
                );
              }

              // Inline Code
              return (
                <code
                  className="
                    bg-zinc-700
                    text-pink-400
                    px-1.5
                    py-0.5
                    rounded
                    text-sm
                  "
                  {...props}
                >
                  {children}
                </code>
              );
            },
          }}
        >
          {message}
        </ReactMarkdown>
        {
          !isUser && (
            <div className="flex items-center gap-4 mt-4 text-gray-400">

              <button
                className="hover:text-white transition"
                title="Like"
              >
                <ThumbsUp size={18} />
              </button>

              <button
                className="hover:text-white transition"
                title="Dislike"
              >
                <ThumbsDown size={18} />
              </button>

              <button
                onClick={() => copyToClipboard(message)}
                className="hover:text-white transition"
                title="Copy Response"
              >
                {copied ? (
                  <Check size={18} />
                ) : (
                  <Copy size={18} />
                )}
              </button>

              <button
                onClick={() => onRegenerate(prompt)}
                className="hover:text-white transition"
                title="Regenerate"
              >
                <RotateCcw size={18} />
              </button>

            </div>
          )
        }
      </div>
    </div>
  );
}

export default ChatMessage;
