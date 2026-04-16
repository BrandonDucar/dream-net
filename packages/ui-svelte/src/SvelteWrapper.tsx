import React, { useEffect, useRef } from 'react';

interface SvelteWrapperProps {
    component: any;
    props?: any;
    className?: string;
}

export const SvelteWrapper: React.FC<SvelteWrapperProps> = ({ component: SvelteComponent, props = {}, className = "" }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const instanceRef = useRef<any>(null);

    useEffect(() => {
        if (containerRef.current) {
            instanceRef.current = new SvelteComponent({
                target: containerRef.current,
                props
            });
        }

        return () => {
            if (instanceRef.current) {
                instanceRef.current.$destroy();
                instanceRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (instanceRef.current) {
            instanceRef.current.$set(props);
        }
    }, [props]);

    return <div ref={containerRef} className={className} />;
};
