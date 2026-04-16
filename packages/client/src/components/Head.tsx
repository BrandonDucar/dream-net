import { useEffect } from 'react';

interface HeadProps {
  children: React.ReactNode;
}

export default function Head({ children }: HeadProps) {
  useEffect(() => {
    const elements: HTMLElement[] = [];
    
    // Parse children and create meta tags
    const processChildren = (child: any) => {
      if (!child || !child.props) return;
      
      const { type, props } = child;
      
      if (type === 'title') {
        document.title = props.children;
      } else if (type === 'meta') {
        const meta = document.createElement('meta');
        Object.keys(props).forEach(key => {
          if (key !== 'children') {
            meta.setAttribute(key, props[key]);
          }
        });
        
        // Remove existing meta with same property or name
        const existing = document.querySelector(
          `meta[property="${props.property}"], meta[name="${props.name}"]`
        );
        if (existing) existing.remove();
        
        document.head.appendChild(meta);
        elements.push(meta);
      }
    };

    // Handle both single child and array of children
    if (Array.isArray(children)) {
      children.forEach(processChildren);
    } else {
      processChildren(children);
    }

    // Cleanup function
    return () => {
      elements.forEach(el => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    };
  }, [children]);

  return null;
}