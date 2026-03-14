import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { useThemeStore } from '../../stores/useThemeStore';
import { atomDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownViewerProps {
    content: string;
    className?: string;
}

const MarkdownViewer = ({ content, className = "" }: MarkdownViewerProps) => {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';

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
                                    style={isDark ? atomDark : oneLight}
                                    language={match ? match[1] : 'text'}
                                    PreTag="div"
                                    className="!rounded-lg !my-4 !bg-slate-50 dark:!bg-[#1e293b] border border-slate-200 dark:border-[#334155] w-fit max-w-full overflow-x-auto shadow-sm"
                                >
                                    {String(children || '').replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            );
                        }
                        return (
                            <code {...props} className={`${className || ''} inline bg-slate-50 dark:bg-[#334155] border border-slate-200 dark:border-[#334155] px-1.5 py-0.5 mx-0.5 rounded text-red-500 dark:text-red-400 font-mono text-[14px] transition-colors`.trim()}>
                                {children}
                            </code>
                        );
                    },
                    p: ({ children }) => <p className="mb-4 last:mb-0 leading-relaxed text-slate-700 dark:text-[#f8fafc]">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc ml-6 mb-4 text-slate-700 dark:text-[#f8fafc]">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal ml-6 mb-4 text-slate-700 dark:text-[#f8fafc]">{children}</ol>,
                    h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 text-slate-800 dark:text-[#f8fafc]">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-bold mb-3 text-slate-800 dark:text-[#f8fafc]">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-bold mb-2 text-slate-800 dark:text-[#f8fafc]">{children}</h3>,
                    blockquote: ({ children }) => <blockquote className="border-l-4 border-slate-200 dark:border-[#334155] pl-4 italic mb-4 text-slate-600 dark:text-[#94a3b8] bg-slate-50/50 dark:bg-[#1e293b]/30 py-1 rounded-r">{children}</blockquote>,
                    a: ({ children, href }) => <a href={href} className="text-blue-600 dark:text-blue-400 hover:underline font-bold" target="_blank" rel="noopener noreferrer">{children}</a>,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownViewer;
