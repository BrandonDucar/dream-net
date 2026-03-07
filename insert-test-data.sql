INSERT INTO documents (content, metadata) VALUES 
('Test document 1', '{"type": "test", "category": "sample"}'),
('Test document 2', '{"type": "test", "category": "sample"}'),
('DreamNet vector safety demo', '{"type": "demo", "category": "infrastructure"}'),
('AI safety research document', '{"type": "research", "category": "safety"}'),
('Infrastructure deployment guide', '{"type": "guide", "category": "ops"}');

SELECT COUNT(*) as document_count FROM documents;
SELECT * FROM documents ORDER BY doc_id;
