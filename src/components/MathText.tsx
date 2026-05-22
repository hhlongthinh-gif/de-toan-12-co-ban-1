import React from 'react';
import katex from 'katex';

interface MathTextProps {
  text: string;
  block?: boolean;
  className?: string;
}

export const MathText: React.FC<MathTextProps> = ({ text, block = false, className = '' }) => {
  if (!text) return null;

  // Handle double dollar block equations
  if (text.startsWith('$$') && text.endsWith('$$') && text.length > 4) {
    const formula = text.slice(2, -2);
    try {
      const html = katex.renderToString(formula, { displayMode: true, throwOnError: false });
      return <div className={`math-block ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
    } catch (e) {
      return <div className={`error-math text-red-500 my-2 ${className}`}>{text}</div>;
    }
  }

  // Handle single dollar inline equation (full string is math)
  if (text.startsWith('$') && text.endsWith('$') && text.length > 2) {
    const formula = text.slice(1, -1);
    try {
      const html = katex.renderToString(formula, { displayMode: block, throwOnError: false });
      return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
    } catch (e) {
      return <span className={className}>{text}</span>;
    }
  }

  // Handle mixed text with multiple formulas: text $formula$ text $$block_formula$$ ...
  try {
    // Split by block equations first, then inline ones
    const blockParts = text.split(/(\$\$.*?\$\$)/gs);
    
    return (
      <span className={className}>
        {blockParts.map((blockPart, bIdx) => {
          if (blockPart.startsWith('$$') && blockPart.endsWith('$$')) {
            const formula = blockPart.slice(2, -2);
            try {
              const html = katex.renderToString(formula, { displayMode: true, throwOnError: false });
              return <div key={`b-${bIdx}`} className="math-block" dangerouslySetInnerHTML={{ __html: html }} />;
            } catch (e) {
              return <span key={`b-err-${bIdx}`} className="text-red-500 font-mono text-xs">{blockPart}</span>;
            }
          }
          
          // Now split this text block by inline dollar signs
          const inlineParts = blockPart.split(/(\$.*?\$)/g);
          return (
            <React.Fragment key={`b-txt-${bIdx}`}>
              {inlineParts.map((inlinePart, iIdx) => {
                if (inlinePart.startsWith('$') && inlinePart.endsWith('$')) {
                  const formula = inlinePart.slice(1, -1);
                  try {
                    const html = katex.renderToString(formula, { displayMode: false, throwOnError: false });
                    return <span key={`i-${iIdx}`} dangerouslySetInnerHTML={{ __html: html }} />;
                  } catch (e) {
                    return <span key={`i-err-${iIdx}`} className="text-red-500 font-mono text-xs">{inlinePart}</span>;
                  }
                }
                
                // If it contains double asterisks representing bold text like **bold** in descriptions, render them
                if (inlinePart.includes('**')) {
                  const boldParts = inlinePart.split(/(\*\*.*?\*\*)/g);
                  return (
                    <React.Fragment key={`b-bold-${iIdx}`}>
                      {boldParts.map((boldPart, sIdx) => {
                        if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
                          return <strong key={sIdx} className="font-semibold text-slate-800 dark:text-slate-100">{boldPart.slice(2, -2)}</strong>;
                        }
                        return <span key={sIdx}>{boldPart}</span>;
                      })}
                    </React.Fragment>
                  );
                }

                // Handle simple newlines
                if (inlinePart.includes('\n')) {
                  const lineParts = inlinePart.split('\n');
                  return (
                    <React.Fragment key={`b-nl-${iIdx}`}>
                      {lineParts.map((line, lIdx) => (
                        <React.Fragment key={lIdx}>
                          {lIdx > 0 && <br />}
                          {line}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  );
                }

                return <span key={`text-${iIdx}`}>{inlinePart}</span>;
              })}
            </React.Fragment>
          );
        })}
      </span>
    );
  } catch (error) {
    return <span className={className}>{text}</span>;
  }
};
