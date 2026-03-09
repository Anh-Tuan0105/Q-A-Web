import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownViewerProps {
    content: string;
    className?: string;
}

const MarkdownViewer = ({ content, className = "" }: MarkdownViewerProps) => {
    return (
        <div className={`markdown-body ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        if (!inline) {
                            return (
                                <SyntaxHighlighter
                                    {...props}
                                    style={oneLight}
                                    language={match ? match[1] : 'text'}
                                    PreTag="div"
                                    className="!rounded-lg !my-4 !bg-slate-50 border border-slate-200 w-fit max-w-full overflow-x-auto"
                                >
                                    {String(children || '').replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            );
                        }
                        return (
                            <code {...props} className={`${className || ''} inline bg-slate-50 border border-slate-200 px-1 py-0.5 mx-0.5 rounded text-red-500 font-mono text-[14px]`.trim()}>
                                {children}
                            </code>
                        );
                    },
                    // Style other elements if needed
                    p: ({ children }) => <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc ml-6 mb-4">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal ml-6 mb-4">{children}</ol>,
                    h1: ({ children }) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-bold mb-3">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-bold mb-2">{children}</h3>,
                    blockquote: ({ children }) => <blockquote className="border-l-4 border-slate-200 pl-4 italic mb-4">{children}</blockquote>,
                    a: ({ children, href }) => <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownViewer;
